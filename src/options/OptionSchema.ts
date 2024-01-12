import type { DefaultValue, IOptionSchema, OnHelp } from "./types";

export class OptionSchema<
  T extends BooleanConstructor | StringConstructor,
  M extends boolean = false,
> {
  type: T;
  name: string;
  onHelp: OnHelp;
  multiple?: boolean;
  flags: Set<string>;
  description: string;
  defaultValue: DefaultValue<T, M>;
  constructor({
    name,
    type,
    multiple,
    description,
    defaultValue,
    onHelp = () => {},
  }: IOptionSchema<T, M>) {
    this.name = name;
    this.type = type;
    this.onHelp = onHelp;
    this.multiple = multiple;
    this.description = description;
    this.defaultValue = defaultValue;
    this.flags = new Set([`--${name}`, `-${name[0]}`]);
  }
}
