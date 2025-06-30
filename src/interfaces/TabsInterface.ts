export interface IuseHandleMouseDownProps {
  timeoutRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
  setIsMoving: React.Dispatch<React.SetStateAction<boolean>>;
  mousePos: React.RefObject<number[]>;
  currentBoxRef: React.RefObject<number>;
  setCurrectBox: React.Dispatch<React.SetStateAction<number>>;
  setTerminalPos: React.Dispatch<React.SetStateAction<number[]>>;
  setTerminalSize: React.Dispatch<React.SetStateAction<number[]>>;
  terminalRef: React.RefObject<HTMLDivElement | null>;
  boxReach: number;
  windowWidth: number;
  windowHeight: number;
  oldSizeRef: React.RefObject<string[]>;
}
