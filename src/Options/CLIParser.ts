import path from "path";
import { Logger } from "Logging";
import { CLIOptions } from "./CLIOptions";
import { CLISchemas } from "./CLISchemas";
import type { OptionSchema } from "./OptionSchema";

export class CLIParser extends CLIOptions {
  constructor() {
    super(CLIParser.parse());
    this.entrypoint = path.join(this.get("project"), this.get("entrypoint"));
  }

  private static parse() {
    const { map, parsedOptions } = this.indexOptions();
    const inputs = process.argv.slice(1);
    while (inputs.length) {
      const input = inputs.shift();
      if (!input || !(input in map)) {
        continue;
      }
      const params = map[input];
      if (params.type === Boolean) {
        parsedOptions[params.name] = true;
      } else {
        let next = inputs.shift();
        while (next) {
          if (typeof next !== "string") {
            Logger.exitWithError(
              `"${params.name}" requires a valid string value`,
            );
          }
          if (!params.multiple) {
            parsedOptions[params.name] = next;
            break;
          }
          if (next in map) {
            inputs.unshift(next);
            break;
          }
          parsedOptions[params.name] = parsedOptions[params.name] || [];
          parsedOptions[params.name].push(next);
          next = inputs.shift();
        }
      }
    }
    return parsedOptions;
  }

  private static indexOptions() {
    const options = CLISchemas.all();
    const parsedOptions: Record<string, any> = {};
    const map = {} as Record<string, OptionSchema<any, any>>;
    for (const option of options) {
      for (const flag of option.flags) {
        map[flag] = option;
      }
      parsedOptions[option.name] = option.defaultValue;
    }
    return { map, parsedOptions };
  }
}
