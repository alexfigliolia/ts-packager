import chalk from "chalk";
import type { OptionSchema } from "Options";

export class Logger {
  public static readonly chalk = chalk;
  private static readonly _LOG = console.log;
  public static LOG: (...data: any[]) => void = this._LOG;
  public static readonly redBold = this.chalk.redBright.bold;
  public static readonly blueBold = this.chalk.blueBright.bold;

  public static info(message: string) {
    this.LOG(this.blueBold("TS Packager: "), message);
  }

  public static error(message: string) {
    this.LOG(this.redBold("TS Packager: "), message);
  }

  public static exitWithError(error: string) {
    this.error(error);
    process.exit();
  }

  public static newLine() {
    this.LOG("\n");
  }

  public static logOption(option: OptionSchema<any>) {
    this.LOG(
      this.blueBold(option.name),
      `(${Array.from(option.flags).join(" | ")}): `,
      option.description,
    );
  }

  public static list(list: string[], indentation = 0) {
    list.forEach((item, i) => {
      this.LOG(`${" ".repeat(indentation)}${i + 1}. ${item}`);
    });
  }
}
