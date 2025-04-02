import { useEffect } from "react";
import {
  ICommandProps,
  ICursorProps,
  ITabProps,
} from "../../interfaces/CommandListInterfaces";
import { handlePaste } from "./HandlePaste";
import { handleEnableInput } from "./HandleEnableInput";
import { handleInput } from "./HandleInput";

export const useManageInput = (
  commandsProps: ICommandProps,
  cursorProps: ICursorProps,
  tabsProps: ITabProps
) => {
  const input = handleInput(commandsProps, cursorProps, tabsProps);
  const paste = handlePaste(
    commandsProps.setCurrentCommands,
    cursorProps.carotPosRef,
    cursorProps.setCarotPos,
    tabsProps.currTabNum,
    commandsProps.currentCommandRef
  );
  const enableInput = handleEnableInput(
    commandsProps.commandsContainerRef,
    commandsProps.setIsInput
  );
  useEffect(() => {
    addEventListener("click", enableInput);
    return () => {
      removeEventListener("keydown", input);
      removeEventListener("paste", paste);
    };
  }, []);
  useEffect(() => {
    if (commandsProps.isInput) {
      addEventListener("keydown", input);
      addEventListener("paste", paste);
    } else {
      removeEventListener("keydown", input);
      removeEventListener("paste", paste);
    }
    return () => {
      removeEventListener("keydown", input);
      removeEventListener("paste", paste);
    };
  }, [commandsProps.isInput, tabsProps.currTabNum]);
};
