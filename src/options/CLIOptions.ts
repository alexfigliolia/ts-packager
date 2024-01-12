import type { Command, IOptions } from "./types";

export class CLIOptions {
  help: boolean;
  command: Command;
  entrypoint: string;
  project: string;
  constructor({
    help = false,
    project = "",
    entrypoint = "",
    command = "build-all",
  }: IOptions) {
    this.help = help;
    this.project = project;
    this.entrypoint = entrypoint;
    this.command = command || "build-all";
  }

  public get<K extends keyof CLIOptions>(key: K): CLIOptions[K] {
    return this[key];
  }
}
