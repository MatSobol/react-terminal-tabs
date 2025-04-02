import { memo, useEffect, useRef, useState } from "react";
import "../styles/CommandList.css";
import {
  ICommandProps,
  ICursorProps,
  ITabProps,
} from "../interfaces/CommandListInterfaces";
import { useManageInput } from "../hooks/CommandList";
import { moveCarotWithoutBlink } from "../hooks/CommandList/Utility";

type CommandFunction<T extends any[] = any[]> = (
  ...args: T
) => Promise<any> | any;

interface Commands {
  [key: string]: CommandFunction;
}

interface CommandListProps {
  commands: Commands;
  currTabNum: number;
  previousCommandsList: [string, string][][];
  setPreviousCommandsList: React.Dispatch<
    React.SetStateAction<[string, string][][]>
  >;
  currentCommands: string[];
  setCurrentCommands: React.Dispatch<React.SetStateAction<string[]>>;
  executingCommandsRef: React.RefObject<(AbortController | null)[]>;
  chosenPreviousCommandsIndexesRef: React.RefObject<number[]>;
  isInput: boolean;
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CommandList = memo(
  ({
    commands,
    currTabNum,
    previousCommandsList,
    setPreviousCommandsList,
    currentCommands,
    setCurrentCommands,
    executingCommandsRef,
    chosenPreviousCommandsIndexesRef,
    isInput,
    setIsInput,
  }: CommandListProps) => {
    const [carotPos, setCarotPos] = useState(0);
    const [showBlink, setShowBlink] = useState(true);
    const commandsProps: ICommandProps = {
      commands,
      currentCommandRef: useRef(currentCommands),
      setCurrentCommands,
      previousCommandsListRef: useRef(previousCommandsList),
      setPreviousCommandsList: setPreviousCommandsList,
      commandsContainerRef: useRef<HTMLDivElement | null>(null),
      executingCommandsRef,
      chosenPreviousCommandsIndexesRef,
      isInput,
      setIsInput,
    };

    const cursorProps: ICursorProps = {
      carotPos,
      setCarotPos,
      carotRef: useRef<HTMLDivElement | null>(null),
      carotPosRef: useRef(carotPos),
      showBlinkTimeoutId: useRef<number>(-1),
      showBlink,
      setShowBlink,
    };

    const tabsProps: ITabProps = {
      currTabNum,
      currTabNumRef: useRef(currTabNum),
    };

    //clear and cls are defined later since they have different logic
    commands["clear"] = () => {};
    commands["cls"] = () => {};
    if (!commands["help"]) {
      commands["help"] = () => {
        return Object.keys(commands).toString().replace(/,/g, "\n");
      };
    }

    useEffect(() => {
      cursorProps.carotPosRef.current = carotPos;
    }, [carotPos]);

    useEffect(() => {
      commandsProps.currentCommandRef.current = currentCommands;
    }, [currentCommands]);

    useEffect(() => {
      commandsProps.previousCommandsListRef.current = previousCommandsList;
    }, [previousCommandsList]);

    useEffect(() => {
      if (commandsProps.commandsContainerRef.current) {
        commandsProps.commandsContainerRef.current.scrollTop =
          commandsProps.commandsContainerRef.current.scrollHeight;
      }
    }, [carotPos, currentCommands, currTabNum]);

    useEffect(() => {
      setCarotPos(currentCommands[currTabNum].length);
      tabsProps.currTabNumRef.current = currTabNum;
    }, [currTabNum]);

    useManageInput(commandsProps, cursorProps, tabsProps);

    const handleChangeCarrotOnCLick = (e: any, idx: number) => {
      setIsInput(true);
      setCarotPos(idx);
      moveCarotWithoutBlink(e, cursorProps);
      e.stopPropagation();
    };

    return (
      <div className="padded">
        <div
          className="comandsContainer"
          ref={commandsProps.commandsContainerRef}
        >
          <PreviousComments
            previousCommandsList={previousCommandsList}
            currTabNum={currTabNum}
          />
          <div
            className="commandLine"
            onClick={(e) =>
              handleChangeCarrotOnCLick(e, currentCommands[currTabNum].length)
            }
          >
            <div className="dollar">$</div>
            <span className="commandText">
              {[...currentCommands[currTabNum].substring(0, carotPos)].map(
                (el, idx) => (
                  <span
                    onClick={(e) => {
                      handleChangeCarrotOnCLick(e, idx);
                    }}
                    key={idx}
                  >
                    {el}
                  </span>
                )
              )}
              {isInput ? (
                <span
                  className={`caret ${isInput ? "active" : ""} ${
                    showBlink ? "animate" : ""
                  }`}
                  ref={cursorProps.carotRef}
                  data-content={currentCommands[currTabNum].charAt(carotPos)}
                >
                  {currentCommands[currTabNum].charAt(carotPos)}
                </span>
              ) : (
                <span>{currentCommands[currTabNum].charAt(carotPos)}</span>
              )}
              {[
                ...currentCommands[currTabNum].substring(
                  carotPos + 1,
                  currentCommands[currTabNum].length
                ),
              ].map((el, idx) => (
                <span
                  onClick={(e) => {
                    handleChangeCarrotOnCLick(e, idx + carotPos + 1);
                  }}
                  key={idx}
                >
                  {el}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

const PreviousComments = memo(
  ({
    previousCommandsList,
    currTabNum,
  }: {
    previousCommandsList: [string, string][][];
    currTabNum: number;
  }) => {
    return (
      <>
        {previousCommandsList[currTabNum]?.map((el, idx) => (
          <div key={idx}>
            <div className="commandLine">
              <div className="dollar">$</div>
              <div className="commandText">{el[0]}</div>
            </div>
            <div className="result">{el[1]}</div>
          </div>
        ))}
      </>
    );
  }
);
