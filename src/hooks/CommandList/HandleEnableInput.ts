export const handleEnableInput = (
  commandsContainerRef: React.RefObject<HTMLDivElement | null>,
  setIsInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const func = (e: MouseEvent) => {
    if (
      !commandsContainerRef.current ||
      !(e.target instanceof Node) ||
      commandsContainerRef.current.contains(e.target)
    ) {
      setIsInput(true);
    } else {
      setIsInput(false);
    }
  };
  return func;
};
