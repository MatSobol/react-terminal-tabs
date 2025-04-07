import {
  ICommandProps,
  ITabProps,
} from "../../interfaces/CommandListInterfaces";
import { CommandFunction, Commands } from "../../interfaces/CommandsInterace";
import { addCommandToPreviousList, setCurrentCommandByIdx } from "./Utility";
import mime from "mime";

export const findAndExecuteCommand = async (
  signal: AbortSignal,
  commandsProps: ICommandProps,
  tabsProps: ITabProps,
  setCarotPos: React.Dispatch<React.SetStateAction<number>>
) => {
  let currentCommand =
    commandsProps.currentCommandRef.current[tabsProps.currTabNum];
  if (currentCommand === "clear" || currentCommand === "cls") {
    clean(commandsProps, tabsProps, setCarotPos);
    return;
  }

  let result: any = "Command not found";

  const regex = />\s*(\S+)$/;
  const match = currentCommand.match(regex);
  const fileDownload = match ? match[1] : null;

  currentCommand = currentCommand.replace(regex, "").trim();

  const argv = currentCommand.split(" ");
  if (argv[0] in commandsProps.commands) {
    try {
      result = await runCommand(
        commandsProps.commands,
        argv,
        tabsProps.currTabNum,
        signal
      );
    } catch (exception) {
      if (exception instanceof Error) {
        result = `Command failed: ${exception.message}`;
      } else {
        result = "Command failed with an unknown error";
      }
    }
  }
  commandsProps.executingCommandsRef.current[tabsProps.currTabNum] = null;
  if (signal.aborted) return;
  if (fileDownload) {
    result = download(result, fileDownload);
  }
  if (typeof result !== "string") {
    result = `result not type of string but ${typeof result}`;
  }
  addCommandToPreviousList(
    [currentCommand, result],
    commandsProps.setPreviousCommandsList,
    tabsProps.currTabNum
  );
  setCurrentCommandByIdx(
    commandsProps.setCurrentCommands,
    tabsProps.currTabNum,
    ""
  );
  if (tabsProps.currTabNumRef.current === tabsProps.currTabNum) setCarotPos(0);
};

const clean = (
  commandsProps: ICommandProps,
  tabsProps: ITabProps,
  setCarotPos: React.Dispatch<React.SetStateAction<number>>
) => {
  setCurrentCommandByIdx(
    commandsProps.setCurrentCommands,
    tabsProps.currTabNum,
    ""
  );
  commandsProps.setPreviousCommandsList((list) =>
    list.map((row, rowIndex) => (rowIndex === tabsProps.currTabNum ? [] : row))
  );
  setCarotPos(0);
  commandsProps.executingCommandsRef.current[tabsProps.currTabNum] = null;
  return;
};

const runCommand = async (
  commands: Commands,
  argv: string[] = [],
  idx: number,
  signal: AbortSignal
) => {
  const chosenCommand = commands[argv[0]];
  let result;
  argv.shift();
  const giveParams = checkParams(chosenCommand, idx, signal);
  const params = [...giveParams, ...argv];
  if (chosenCommand.length === 0) {
    result = chosenCommand();
  } else if (params.length === chosenCommand.length) {
    result = await chosenCommand(...params);
  } else {
    result = `Wrong number of arguments. Given: ${params.length}. Necessary: ${chosenCommand.length}`;
  }
  return result;
};

const checkParams = (
  func: CommandFunction,
  idx: number,
  signal: AbortSignal
) => {
  const res = [];
  var fnStr = func.toString().split("{")[0].split("=>")[0];
  if (fnStr.includes("idx")) {
    res.push(idx);
  }
  if (fnStr.includes("signal")) {
    res.push(signal);
  }
  return res;
};

const download = (result: any, fileDownload: string) => {
  const mimeType = mime.getType(fileDownload);
  if (!mimeType) {
    return "Incorrect file extension";
  }
  let blob;
  try {
    blob = new Blob([result], { type: mimeType });
  } catch {
    return "Couln't parse command result to file";
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = fileDownload;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
  return "Result downloaded";
};
