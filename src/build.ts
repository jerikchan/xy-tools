import { readdirSync } from "fs";
import { join } from "path";
import { IOpts } from "./types";
import { isLerna } from "./utils";

import buildComponent from "./build/component";
import buildTheme from "./build/theme";
import buildTypeScript from "./build/typescript";

export default async function(opts: IOpts) {
  const { cwd, cmd, args } = opts;

  let build;
  switch (cmd) {
    case "theme":
      build = buildTheme;
      break;
    case "component":
      build = buildComponent;
      break;
    case "typescript":
      build = buildTypeScript;
      break;
  }

  if (cmd === "typescript") {
    await build({ cwd, args });
  } else if (isLerna(cwd)) {
    const pkgs = readdirSync(join(cwd, "packages"));
    for (const pkg of pkgs) {
      await build(`./packages/${pkg}`, { cwd });
    }
  } else {
    await build("./", { cwd });
  }
}
