export const addTab = (
  tabs: string[],
  setTabs: React.Dispatch<React.SetStateAction<string[]>>,
  executeOnNewTab: () => void
) => {
  const newTab = `Tab ${tabs.length + 1}`;
  setTabs((list) => [...list, newTab]);
  executeOnNewTab();
};

export const removeTab = (
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

export const changeTab = (
  e: React.MouseEvent,
  idx: number,
  setCurrTabNum: React.Dispatch<React.SetStateAction<number>>
) => {
  e.stopPropagation();
  setCurrTabNum(idx);
};
