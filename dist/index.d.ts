import * as react_jsx_runtime from 'react/jsx-runtime';

type CommandFunction<T extends any[] = any[]> = (...args: T) => Promise<any> | any;
interface Commands {
    [key: string]: CommandFunction;
}

declare const Terminal: ({ commands, executeOnNewTab, executeOnRemoveTab, terminalStyle, localStorageName, isMovable, zIndex, id, setOrder, }: {
    commands: Commands;
    executeOnNewTab?: (() => void) | null;
    executeOnRemoveTab?: ((idx: number) => void) | null;
    terminalStyle?: React.CSSProperties | null;
    localStorageName?: string;
    isMovable?: boolean;
    id?: number;
    zIndex?: number;
    setOrder?: React.Dispatch<React.SetStateAction<number[]>> | null;
}) => react_jsx_runtime.JSX.Element;

export { Terminal };
