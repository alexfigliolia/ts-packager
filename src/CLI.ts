#!/usr/bin/env node
import { Builder } from "./Builder";

(async () => {
  const builder = new Builder();
  await builder.CLI();
})();
