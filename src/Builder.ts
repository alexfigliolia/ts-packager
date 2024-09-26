import { BuildOverrides, PackageMod, Packager } from "commands";
import { Logger } from "logging";
import { CLIParser, CLISchemas, Validations } from "options";

export class Builder extends CLIParser {
  private complete = false;
  private cleaningUp = false;
  constructor() {
    super();
    this.onExit = this.onExit.bind(this);
    this.listenForKillSignals();
  }

  public async CLI() {
    if (this.get("help")) {
      this.complete = true;
      return this.printHelp();
    }
    const validators = new Validations(this);
    validators.validateAll();
    try {
      await this.executeCommand();
      this.complete = true;
      Logger.info("Done!");
    } finally {
      this.onExit();
    }
  }

  private executeCommand() {
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
      if (schema.description) {
        Logger.LOG(
          `${Logger.blueBold(schema.name)} (${Array.from(schema.flags).join(
            " | ",
          )}): ${schema.description}`,
        );
        schema.onHelp();
      }
    });
  }

  onExit() {
    if (this.complete) {
      return;
    }
    if (!this.cleaningUp) {
      void BuildOverrides.removeTMP();
      this.cleaningUp = true;
      if (!this.complete) {
        void Packager.removeDIST();
      }
    }
  }

  private listenForKillSignals() {
    process.on("exit", this.onExit);
    process.on("SIGINT", this.onExit);
    process.on("SIGQUIT", this.onExit);
    process.on("beforeExit", this.onExit);
    process.on("uncaughtException", this.onExit);
    process.on("unhandledRejection", this.onExit);
  }
}
