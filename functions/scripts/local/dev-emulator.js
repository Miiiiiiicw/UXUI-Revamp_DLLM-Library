// Starts the GraphQL API on http://localhost:4000/graphql against the local
// emulators. Aborts unless the credential file belongs to a "demo-" project,
// so it can never run with live credentials by mistake.
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { CREDENTIAL_PATH, applyEmulatorEnv } = require("./emulator-env");

if (!fs.existsSync(CREDENTIAL_PATH)) {
  console.error("No credential file. Run: npm run emulator:credentials");
  process.exit(1);
}
const { project_id: projectId } = JSON.parse(
  fs.readFileSync(CREDENTIAL_PATH, "utf8"),
);
if (!String(projectId).startsWith("demo-")) {
  console.error(
    `Credential file is for "${projectId}", not a demo- project. ` +
      "Refusing to start: this could touch live data.",
  );
  process.exit(1);
}

const root = path.join(__dirname, "../..");
if (!fs.existsSync(path.join(root, "src/generated/graphql.ts"))) {
  console.log("Generating GraphQL types first (one-off)...");
  require("child_process").execSync("npx graphql-codegen --config codegen.ts", {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
}

applyEmulatorEnv();
const child = spawn("npx", ["ts-node", "src/index.ts"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});
child.on("exit", (code) => process.exit(code ?? 0));
