# Running BookGuide locally with test data

Use this to try changes on your own computer without touching the live app.
Everything runs against the Firebase Emulator Suite under the offline project ID
`demo-bookguide`, so sign-ups, books and posts you create stay on your machine.

> Why not `bookguide-staging`? It is a second website in the same Firebase project
> as production and shares the live database. Anything tested there is real data.

## What works locally

| Works | Doesn't (yet) |
|---|---|
| Sign up and sign in (Auth emulator) | Emails (no Gmail credentials). Use `make-admin` below to skip email verification |
| All Firestore data: users, books, news, booklists | Photo uploads (Cloud Storage is not emulated) |
| GraphQL API and the full client | Address lookup (no Google Maps key). Leave address empty |

## One-off setup

Needs Node 22, Java 11+ (for the Firestore emulator) and the Firebase CLI
(`npm install -g firebase-tools`). No Firebase login needed.

```bash
cd functions && npm install && npm run emulator:credentials
cd ../client && npm install
```

`emulator:credentials` writes a fake `functions/src/dllm-libray-firebase-adminsdk.json`
for the `demo-bookguide` project. It refuses to overwrite an existing file. If you
already have a real credential file there, move it out first.

## Every time (three terminals)

```bash
# 1. Emulators (from the repo root)
firebase emulators:start --project demo-bookguide --only auth,firestore

# 2. API on http://localhost:4000/graphql
cd functions && npm run dev:emulator

# 3. App on http://localhost:3000
cd client && npm run dev:emulator
```

- Emulator UI (browse and edit data): http://127.0.0.1:4400
- `dev:emulator` in `functions` aborts if the credential file isn't for a `demo-` project.
- `dev:emulator` in `client` swaps in `client/src/dllm-client-config.emulator.json`
  and connects to the Auth emulator. Plain `npm run dev` is unchanged.

Data is cleared when the emulators stop. To keep it between runs:

```bash
firebase emulators:start --project demo-bookguide --only auth,firestore \
  --import=.emulator-data --export-on-exit
```

## Make yourself an admin

1. Sign up in the local app (any email, nothing is sent).
2. Finish the profile step so your user record exists.
3. Run:

```bash
cd functions && npm run emulator:make-admin -- you@example.com
```

This marks the email as verified and sets `role: ADMIN`. Refresh the app.

## Test data for the 新聞 tab revamp

As admin, create via the app (or in the Emulator UI):

- A co-editing post tagged `超強推介`, title e.g. `12月「超.強」推介`
- A co-editing post tagged `讀友推介台`
- A few books, then recommend them from the book page

## Troubleshooting

- **Port already in use:** something else is on 3000, 4000, 4400, 8080 or 9099.
- **`Cannot find module './generated/graphql'`:** `dev:emulator` generates it on
  first run; otherwise run `npx graphql-codegen --config codegen.ts` in `functions`.
- **`Could not resolve "@tensorflow/tfjs"` in the client:** install without
  `--legacy-peer-deps`, or add it with `npm install @tensorflow/tfjs --no-save`.
