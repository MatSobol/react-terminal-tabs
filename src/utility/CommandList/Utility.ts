import { ICursorProps } from "../../interfaces/CommandListInterfaces";

export const useSetCurrentCommandAtPosition = (
  currentCommand: string,
  setCurrentCommands: React.Dispatch<React.SetStateAction<string[]>>,
  idx: number,
  val: string,
  pos: number
) => {
  const text = currentCommand.slice(0, pos) + val + currentCommand.slice(pos);
  useSetCurrentCommandByIdx(setCurrentCommands, idx, text);
};

export const useSetCurrentCommandByIdx = (
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

export const useAddCommandToPreviousList = (
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

export const useMoveCarotWithoutBlink = (
  e: KeyboardEvent | React.MouseEvent<HTMLSpanElement>,
  cursorProps: ICursorProps
) => {
  e.preventDefault();
  cursorProps.setShowBlink(false);
  if (cursorProps.showBlinkTimeoutId.current !== null) {
    clearTimeout(cursorProps.showBlinkTimeoutId.current);
  }
  cursorProps.showBlinkTimeoutId.current = setTimeout(() => {
    cursorProps.setShowBlink(true);
    cursorProps.showBlinkTimeoutId.current = null;
  }, 500);
};
