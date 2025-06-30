import { useSetCurrentCommandAtPosition } from "./Utility";

export const useHandlePaste = (
  setCurrentCommands: React.Dispatch<React.SetStateAction<string[]>>,
  carotPosRef: React.RefObject<number>,
  setCarotPos: React.Dispatch<React.SetStateAction<number>>,
  currTabNum: number,
  currentCommandRef: React.RefObject<string[]>
) => {
  return (e: ClipboardEvent) => {
    if (!e.clipboardData) {
      return;
    }
    const text = e.clipboardData.getData("text");
    useSetCurrentCommandAtPosition(
      currentCommandRef.current[currTabNum],
      setCurrentCommands,
      currTabNum,
      text,
      carotPosRef.current
    );
    setCarotPos((el) => el + text.length);
  };
};
