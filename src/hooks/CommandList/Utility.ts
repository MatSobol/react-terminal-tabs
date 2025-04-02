import { ICursorProps } from "../../interfaces/CommandListInterfaces";

export const setCurrentCommandAtPosition = (
  currentCommand: string,
  setCurrentCommands: React.Dispatch<React.SetStateAction<string[]>>,
  idx: number,
  val: string,
  pos: number
) => {
  const text = currentCommand.slice(0, pos) + val + currentCommand.slice(pos);
  setCurrentCommandByIdx(setCurrentCommands, idx, text);
};

export const setCurrentCommandByIdx = (
  setCurrentCommands: React.Dispatch<React.SetStateAction<string[]>>,
  idx: number,
  val: string
) => {
  setCurrentCommands((list) =>
    list.map((el, i) => {
      if (i === idx) return val;
      return el;
    })
  );
};

export const addCommandToPreviousList = (
  value: [string, string],
  setPreviousCommandsList: React.Dispatch<
    React.SetStateAction<[string, string][][]>
  >,
  currTabNum: number
) => {
  setPreviousCommandsList((list) =>
    list.map((row, rowIndex) =>
      rowIndex === currTabNum ? [...row, value] : row
    )
  );
};

export const moveCarotWithoutBlink = (
  e: KeyboardEvent | React.MouseEvent<HTMLSpanElement>,
  cursorProps: ICursorProps
) => {
  e.preventDefault();
  cursorProps.setShowBlink(false);
  if (cursorProps.showBlinkTimeoutId.current !== -1) {
    clearTimeout(cursorProps.showBlinkTimeoutId.current);
  }
  cursorProps.showBlinkTimeoutId.current = setTimeout(() => {
    cursorProps.setShowBlink(true);
    cursorProps.showBlinkTimeoutId.current = -1;
  }, 500);
};
