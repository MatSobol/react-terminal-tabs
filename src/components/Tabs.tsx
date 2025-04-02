import "../styles/Tabs.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { addTab, changeTab, removeTab } from "../hooks/Tabs";
import { useState } from "react";

interface TabsProps {
  tabs: string[];
  setTabs: React.Dispatch<React.SetStateAction<string[]>>;
  currTabNum: number;
  setCurrTabNum: React.Dispatch<React.SetStateAction<number>>;
  executeOnNewTab: () => void;
  executeOnRemoveTab: (idx: number) => void;
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Tabs = ({
  tabs,
  setTabs,
  currTabNum,
  setCurrTabNum,
  executeOnNewTab,
  executeOnRemoveTab,
  setIsInput,
}: TabsProps) => {
  const [idxOfTabNameChange, setIdxOfTabNameChange] = useState(-1);

  return (
    <div className="tabsContainer">
      {tabs.map((it, idx) => {
        return (
          <div
            className={`tab ${idx === currTabNum ? "active" : ""}`}
            key={`it${idx}`}
            onDoubleClick={() => setIdxOfTabNameChange(idx)}
            title={it}
          >
            {idx !== idxOfTabNameChange ? (
              <>
                <div
                  className="content"
                  onClick={(e) => {
                    changeTab(e, idx, setCurrTabNum);
                    setIsInput(true);
                  }}
                >
                  {it}
                </div>
                <div
                  className="close"
                  onClick={() =>
                    removeTab(
                      idx,
                      tabs,
                      setTabs,
                      currTabNum,
                      setCurrTabNum,
                      executeOnRemoveTab
                    )
                  }
                >
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </>
            ) : (
              <input
                defaultValue={it}
                onClick={(e) => e.preventDefault()}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    const input = e.target as HTMLInputElement;
                    const copy = [...tabs];
                    copy[idx] = input.value;
                    setTabs(copy);
                    setIdxOfTabNameChange(-1);
                    e.stopPropagation();
                    setIsInput(true);
                  }
                }}
                onFocus={() => setIsInput(false)}
                onBlur={() => {
                  setIdxOfTabNameChange(-1);
                }}
                autoFocus
              />
            )}
          </div>
        );
      })}
      <div
        className="tab"
        style={{ width: "auto" }}
        onClick={(e) => {
          addTab(tabs, setTabs, executeOnNewTab);
          changeTab(e, tabs.length, setCurrTabNum);
          setIsInput(true);
        }}
      >
        <div className="add">
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
    </div>
  );
};
