import type { Command, IOptions } from "./types";

export class CLIOptions {
  help: boolean;
  command: Command;
  entrypoint: string;
  project: string;
  constructor({
    help = false,
    entrypoint = "",
    project = "",
    command = "build-all",
  }: IOptions) {
    this.help = help;
    this.command = command;
    this.entrypoint = entrypoint;
    this.project = project;
  }

  public get<K extends keyof CLIOptions>(key: K): CLIOptions[K] {
    return this[key];
  }
}
