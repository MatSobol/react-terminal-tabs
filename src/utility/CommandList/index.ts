import { useEffect } from "react";
import {
  ICommandProps,
  ICursorProps,
  ITabProps,
} from "../../interfaces/CommandListInterfaces";
import { useHandlePaste } from "./HandlePaste";
import { useHandleEnableInput } from "./HandleEnableInput";
import { useHandleInput } from "./HandleInput";

export const useManageInput = (
  commandsProps: ICommandProps,
  cursorProps: ICursorProps,
  tabsProps: ITabProps
) => {
  const input = useHandleInput(commandsProps, cursorProps, tabsProps);
  const paste = useHandlePaste(
    commandsProps.setCurrentCommands,
    cursorProps.carotPosRef,
    cursorProps.setCarotPos,
    tabsProps.currTabNum,
    commandsProps.currentCommandRef
  );
  const enableInput = useHandleEnableInput(
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
