export type Command =
  | "build-all"
  | "build-esm"
  | "build-common"
  | "fix-package-file";

export type DefaultValue<
  T extends BooleanConstructor | StringConstructor,
  M extends boolean = false,
> = T extends BooleanConstructor
  ? boolean
  : T extends StringConstructor
  ? M extends true
    ? string[]
    : string
  : never;

export type OnHelp = () => void;

export interface IOptionSchema<
  T extends BooleanConstructor | StringConstructor,
  M extends boolean = false,
> {
  type: T;
  name: string;
  multiple?: M;
  onHelp?: OnHelp;
  description: string;
  defaultValue: DefaultValue<T, M>;
}

export interface IOptions {
  help?: boolean;
  command?: Command;
  entrypoint?: string;
  project?: string;
}
