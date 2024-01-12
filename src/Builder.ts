import { ChildProcess } from "@figliolia/child-process";
import path from "path";
import { existsSync } from "fs";
import { Logger } from "logging";
import { Packager, PackageMod } from "commands";
import { CLIParser, CLISchemas, Validations } from "options";

export class Builder extends CLIParser {
  public async CLI() {
    if (this.get("help")) {
      return this.printHelp();
    }
    const validators = new Validations(this);
    validators.validateAll();
    try {
      await this.run();
      Logger.info("Done!");
    } finally {
      await this.removeTMP();
    }
  }

  private run() {
    switch (this.get("command")) {
      case "fix-package-file":
        return new PackageMod(this).run();
      case "build-esm":
        return new Packager(this, "esm").run();
      case "build-common":
        return new Packager(this, "commonjs").run();
      case "build-all":
        return new Packager(this, "all").run();
    }
  }

  private printHelp() {
    Logger.newLine();
    CLISchemas.all().forEach(schema => {
      Logger.LOG(
        `${Logger.blueBold(schema.name)} (${Array.from(schema.flags).join(
          " | ",
        )}): ${schema.description}`,
      );
      schema.onHelp();
    });
  }

  public async removeTMP() {
    const project = this.get("project");
    const directory = path.join(project, "tmp");
    if (existsSync(directory)) {
      return new ChildProcess("rm -rf tmp").handler;
    }
  }
}
