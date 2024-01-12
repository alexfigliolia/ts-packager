import { existsSync } from "fs";
import { Logger } from "logging";
import type { CLIOptions } from "./CLIOptions";

export class Validations {
  public static commands = new Set([
    "build-all",
    "build-esm",
    "build-common",
    "fix-package-file",
  ]);
  constructor(public options: CLIOptions) {}

  public validateAll() {
    this.validateCommand();
    this.validateEntryPoint();
  }

  public validateCommand() {
    const command = this.options.get("command");
    if (!Validations.commands.has(command)) {
      Logger.error(
        `The command ${Logger.redBold(
          command,
        )} does not exist! Please choose from one of the following:`,
      );
      Logger.list(Array.from(Validations.commands), 5);
      Logger.newLine();
      process.exit(0);
    }
  }

  public validateEntryPoint() {
    const entrypoint = this.options.get("entrypoint");
    if (!existsSync(entrypoint)) {
      Logger.exitWithError("The specified entry point was not found");
    }
  }
}
