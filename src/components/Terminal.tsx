import { useRef, useState } from "react";
import { Tabs } from "./Tabs";
import "../styles/Terminal.css";
import { CommandList } from "./ComandsList";
import { Commands } from "../interfaces/CommandsInterace";

export const Terminal = ({
  commands,
  executeOnNewTabClient = null,
  executeOnRemoveTabClient = null,
  terminalStyle = null,
}: {
  commands: Commands;
  executeOnNewTabClient?: (() => void) | null;
  executeOnRemoveTabClient?: ((idx: number) => void) | null;
  terminalStyle?: React.CSSProperties | null;
}) => {
  const [tabs, setTabs] = useState(["Tab 1", "Tab 2", "Tab 3"]);
  const [currTabNum, setCurrTabNum] = useState(0);
  const [previousCommandsList, setPreviousCommandsList] = useState<
    [string, string][][]
  >([[], [], []]);
  const [currentCommands, setCurrentCommands] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [isInput, setIsInput] = useState(false);

  const chosenPreviousCommandsIndexesRef = useRef([-1, -1, -1]);
  const executingCommandsRef = useRef<(AbortController | null)[]>([
    null,
    null,
    null,
  ]);

  const executeOnNewTab = () => {
    if (executeOnNewTabClient) {
      executeOnNewTabClient();
    }
    setPreviousCommandsList((list) => [...list, []]);
    setCurrentCommands((list) => [...list, ""]);
    executingCommandsRef.current = [...executingCommandsRef.current, null];
    chosenPreviousCommandsIndexesRef.current = [
      ...chosenPreviousCommandsIndexesRef.current,
      -1,
    ];
  };

  const executeOnRemoveTab = (idx: number) => {
    if (executeOnRemoveTabClient) {
      executeOnRemoveTabClient(idx);
    }
    setPreviousCommandsList((el) =>
      el.filter((_, i) => {
        return i !== idx;
      })
    );
    setCurrentCommands((el) =>
      el.filter((_, i) => {
        return i !== idx;
      })
    );
    const copy = executingCommandsRef.current;
    if (copy[idx] instanceof AbortController) {
      copy[idx].abort();
    }
    copy.splice(idx, 1);
    executingCommandsRef.current = copy;
    const copy2 = chosenPreviousCommandsIndexesRef.current;
    copy2.splice(idx, 1);
    chosenPreviousCommandsIndexesRef.current = copy2;
  };

  const terminalStyleDefault = {
    "--background-default": "#091c23",
    "--active-color": "#00f6ff",
    "--active-color-hover": "#00cad1",
    "--header-background-color": "#0e232b",
    "--header-background-color-hover": "#102831",
    "--text-color": "rgba(255, 255, 255, 0.87)",
  } as React.CSSProperties;

  return (
    <div
      className="terminal"
      style={terminalStyle ? terminalStyle : terminalStyleDefault}
    >
      <Tabs
        tabs={tabs}
        setTabs={setTabs}
        currTabNum={currTabNum}
        setCurrTabNum={setCurrTabNum}
        executeOnNewTab={executeOnNewTab}
        executeOnRemoveTab={executeOnRemoveTab}
        setIsInput={setIsInput}
      />
      <CommandList
        commands={commands}
        previousCommandsList={previousCommandsList}
        setPreviousCommandsList={setPreviousCommandsList}
        currTabNum={currTabNum}
        currentCommands={currentCommands}
        setCurrentCommands={setCurrentCommands}
        executingCommandsRef={executingCommandsRef}
        chosenPreviousCommandsIndexesRef={chosenPreviousCommandsIndexesRef}
        isInput={isInput}
        setIsInput={setIsInput}
      />
    </div>
  );
};
