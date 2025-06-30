import { IuseHandleMouseDownProps } from "../interfaces/TabsInterface";

export const useAddTab = (
  tabs: string[],
  setTabs: React.Dispatch<React.SetStateAction<string[]>>,
  executeOnNewTab: () => void
) => {
  const newTab = `Tab ${tabs.length + 1}`;
  setTabs((list) => [...list, newTab]);
  executeOnNewTab();
};

export const useRemoveTab = (
  idx: number,
  tabs: string[],
  setTabs: React.Dispatch<React.SetStateAction<string[]>>,
  currTabNum: number,
  setCurrTabNum: React.Dispatch<React.SetStateAction<number>>,
  executeOnRemoveTab: (idx: number) => void
) => {
  if (tabs.length == 1) return;
  if (currTabNum === tabs.length - 1) {
    setCurrTabNum(tabs.length - 2);
  }
  if (idx < currTabNum) {
    setCurrTabNum(currTabNum - 1);
  }
  setTabs((el) =>
    el.filter((_, i) => {
      return i !== idx;
    })
  );
  executeOnRemoveTab(idx);
};

export const useChangeTab = (
  idx: number,
  setCurrTabNum: React.Dispatch<React.SetStateAction<number>>
) => {
  setCurrTabNum(idx);
};

const choseBox = (
  x: number,
  y: number,
  boxReach: number,
  windowWidth: number,
  windowHeight: number
) => {
  if (x < boxReach * windowWidth) {
    switch (true) {
      case y < boxReach * windowHeight:
        return 1;
      case y > (1 - boxReach) * windowHeight:
        return 3;
      default:
        return 2;
    }
  } else if (x > (1 - boxReach) * windowWidth) {
    switch (true) {
      case y < boxReach * windowHeight:
        return 4;
      case y > (1 - boxReach) * windowHeight:
        return 6;
      default:
        return 5;
    }
  } else if (y < boxReach * windowHeight) {
    return 7;
  } else if (y > (1 - boxReach) * windowHeight) {
    return 8;
  } else {
    return 0;
  }
};

const getBoxArea = (
  currentBoxRef: React.RefObject<number>,
  windowWidth: number,
  windowHeight: number
): [[number, number], [number, number]] | null => {
  switch (currentBoxRef.current) {
    case 1:
      return [
        [0, 0],
        [windowWidth / 2, windowHeight / 2],
      ];
    case 2:
      return [
        [0, 0],
        [windowWidth / 2, windowHeight],
      ];
    case 3:
      return [
        [0, windowHeight / 2],
        [windowWidth / 2, windowHeight / 2],
      ];
    case 4:
      return [
        [windowWidth / 2, 0],
        [windowWidth / 2, windowHeight / 2],
      ];
    case 5:
      return [
        [windowWidth / 2, 0],
        [windowWidth / 2, windowHeight],
      ];
    case 6:
      return [
        [windowWidth / 2, windowHeight / 2],
        [windowWidth / 2, windowHeight / 2],
      ];
    case 7:
      return [
        [0, 0],
        [windowWidth, windowHeight / 2],
      ];
    case 8:
      return [
        [0, windowHeight / 2],
        [windowWidth, windowHeight / 2],
      ];
    default:
      console.error("Invalid box reference");
      return null;
  }
};

const useHandleMouseMove = (
  e: MouseEvent,
  mousePos: React.RefObject<number[]>,
  currentBoxRef: React.RefObject<number>,
  setCurrectBox: React.Dispatch<React.SetStateAction<number>>,
  setTerminalPos: React.Dispatch<React.SetStateAction<number[]>>,
  boxReach: number,
  windowWidth: number,
  windowHeight: number
) => {
  if (mousePos.current[0] !== -1) {
    const diffX = mousePos.current[0] - e.clientX;
    const diffY = mousePos.current[1] - e.clientY;
    setTerminalPos((el) => [el[0] - diffX, el[1] - diffY]);
  }
  const currBox = choseBox(
    e.clientX,
    e.clientY,
    boxReach,
    windowWidth,
    windowHeight
  );
  currentBoxRef.current = currBox;
  mousePos.current = [e.clientX, e.clientY];
  setCurrectBox(currBox);
};

const useHandleMouseUp = (
  mousePos: React.RefObject<number[]>,
  timeoutRef: React.RefObject<ReturnType<typeof setTimeout> | null>,
  setIsMoving: React.Dispatch<React.SetStateAction<boolean>>,
  currentBoxRef: React.RefObject<number>,
  setTerminalPos: React.Dispatch<React.SetStateAction<number[]>>,
  setTerminalSize: React.Dispatch<React.SetStateAction<number[]>>,
  terminalRef: React.RefObject<HTMLDivElement | null>,
  windowWidth: number,
  windowHeight: number,
  oldSizeRef: React.RefObject<string[]>,
  mouseMoveHandler: (e: MouseEvent) => void
) => {
  document.body.style.cursor = "auto";
  document.removeEventListener("mousemove", mouseMoveHandler);
  mousePos.current = [-1, -1];
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  setIsMoving(false);
  if (terminalRef.current === null) {
    return;
  }
  if (currentBoxRef.current === 0) {
    terminalRef.current.style.width = oldSizeRef.current[0];
    terminalRef.current.style.height = oldSizeRef.current[1];
    return;
  }
  const result = getBoxArea(currentBoxRef, windowWidth, windowHeight);
  if (result) {
    const [pos, size] = result;
    oldSizeRef.current = [
      terminalRef.current.style.width,
      terminalRef.current.style.height,
    ];
    terminalRef.current.style.width = `${size[0]}px`;
    terminalRef.current.style.height = `${size[1]}px`;
    setTerminalPos(pos);
    setTerminalSize(size);
  }
};

export const useHandleMouseDown = (
  e: React.MouseEvent,
  useHandleMouseDownProps: IuseHandleMouseDownProps
) => {
  if (e.button === 0) {
    const mouseMoveHandler = (e: MouseEvent) =>
      useHandleMouseMove(
        e,
        useHandleMouseDownProps.mousePos,
        useHandleMouseDownProps.currentBoxRef,
        useHandleMouseDownProps.setCurrectBox,
        useHandleMouseDownProps.setTerminalPos,
        useHandleMouseDownProps.boxReach,
        useHandleMouseDownProps.windowWidth,
        useHandleMouseDownProps.windowHeight
      );
    useHandleMouseDownProps.timeoutRef.current = setTimeout(() => {
      useHandleMouseDownProps.setIsMoving(true);
      document.body.style.cursor = "move";
      document.addEventListener("mousemove", mouseMoveHandler);
    }, 100);
    document.addEventListener(
      "mouseup",
      () =>
        useHandleMouseUp(
          useHandleMouseDownProps.mousePos,
          useHandleMouseDownProps.timeoutRef,
          useHandleMouseDownProps.setIsMoving,
          useHandleMouseDownProps.currentBoxRef,
          useHandleMouseDownProps.setTerminalPos,
          useHandleMouseDownProps.setTerminalSize,
          useHandleMouseDownProps.terminalRef,
          useHandleMouseDownProps.windowWidth,
          useHandleMouseDownProps.windowHeight,
          useHandleMouseDownProps.oldSizeRef,
          mouseMoveHandler
        ),
      { once: true }
    );
  }
};

export const handleClick = (e: React.MouseEvent, isMoving: boolean) => {
  if (isMoving) {
    e.stopPropagation();
  }
};
