// Usage: npm run emulator:make-admin -- you@example.com
// Marks a user (already signed up in the local app) as email-verified and ADMIN.
// Emulator only.
const admin = require("firebase-admin");
const { PROJECT_ID, applyEmulatorEnv } = require("./emulator-env");

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run emulator:make-admin -- you@example.com");
  process.exit(1);
}

applyEmulatorEnv();
admin.initializeApp({ projectId: PROJECT_ID });

(async () => {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().updateUser(user.uid, { emailVerified: true });
  const ref = admin.firestore().collection("users").doc(user.uid);
  const snap = await ref.get();
  if (!snap.exists) {
    console.error(
      "No profile yet. Sign in to the local app once (it creates the profile), then rerun.",
    );
    process.exit(1);
  }
  await ref.update({ role: "ADMIN", isVerified: true });
  console.log(`${email} is now a verified ADMIN in the local emulator.`);
  process.exit(0);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
