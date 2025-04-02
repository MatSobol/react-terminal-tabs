import * as react_jsx_runtime from 'react/jsx-runtime';

type CommandFunction<T extends any[] = any[]> = (...args: T) => Promise<any> | any;
interface Commands {
    [key: string]: CommandFunction;
}

declare const Terminal: ({ commands, executeOnNewTabClient, executeOnRemoveTabClient, terminalStyle, }: {
    commands: Commands;
    executeOnNewTabClient?: (() => void) | null;
    executeOnRemoveTabClient?: ((idx: number) => void) | null;
    terminalStyle?: React.CSSProperties | null;
}) => react_jsx_runtime.JSX.Element;

export { Terminal as default };
