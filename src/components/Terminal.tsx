import { useRef, useState } from "react";
import { Tabs } from "./Tabs";
import "../styles/Terminal.css";
import { CommandList } from "./ComandsList";
import { Commands } from "../interfaces/CommandsInterace";

const DEFAULT_TABS = ["Tab 1", "Tab 2", "Tab 3"];
const DEFAULT_PREVIOUS_COMMANDS_LIST = [[], [], []];
const DEFAULT_CURRENT_COMMANDS = ["", "", ""];

export const Terminal = ({
  commands,
  executeOnNewTab = null,
  executeOnRemoveTab = null,
  terminalStyle = null,
  localStorageName = "react_termianl_tabs",
  isMovable = false,
  zIndex = 20,
  id = 0,
  setOrder = null,
}: {
  commands: Commands;
  executeOnNewTab?: (() => void) | null;
  executeOnRemoveTab?: ((idx: number) => void) | null;
  terminalStyle?: React.CSSProperties | null;
  localStorageName?: string;
  isMovable?: boolean;
  id?: number;
  zIndex?: number;
  setOrder?: React.Dispatch<React.SetStateAction<number[]>> | null;
}) => {
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem(localStorageName + "_tabs");
    return saved ? JSON.parse(saved) : DEFAULT_TABS;
  });

  const [currTabNum, setCurrTabNum] = useState(0);
  const [previousCommandsList, setPreviousCommandsList] = useState<
    [string, string][][]
  >(() => {
    const saved = localStorage.getItem(localStorageName + "_previous");
    return saved ? JSON.parse(saved) : DEFAULT_PREVIOUS_COMMANDS_LIST;
  });
  const [currentCommands, setCurrentCommands] = useState<string[]>(() => {
    const saved = localStorage.getItem(localStorageName + "_current");
    return saved ? JSON.parse(saved) : DEFAULT_CURRENT_COMMANDS;
  });
  const [isInput, setIsInput] = useState(false);

  const chosenPreviousCommandsIndexesRef = useRef([-1, -1, -1]);
  const executingCommandsRef = useRef<(AbortController | null)[]>([
    null,
    null,
    null,
  ]);

  const executeOnNewTabTerminal = () => {
    if (executeOnNewTab) {
      executeOnNewTab();
    }
    setPreviousCommandsList((list) => [...list, []]);
    setCurrentCommands((list) => [...list, ""]);
    executingCommandsRef.current = [...executingCommandsRef.current, null];
    chosenPreviousCommandsIndexesRef.current = [
      ...chosenPreviousCommandsIndexesRef.current,
      -1,
    ];
  };

  const executeOnRemoveTabTerminal = (idx: number) => {
    if (executeOnRemoveTab) {
      executeOnRemoveTab(idx);
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

  const saveToLocalStorage = () => {
    localStorage.setItem(localStorageName + "_tabs", JSON.stringify(tabs));
    localStorage.setItem(
      localStorageName + "_previous",
      JSON.stringify(previousCommandsList)
    );
    localStorage.setItem(
      localStorageName + "_current",
      JSON.stringify(currentCommands)
    );
  };

  const restart = () => {
    setTabs(DEFAULT_TABS);
    setPreviousCommandsList(DEFAULT_PREVIOUS_COMMANDS_LIST);
    setCurrentCommands(DEFAULT_CURRENT_COMMANDS);
    localStorage.removeItem(localStorageName + "_tabs");
    localStorage.removeItem(localStorageName + "_previous");
    localStorage.removeItem(localStorageName + "_current");
  };

  const saveAsFile = () => {
    const data = {
      tabs: tabs,
      previousCommandsList: previousCommandsList,
      currentCommands: currentCommands,
    };

    const jsonStr = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "react_terminal_tabs.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const load = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === "string") {
          try {
            const json = JSON.parse(result);
            setTabs(json.tabs);
            setPreviousCommandsList(json.previousCommandsList);
            setCurrentCommands(json.currentCommands);
          } catch (err) {
            alert("Invalid JSON file");
          }
        } else {
          alert("File could not be read as text.");
        }
      } catch (err) {
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  };

  const terminalStyleDefault = {
    "--background-default": "#091c23",
    "--active-color": "#00f6ff",
    "--active-color-hover": "#00cad1",
    "--header-background-color": "#0e232b",
    "--header-background-color-hover": "#102831",
    "--text-color": "rgba(255, 255, 255, 0.87)",
  } as React.CSSProperties;

  const [terminalPos, setTerminalPos] = useState([
    window.innerWidth / 2 - 400,
    window.innerHeight / 2 - 300,
  ]);

  const [terminalSize, setTerminalSize] = useState([800, 600]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const changeOrder = () => {
    if (setOrder === null) {
      return;
    }
    setOrder((order) => {
      const newOrder = [...order];
      const [item] = newOrder.splice(id, 1);
      newOrder.push(item);
      return newOrder;
    });
  };

  return (
    <div
      onClick={() => changeOrder()}
      className="terminal"
      ref={terminalRef}
      style={{
        ...(terminalStyle ? terminalStyle : terminalStyleDefault),
        position: isMovable ? "fixed" : "static",
        left: terminalPos[0],
        top: terminalPos[1],
        width: isMovable ? terminalSize[0] : "100%",
        height: isMovable ? terminalSize[1] : "100%",
        resize: isMovable ? "both" : "none",
        zIndex: zIndex + id,
      }}
    >
      <Tabs
        tabs={tabs}
        setTabs={setTabs}
        currTabNum={currTabNum}
        setCurrTabNum={setCurrTabNum}
        executeOnNewTab={executeOnNewTabTerminal}
        executeOnRemoveTab={executeOnRemoveTabTerminal}
        saveToLocalStorage={saveToLocalStorage}
        saveAsFile={saveAsFile}
        load={load}
        restart={restart}
        setIsInput={setIsInput}
        isMovable={isMovable}
        setTerminalPos={setTerminalPos}
        setTerminalSize={setTerminalSize}
        terminalRef={terminalRef}
        changeOrder={changeOrder}
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
