import {
  ICommandProps,
  ICursorProps,
  ITabProps,
} from "../../interfaces/CommandListInterfaces";
import { useFindAndExecuteCommand } from "./ExecuteCommand";
import {
  useAddCommandToPreviousList,
  useMoveCarotWithoutBlink,
  useSetCurrentCommandAtPosition,
  useSetCurrentCommandByIdx,
} from "./Utility";

export const useHandleInput = (
  commandsProps: ICommandProps,
  cursorProps: ICursorProps,
  tabsProps: ITabProps
) => {
  const func = async (e: any) => {
    const eventKey = e.key;
    const currentCommand = commandsProps.currentCommandRef.current;
    switch (eventKey) {
      case "Backspace":
        e.preventDefault();
        if (cursorProps.carotPosRef.current === 0) return;
        commandsProps.setCurrentCommands((list) =>
          list.map((el, idx) => {
            if (idx === tabsProps.currTabNum)
              return (
                el.slice(0, cursorProps.carotPosRef.current - 1) +
                el.slice(cursorProps.carotPosRef.current)
              );
            return el;
          })
        );
        cursorProps.setCarotPos((el) => Math.max(0, el - 1));
        return;

      case "Tab":
        e.preventDefault();
        const commandsMatched = Object.keys(commandsProps.commands).filter(
          (list) => list.startsWith(currentCommand[tabsProps.currTabNum])
        );
        if (commandsMatched.length === 0) {
          return;
        }
        if (commandsMatched.length === 1) {
          useSetCurrentCommandByIdx(
            commandsProps.setCurrentCommands,
            tabsProps.currTabNum,
            commandsMatched[0]
          );
          cursorProps.setCarotPos(commandsMatched[0].length);
          return;
        }
        let i = 0;
        while (
          commandsMatched[0][i] &&
          commandsMatched.every((w) => w[i] === commandsMatched[0][i])
        )
          i++;
        const newCurrCommand = commandsMatched[0].slice(0, i);
        useSetCurrentCommandByIdx(
          commandsProps.setCurrentCommands,
          tabsProps.currTabNum,
          newCurrCommand
        );
        cursorProps.setCarotPos(newCurrCommand.length);
        useAddCommandToPreviousList(
          [
            currentCommand[tabsProps.currTabNum],
            commandsMatched.toString().replace(/,/g, ", "),
          ],
          commandsProps.setPreviousCommandsList,
          tabsProps.currTabNum
        );
        return;

      case "ArrowLeft":
        cursorProps.setCarotPos((el) => Math.max(0, el - 1));
        useMoveCarotWithoutBlink(e, cursorProps);
        return;

      case "ArrowRight":
        cursorProps.setCarotPos((el) =>
          Math.min(
            commandsProps.currentCommandRef.current[tabsProps.currTabNum]
              .length,
            el + 1
          )
        );
        useMoveCarotWithoutBlink(e, cursorProps);
        return;

      case "ArrowUp": {
        e.preventDefault();
        const idx =
          commandsProps.chosenPreviousCommandsIndexesRef.current[
            tabsProps.currTabNum
          ];

        const previousCommands =
          commandsProps.previousCommandsListRef.current[tabsProps.currTabNum];

        const newIdx = idx + 1 < previousCommands.length ? idx + 1 : idx;

        const newVal =
          previousCommands[previousCommands.length - 1 - newIdx][0];

        useSetCurrentCommandByIdx(
          commandsProps.setCurrentCommands,
          tabsProps.currTabNum,
          newVal
        );

        commandsProps.chosenPreviousCommandsIndexesRef.current[
          tabsProps.currTabNum
        ] = newIdx;
        cursorProps.setCarotPos(newVal.length);
        return;
      }

      case "ArrowDown": {
        e.preventDefault();
        const idx =
          commandsProps.chosenPreviousCommandsIndexesRef.current[
            tabsProps.currTabNum
          ];

        const newIdx = idx - 1 > -1 ? idx - 1 : -1;
        let newVal;
        if (newIdx !== -1) {
          const previousCommands =
            commandsProps.previousCommandsListRef.current[tabsProps.currTabNum];

          newVal = previousCommands[previousCommands.length - 1 - newIdx][0];
        } else {
          newVal = "";
        }

        useSetCurrentCommandByIdx(
          commandsProps.setCurrentCommands,
          tabsProps.currTabNum,
          newVal
        );

        commandsProps.chosenPreviousCommandsIndexesRef.current[
          tabsProps.currTabNum
        ] = newIdx;
        cursorProps.setCarotPos(newVal.length);
        return;
      }

      case "Enter":
        const controller = new AbortController();
        const signal = controller.signal;
        commandsProps.executingCommandsRef.current[tabsProps.currTabNum] =
          controller;
        useFindAndExecuteCommand(
          signal,
          commandsProps,
          tabsProps,
          cursorProps.setCarotPos
        );
        commandsProps.chosenPreviousCommandsIndexesRef.current[
          tabsProps.currTabNum
        ] = -1;
        return;

      case "v":
        if (e.ctrlKey) {
          return;
        }
        useNewKey(
          eventKey,
          cursorProps.setCarotPos,
          currentCommand[tabsProps.currTabNum],
          commandsProps.setCurrentCommands,
          tabsProps.currTabNum,
          cursorProps.carotPosRef
        );
        break;
      case "c":
        if (e.ctrlKey) {
          const controller =
            commandsProps.executingCommandsRef.current[tabsProps.currTabNum];
          if (controller) {
            controller.abort();
            useAddCommandToPreviousList(
              [currentCommand[tabsProps.currTabNum], "^C"],
              commandsProps.setPreviousCommandsList,
              tabsProps.currTabNum
            );
            useSetCurrentCommandByIdx(
              commandsProps.setCurrentCommands,
              tabsProps.currTabNum,
              ""
            );
            if (tabsProps.currTabNumRef.current === tabsProps.currTabNum)
              cursorProps.setCarotPos(0);
            commandsProps.executingCommandsRef.current[tabsProps.currTabNum] =
              null;
          }
          break;
        }
        useNewKey(
          eventKey,
          cursorProps.setCarotPos,
          currentCommand[tabsProps.currTabNum],
          commandsProps.setCurrentCommands,
          tabsProps.currTabNum,
          cursorProps.carotPosRef
        );
        break;

      default:
        useNewKey(
          eventKey,
          cursorProps.setCarotPos,
          currentCommand[tabsProps.currTabNum],
          commandsProps.setCurrentCommands,
          tabsProps.currTabNum,
          cursorProps.carotPosRef
        );
    }
  };
  return func;
};

const useNewKey = (
  eventKey: any,
  setCarotPos: React.Dispatch<React.SetStateAction<number>>,
  currentCommand: string,
  setCurrentCommands: React.Dispatch<React.SetStateAction<string[]>>,
  currTabNum: number,
  carotPosRef: React.RefObject<number>
) => {
  if (eventKey.length !== 1) return;
  setCarotPos((el) => el + 1);

  useSetCurrentCommandAtPosition(
    currentCommand,
    setCurrentCommands,
    currTabNum,
    eventKey,
    carotPosRef.current
  );
};
