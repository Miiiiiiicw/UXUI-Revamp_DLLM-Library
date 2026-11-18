// Writes a fake service-account file so the API can start against the
// emulators without real credentials. Refuses to overwrite an existing file.
const fs = require("fs");
const crypto = require("crypto");
const { PROJECT_ID, CREDENTIAL_PATH } = require("./emulator-env");

if (fs.existsSync(CREDENTIAL_PATH)) {
  console.error(
    `A credential file already exists at ${CREDENTIAL_PATH}.\n` +
      "Not overwriting it. If it is a real one, move it somewhere safe first.",
  );
  process.exit(1);
}

const { privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
});

const credential = {
  type: "service_account",
  project_id: PROJECT_ID,
  private_key_id: "emulator",
  private_key: privateKey,
  client_email: `emulator@${PROJECT_ID}.iam.gserviceaccount.com`,
  client_id: "0",
  bucket_name: `${PROJECT_ID}.appspot.com`,
  google_maps_api_key: "",
  gmail_user: "",
  gmail_app_password: "",
  hosting_url: "http://localhost:3000/",
};

fs.writeFileSync(CREDENTIAL_PATH, JSON.stringify(credential, null, 2));
console.log(`Wrote emulator-only credentials to ${CREDENTIAL_PATH}`);
