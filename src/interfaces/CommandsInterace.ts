export type CommandFunction<T extends any[] = any[]> = (
  ...args: T
) => Promise<any> | any;

export interface Commands {
  [key: string]: CommandFunction;
}
