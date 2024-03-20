import { Logger } from "logging";
import { OptionSchema } from "./OptionSchema";
import { Validations } from "./Validations";

export class CLISchemas {
  public static all() {
    return [
      this.helpSchema,
      this.commandSchema,
      this.entrypointSchema,
      this.project,
    ] as const;
  }

  public static readonly commandSchema = new OptionSchema({
    name: "command",
    type: String,
    defaultValue: "",
    description:
      "The packaging command to run. You can either choose to build for ESM, commonJS, both, or to modify your package.json to property serve the correct build",
    onHelp: () => {
      Logger.list(Array.from(Validations.commands), 5);
    },
  });

  public static readonly entrypointSchema = new OptionSchema({
    name: "entrypoint",
    type: String,
    defaultValue: "./",
    description: `An relative path to your application's entry point. (Defaults to ${Logger.chalk.gray(
      "./",
    )})`,
  });

  public static readonly project = new OptionSchema({
    name: "project",
    type: String,
    defaultValue: process.cwd(),
    description: `An path (relative or absolute) to your repository folder. (Defaults to ${Logger.chalk.gray(
      "process.cwd()",
    )})`,
  });

  public static readonly helpSchema = new OptionSchema({
    name: "help",
    type: Boolean,
    defaultValue: false,
    description: "",
  });
}
