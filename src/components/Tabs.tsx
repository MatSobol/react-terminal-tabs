import "../styles/Tabs.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import {
  useAddTab,
  useChangeTab,
  useRemoveTab,
  useHandleMouseDown,
  handleClick,
} from "../utility/Tabs";
import { useEffect, useRef, useState } from "react";

const boxes = [
  <></>,
  <div className="corner topLeftBox box"></div>,
  <div className="leftBox box"></div>,
  <div className="corner bottomLeftBox box"></div>,
  <div className="corner topRightBox box"></div>,
  <div className="rightBox box"></div>,
  <div className="corner bottomRightBox box"></div>,
  <div className="topBox box"></div>,
  <div className="bottomBox box"></div>,
];

interface TabsProps {
  tabs: string[];
  setTabs: React.Dispatch<React.SetStateAction<string[]>>;
  currTabNum: number;
  setCurrTabNum: React.Dispatch<React.SetStateAction<number>>;
  executeOnNewTab: () => void;
  executeOnRemoveTab: (idx: number) => void;
  saveToLocalStorage: () => void;
  saveAsFile: () => void;
  load: (e: React.ChangeEvent<HTMLInputElement>) => void;
  restart: () => void;
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  isMovable: boolean;
  setTerminalPos: React.Dispatch<React.SetStateAction<number[]>>;
  setTerminalSize: React.Dispatch<React.SetStateAction<number[]>>;
  terminalRef: React.RefObject<HTMLDivElement | null>;
  changeOrder: () => void;
}

export const Tabs = ({
  tabs,
  setTabs,
  currTabNum,
  setCurrTabNum,
  executeOnNewTab,
  executeOnRemoveTab,
  saveToLocalStorage,
  saveAsFile,
  load,
  restart,
  setIsInput,
  isMovable,
  setTerminalPos,
  setTerminalSize,
  terminalRef,
  changeOrder,
}: TabsProps) => {
  const [idxOfTabNameChange, setIdxOfTabNameChange] = useState(-1);
  const [isMenuDropped, setIsMenuDropped] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMoving, setIsMoving] = useState(false);
  const mousePos = useRef([-1, -1]);
  const currentBoxRef = useRef(0);
  const [currentBox, setCurrectBox] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const boxReach = 0.05;
  const oldSizeRef = useRef<string[]>(["1", "1"]);

  function wrapClick(originalClick?: (e: React.MouseEvent) => void) {
    return (e: React.MouseEvent) => {
      if (!isMoving) {
        originalClick?.(e);
      }
    };
  }

  const useHandleMouseDownProps = {
    timeoutRef,
    setIsMoving,
    mousePos,
    currentBoxRef,
    setCurrectBox,
    setTerminalPos,
    setTerminalSize,
    terminalRef,
    boxReach,
    windowWidth,
    windowHeight,
    oldSizeRef,
  };

  useEffect(() => {
    if (isMoving) {
      changeOrder();
    }
  }, [isMoving]);

  return (
    <>
      {isMovable && isMoving && boxes[currentBox]}
      <div
        className="topMenuContainer"
        onMouseDown={
          isMovable
            ? (e) => useHandleMouseDown(e, useHandleMouseDownProps)
            : () => {}
        }
        onClick={isMovable ? (e) => handleClick(e, isMoving) : () => {}}
      >
        <div className="tabsContainer">
          {tabs.map((it, idx) => {
            return (
              <div
                className={`tab ${idx === currTabNum ? "active" : ""}`}
                style={{ cursor: isMoving ? "move" : "pointer" }}
                key={`it${idx}`}
                onDoubleClick={() => setIdxOfTabNameChange(idx)}
                title={it}
              >
                {idx !== idxOfTabNameChange ? (
                  <>
                    <div
                      className="content"
                      onClick={wrapClick((e) => {
                        e.stopPropagation();
                        useChangeTab(idx, setCurrTabNum);
                        setIsInput(true);
                      })}
                    >
                      {it}
                    </div>
                    <div
                      className="close"
                      onClick={wrapClick(() =>
                        useRemoveTab(
                          idx,
                          tabs,
                          setTabs,
                          currTabNum,
                          setCurrTabNum,
                          executeOnRemoveTab
                        )
                      )}
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
            style={{ width: "auto", cursor: isMoving ? "move" : "pointer" }}
            onClick={wrapClick(() => {
              useAddTab(tabs, setTabs, executeOnNewTab);
              useChangeTab(tabs.length, setCurrTabNum);
              setIsInput(true);
            })}
          >
            <div className="add">
              <FontAwesomeIcon icon={faPlus} />
            </div>
          </div>
        </div>
        <div className="fill"></div>
        <div
          className="menu"
          onClick={wrapClick(() => {
            setIsMenuDropped((el) => !el);
          })}
        >
          <div
            className="tab"
            style={{ width: "auto", cursor: isMoving ? "move" : "pointer" }}
          >
            <FontAwesomeIcon icon={faAngleDown} />
            {isMenuDropped && (
              <ul>
                <li onClick={saveToLocalStorage}>save</li>
                <li onClick={saveAsFile}>save as file</li>
                <li onClick={() => inputRef.current?.click()}>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      load(e);
                      setIsMenuDropped(false);
                    }}
                  />
                  load
                </li>
                <li onClick={restart}>restart</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
