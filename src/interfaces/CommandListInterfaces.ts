import {Commands} from "./CommandsInterace"

export interface ICommandProps {
    commands: Commands;
    currentCommandRef: React.RefObject<string[]>;
    setCurrentCommands: React.Dispatch<React.SetStateAction<string[]>>;
    setPreviousCommandsList: React.Dispatch<
      React.SetStateAction<[string, string][][]>
    >;
    previousCommandsListRef: React.RefObject<[string, string][][]>;
    chosenPreviousCommandsIndexesRef: React.RefObject<number[]>;
    commandsContainerRef: React.RefObject<HTMLDivElement | null>;
    executingCommandsRef: React.RefObject<(AbortController | null)[]>;
    isInput: boolean;
    setIsInput: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  export interface ICursorProps {
    carotPos: number;
    setCarotPos: React.Dispatch<React.SetStateAction<number>>;
    carotRef: React.RefObject<HTMLDivElement | null>;
    carotPosRef: React.RefObject<number>;
    showBlinkTimeoutId: React.RefObject<ReturnType<typeof setTimeout> | null>;
    showBlink: boolean;
    setShowBlink: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  export interface ITabProps {
    currTabNum: number;
    currTabNumRef: React.RefObject<number>;
  }