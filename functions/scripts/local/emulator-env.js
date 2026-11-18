// Shared settings for running the API against the local Firebase emulators.
// Nothing here can reach the live project: "demo-" project IDs are offline-only.
const path = require("path");

const PROJECT_ID = "demo-bookguide";
const CREDENTIAL_PATH = path.join(
  __dirname,
  "../../src/dllm-libray-firebase-adminsdk.json",
);

function applyEmulatorEnv() {
  process.env.GCLOUD_PROJECT = PROJECT_ID;
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
}

module.exports = { PROJECT_ID, CREDENTIAL_PATH, applyEmulatorEnv };
