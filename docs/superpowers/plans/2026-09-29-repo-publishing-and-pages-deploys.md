# Repository Publishing and Pages Deploys Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the five local-only repositories the `/projects` page links to, clean the exposed keys out of `synack-web-search-engine`, put `pratech-tt-web` and `wolox-tt` on GitHub Pages, and give `my-steam-dashboard` a real README.

**Architecture:** Nine independent repositories, each touched once, each verified before its push. Pages deploys reuse the site's own workflow shape (build job → `upload-pages-artifact` → `deploy-pages`) pinned to the Node version whose prebuilt `node-sass` binary still exists. Every build is reproduced in a Docker container from an ext4 copy before the workflow is pushed.

**Tech Stack:** git, `gh` CLI (authenticated as `jorius`), GitHub Actions + Pages, Docker (`node:12-bullseye`, `node:14-bullseye`), Create React App 3, npm.

**Spec:** `docs/superpowers/specs/2026-09-29-projects-page-and-repo-publishing-design.md` (sections 4.1, 4.2, 5). Read it first.

## Global Constraints

- Local checkouts live on an NTFS drive: `/mnt/media/Sources/GitHub/Personal/<repo>` and `/mnt/media/Sources/GameProjects/balatro-advisor`. No exec bits, no symlinks; that is fine for everything here.
- **Never rebase, never force-push, never rewrite history.** Merges create merge commits (`--no-ff`). Exposed values are neutralised by new commits only.
- `commit.gpgsign=true` is set globally, so every commit is signed with key `365602820FC1B86C`. If a commit fails with `gpg failed to sign the data`, STOP and ask the owner to prime the agent in his terminal with `! echo test | gpg --clearsign -u 365602820FC1B86C > /dev/null`. Do not disable signing.
- Commit-message conventions per repo: pokedex repos and `my-steam-dashboard` use a capitalised infinitive verb subject (`Add …`, `Replace …`) and **no** `Co-Authored-By` trailer; `balatro-advisor` uses conventional commits (`docs: …`) **with** the trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`; the three 2020 repos have no Claude history, so use a capitalised verb subject with the trailer.
- Pushes go through SSH. `git@github-jorius:jorius/<repo>.git` and `git@github.com:jorius/<repo>.git` both authenticate as `jorius` (verified 2026-09-29). New remotes use the `github-jorius` alias.
- `gh` is logged in as `jorius`. Repos are created **public**.
- MIT license text is the exact block in Task 1, copyright `2026 Jose Ríos`, one file named `LICENSE` at the repo root.
- Never run the pokedex test suites or builds as part of this plan; they need Postgres/Redis and Windows-built `node_modules` may be present. Verification for those repos is `git status` clean + the remote SHA matching local.
- Scratch space for container builds: `$SCRATCH` = `/tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad` (ext4; Docker bind-mounts it).

## Review Focus

1. A Pages build whose asset URLs miss the `/<repo>/` prefix renders a blank page at the live URL — Tasks 7 and 8 grep `build/index.html` for the prefix before any push.
2. The Azure workflows still present when `master` is pushed would produce a red run on the public repo — Tasks 6 and 8 delete them in the same push that changes anything else.
3. Pages must exist before the first workflow run or `deploy-pages` fails with "Not Found" — Tasks 7 and 8 enable Pages through the API **before** pushing the workflow.
4. The synack keys also live in the README as "should look like" examples — Task 6 asserts zero occurrences of all three values across the tree after the edit.
5. The four pokedex READMEs link each other with `../` paths that 404 on GitHub — Tasks 2–5 assert `grep -c '](\.\./' README.md` is 0 after the rewrite.

## Shared snippets

Tasks below say "Snippet A/B/C verbatim". They are written once here so every task is self-contained.

**Snippet A — the LICENSE file** (byte-for-byte, at the repo root, file name `LICENSE`):

```bash
cat > LICENSE <<'EOF'
MIT License

Copyright (c) 2026 Jose Ríos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

**Snippet B — the package.json license field** (only where a `package.json` exists): insert the line `  "license": "MIT",` immediately after the `"description": …,` line. Verify with `node -e "console.log(require('./package.json').license)"` → `MIT`.

**Snippet C — README sibling-link rewrite** (run in the repo root; order of the three expressions matters):

```bash
sed -i \
  -e 's#\[`\.\./\(pokedex-[a-z-]*\)`\]#[`\1`]#g' \
  -e 's#](\.\./\(pokedex-[a-z-]*\)/\(docs\|drizzle\)/#](https://github.com/jorius/\1/blob/main/\2/#g' \
  -e 's#](\.\./\(pokedex-[a-z-]*\))#](https://github.com/jorius/\1)#g' \
  README.md
grep -c '](\.\./' README.md
```
Expected: `0`.

**Snippet D — remote-matches check** (run in the repo root after the push):

```bash
test "$(git rev-parse main)" = "$(git ls-remote origin main | cut -f1)" && echo REMOTE_MATCHES
```

---

### Task 1: Publish balatro-advisor

**Files:**
- Create: `/mnt/media/Sources/GameProjects/balatro-advisor/LICENSE`
- Modify: `/mnt/media/Sources/GameProjects/balatro-advisor/package.json` (add `"license": "MIT"` after `"description"`)

**Interfaces:**
- Produces: public repo `https://github.com/jorius/balatro-advisor`, default branch `main`.

- [ ] **Step 1: Confirm the repo is green and clean**

Run:
```bash
cd /mnt/media/Sources/GameProjects/balatro-advisor && git status --short && git branch --show-current && npm test 2>&1 | tail -3
```
Expected: no status lines, branch `main`, the node test runner reports `pass 16`-ish and `fail 0`. If the tree is dirty, STOP and report.

- [ ] **Step 2: Write the LICENSE**

In `/mnt/media/Sources/GameProjects/balatro-advisor`, run Snippet A verbatim.

- [ ] **Step 3: Add the license field to package.json**

Snippet B verbatim (the `"description"` line here is `  "description": "Watches Balatro's autosave and recommends what to play or discard.",`).

- [ ] **Step 4: Commit**

```bash
cd /mnt/media/Sources/GameProjects/balatro-advisor && git add LICENSE package.json && git commit -q -F - <<'EOF'
docs: add the MIT license

The repository is about to be published; the vendored Balatrolator engine is
MIT and this project follows it.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -1 --format='%h %G? %s'
```
Expected: a hash, `G` (good signature), the subject.

- [ ] **Step 5: Create the public repo, push, set topics**

```bash
cd /mnt/media/Sources/GameProjects/balatro-advisor
gh repo create jorius/balatro-advisor --public --description "Watches Balatro's autosave and recommends what to play or discard, scored with the vendored Balatrolator engine"
git remote add origin git@github-jorius:jorius/balatro-advisor.git
git push -u origin main
gh repo edit jorius/balatro-advisor --add-topic balatro --add-topic nodejs --add-topic game-tools
```

- [ ] **Step 6: Verify**

```bash
cd /mnt/media/Sources/GameProjects/balatro-advisor
test "$(git rev-parse main)" = "$(git ls-remote origin main | cut -f1)" && echo REMOTE_MATCHES   # Snippet D
gh repo view jorius/balatro-advisor --json visibility,defaultBranchRef,repositoryTopics --jq '{v:.visibility,b:.defaultBranchRef.name,t:[.repositoryTopics[].name]}'
```
Expected: `REMOTE_MATCHES`, `{"v":"PUBLIC","b":"main","t":["balatro","nodejs","game-tools"]}`.

---

### Task 2: Publish pokedex-api-express-ts

**Files:**
- Create: `/mnt/media/Sources/GitHub/Personal/pokedex-api-express-ts/LICENSE`
- Modify: `/mnt/media/Sources/GitHub/Personal/pokedex-api-express-ts/package.json` (add `"license": "MIT"` after `"description"`)
- Modify: `/mnt/media/Sources/GitHub/Personal/pokedex-api-express-ts/README.md` (sibling links)

**Interfaces:**
- Produces: `https://github.com/jorius/pokedex-api-express-ts`.

- [ ] **Step 1: Confirm clean**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-express-ts && git status --short && git branch --show-current && grep -c '](\.\./' README.md
```
Expected: no status lines, `main`, a count of 6 relative links.

- [ ] **Step 2: LICENSE and package.json**

In `/mnt/media/Sources/GitHub/Personal/pokedex-api-express-ts`, run Snippet A verbatim, then Snippet B.

- [ ] **Step 3: Rewrite the README's sibling links to GitHub URLs**

Run Snippet C verbatim in the repo root, then `grep -n 'github.com/jorius/pokedex' README.md | head -8`.
Expected: `0` from the snippet, then the rewritten lines (table rows at ~17–19 and the "related" list at ~539–541).

- [ ] **Step 4: Commit both changes (two commits, no trailer)**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-express-ts
git add LICENSE package.json && git commit -q -m "Add the MIT license" -m "The repository is being published; MIT matches the rest of the ecosystem."
git add README.md && git commit -q -m "Replace relative sibling links with GitHub URLs in the README" -m "The four repositories were siblings on one disk; on GitHub each is its own repository, so ../ links 404."
git log -2 --format='%h %G? %s'
```

- [ ] **Step 5: Create, push, topics**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-express-ts
gh repo create jorius/pokedex-api-express-ts --public --description "Pokedex REST API: Express 5 + TypeScript, clean architecture, PostgreSQL (Drizzle) and two-tier PokeAPI caching; schema and infra owner of the pokedex ecosystem"
git remote add origin git@github-jorius:jorius/pokedex-api-express-ts.git
git push -u origin main
gh repo edit jorius/pokedex-api-express-ts --add-topic pokedex --add-topic express --add-topic typescript --add-topic drizzle --add-topic postgresql --add-topic redis
```

- [ ] **Step 6: Verify**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-express-ts
test "$(git rev-parse main)" = "$(git ls-remote origin main | cut -f1)" && echo REMOTE_MATCHES   # Snippet D
gh api repos/jorius/pokedex-api-express-ts/readme -H "Accept: application/vnd.github.raw" | grep -c 'https://github.com/jorius/pokedex'
```
Expected: `REMOTE_MATCHES` and a count ≥ 6.

---

### Task 3: Publish pokedex-api-express-js

**Files:**
- Create: `/mnt/media/Sources/GitHub/Personal/pokedex-api-express-js/LICENSE`
- Modify: `.../pokedex-api-express-js/package.json`, `.../pokedex-api-express-js/README.md`

- [ ] **Step 1: Confirm clean**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-express-js && git status --short && git branch --show-current && grep -c '](\.\./' README.md
```
Expected: no status lines, `main`, `9`.

- [ ] **Step 2: LICENSE and package.json** — in this repo root, Snippet A verbatim, then Snippet B.

- [ ] **Step 3: Rewrite README links** — Snippet C verbatim in this repo root. Expected `0`; the drizzle migration links now read `https://github.com/jorius/pokedex-api-express-ts/blob/main/drizzle/0001_polite_violations.sql` and `.../0002_absurd_black_bird.sql`; the design charter link points at `https://github.com/jorius/pokedex-api-express-ts/blob/main/docs/superpowers/specs/2026-08-14-pokedex-ecosystem-design.md`.

- [ ] **Step 4: Commit (two commits, no trailer)**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-express-js
git add LICENSE package.json && git commit -q -m "Add the MIT license" -m "The repository is being published; MIT matches the rest of the ecosystem."
git add README.md && git commit -q -m "Replace relative sibling links with GitHub URLs in the README" -m "The four repositories were siblings on one disk; on GitHub each is its own repository, so ../ links 404."
git log -2 --format='%h %G? %s'
```

- [ ] **Step 5: Create, push, topics**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-express-js
gh repo create jorius/pokedex-api-express-js --public --description "Pokedex REST API: Express 5 + JavaScript (ESM), contract-identical mirror of the TypeScript service, PostgreSQL (Drizzle) and two-tier PokeAPI caching"
git remote add origin git@github-jorius:jorius/pokedex-api-express-js.git
git push -u origin main
gh repo edit jorius/pokedex-api-express-js --add-topic pokedex --add-topic express --add-topic javascript --add-topic drizzle --add-topic postgresql
```

- [ ] **Step 6: Verify**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-express-js
test "$(git rev-parse main)" = "$(git ls-remote origin main | cut -f1)" && echo REMOTE_MATCHES   # Snippet D
gh api repos/jorius/pokedex-api-express-js/readme -H "Accept: application/vnd.github.raw" | grep -c 'https://github.com/jorius/pokedex'
```
Expected: `REMOTE_MATCHES` and a count ≥ 9.

---

### Task 4: Publish pokedex-api-dotnet

**Files:**
- Create: `/mnt/media/Sources/GitHub/Personal/pokedex-api-dotnet/LICENSE`
- Modify: `.../pokedex-api-dotnet/src/PokedexApi.Api/appsettings.Development.json`
- Modify: `.../pokedex-api-dotnet/README.md`

- [ ] **Step 1: Confirm clean**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-dotnet && git status --short && git branch --show-current && grep -c '](\.\./' README.md
```
Expected: no status lines, `main`, `8`.

- [ ] **Step 2: LICENSE** — Snippet A verbatim in this repo root (there is no package.json here, so no Snippet B).

- [ ] **Step 3: Neutralise the local database password**

Edit `src/PokedexApi.Api/appsettings.Development.json`: the line
`    "PokedexDb": "Host=localhost;Port=5432;Database=pokedex;Username=postgres;Password=212115"`
becomes
`    "PokedexDb": "Host=localhost;Port=5432;Database=pokedex;Username=postgres;Password=CHANGE_ME"`.
Leave the `Jwt.Secret` placeholder as it is. Verify: `grep -c 212115 src/PokedexApi.Api/appsettings.Development.json` → `0`.

- [ ] **Step 4: Rewrite README links** — Snippet C verbatim in this repo root. Expected `0`; the migration link at ~line 241 now points at `https://github.com/jorius/pokedex-api-express-ts/blob/main/drizzle/0002_absurd_black_bird.sql`.

- [ ] **Step 5: Commit (three commits, no trailer)**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-dotnet
git add LICENSE && git commit -q -m "Add the MIT license" -m "The repository is being published; MIT matches the rest of the ecosystem."
git add src/PokedexApi.Api/appsettings.Development.json && git commit -q -m "Replace the local database password in the development settings" -m "The file is tracked and the repository is going public. The JWT secret already used a placeholder; the connection string now does too."
git add README.md && git commit -q -m "Replace relative sibling links with GitHub URLs in the README" -m "The four repositories were siblings on one disk; on GitHub each is its own repository, so ../ links 404."
git log -3 --format='%h %G? %s'
```

- [ ] **Step 6: Create, push, topics**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-dotnet
gh repo create jorius/pokedex-api-dotnet --public --description "Pokedex REST API: ASP.NET Core (.NET 10), Clean Architecture, EF Core database-first over the shared PostgreSQL schema, contract-identical with the Node services"
git remote add origin git@github-jorius:jorius/pokedex-api-dotnet.git
git push -u origin main
gh repo edit jorius/pokedex-api-dotnet --add-topic pokedex --add-topic dotnet --add-topic aspnet-core --add-topic ef-core --add-topic postgresql
```

- [ ] **Step 7: Verify**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-api-dotnet
test "$(git rev-parse main)" = "$(git ls-remote origin main | cut -f1)" && echo REMOTE_MATCHES   # Snippet D
gh api repos/jorius/pokedex-api-dotnet/readme -H "Accept: application/vnd.github.raw" | grep -c 'https://github.com/jorius/pokedex'
gh api repos/jorius/pokedex-api-dotnet/contents/src/PokedexApi.Api/appsettings.Development.json -H "Accept: application/vnd.github.raw" | grep -c CHANGE_ME
```
Expected: `REMOTE_MATCHES`, a count ≥ 8, then `2`.

---

### Task 5: Publish pokedex-web

**Files:**
- Create: `/mnt/media/Sources/GitHub/Personal/pokedex-web/LICENSE`
- Modify: `.../pokedex-web/package.json`, `.../pokedex-web/README.md`

- [ ] **Step 1: Confirm clean and that `.env` is ignored**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-web && git status --short && git branch --show-current && git check-ignore -q .env && echo ENV_IGNORED && grep -c '](\.\./' README.md
```
Expected: no status lines, `main`, `ENV_IGNORED`, `7`.

- [ ] **Step 2: LICENSE and package.json** — in this repo root, Snippet A verbatim, then Snippet B.

- [ ] **Step 3: Rewrite README links** — Snippet C verbatim in this repo root. Expected `0`.

- [ ] **Step 4: Commit (two commits, no trailer)**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-web
git add LICENSE package.json && git commit -q -m "Add the MIT license" -m "The repository is being published; MIT matches the rest of the ecosystem."
git add README.md && git commit -q -m "Replace relative sibling links with GitHub URLs in the README" -m "The four repositories were siblings on one disk; on GitHub each is its own repository, so ../ links 404."
git log -2 --format='%h %G? %s'
```

- [ ] **Step 5: Create, push, topics**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-web
gh repo create jorius/pokedex-web --public --description "React 19 + Vite frontend for the pokedex ecosystem: live backend switcher across three contract-identical APIs, nine game themes, pokeball economy with a slot machine, en/es"
git remote add origin git@github-jorius:jorius/pokedex-web.git
git push -u origin main
gh repo edit jorius/pokedex-web --add-topic pokedex --add-topic react --add-topic vite --add-topic typescript --add-topic rtk-query --add-topic tailwindcss
```

- [ ] **Step 6: Verify**

```bash
cd /mnt/media/Sources/GitHub/Personal/pokedex-web
test "$(git rev-parse main)" = "$(git ls-remote origin main | cut -f1)" && echo REMOTE_MATCHES   # Snippet D
gh api repos/jorius/pokedex-web/readme -H "Accept: application/vnd.github.raw" | grep -c 'https://github.com/jorius/pokedex'
gh repo list jorius --json name,isPrivate --jq '.[] | select(.name|test("pokedex|balatro")) | "\(.name) private=\(.isPrivate)"'
```
Expected: `REMOTE_MATCHES`, a count ≥ 7, then five lines all ending in `private=false`.

---

### Task 6: Clean synack-web-search-engine

**Files:**
- Modify: `/mnt/media/Sources/GitHub/Personal/synack-web-search-engine/.env.example`
- Modify: `/mnt/media/Sources/GitHub/Personal/synack-web-search-engine/README.md` (lines 5, 48, 51, 82)
- Delete: `/mnt/media/Sources/GitHub/Personal/synack-web-search-engine/.github/workflows/master_synack-web-search-engine.yml`

- [ ] **Step 1: Confirm clean, record the values to purge**

```bash
cd /mnt/media/Sources/GitHub/Personal/synack-web-search-engine && git status --short && git branch --show-current
grep -rn "AIzaSyCj-QWPgNWRIMyE4Wr17CDbN1ITW8jGYBw\|2011cb2cdee24ebf8cef34499a81db0e\|298a0ef142f5bd446" --exclude-dir=node_modules --exclude-dir=.git . | wc -l
```
Expected: clean, `master`, `6` occurrences (3 in `.env.example`, 3 in `README.md`).

- [ ] **Step 2: Replace the values**

```bash
cd /mnt/media/Sources/GitHub/Personal/synack-web-search-engine
sed -i \
  -e 's#298a0ef142f5bd446#your-search-engine-id#g' \
  -e 's#AIzaSyCj-QWPgNWRIMyE4Wr17CDbN1ITW8jGYBw#AIza...your-google-api-key#g' \
  -e 's#2011cb2cdee24ebf8cef34499a81db0e#your-bing-api-key#g' \
  .env.example README.md
sed -i 's#^### https://synack-web-search-engine.azurewebsites.net$#### Formerly https://synack-web-search-engine.azurewebsites.net — the Azure deployment was retired in 2026; run it locally with your own API keys (see below).#' README.md
git rm -q .github/workflows/master_synack-web-search-engine.yml
grep -rn "AIzaSyCj\|2011cb2c\|298a0ef1" --exclude-dir=node_modules --exclude-dir=.git . | wc -l; cat .env.example; sed -n '4,6p' README.md
```
Expected: `0`; the env file shows the three placeholders; the README's deploy line reads "Formerly …".

- [ ] **Step 3: Commit (two commits)**

```bash
cd /mnt/media/Sources/GitHub/Personal/synack-web-search-engine
git add .env.example README.md && git commit -q -F - <<'EOF'
Remove the real API keys from the example env and README

The example file and the setup guide carried live Google Custom Search and
Bing values since 2020. The keys are being revoked separately; the files now
show placeholders of the same shape.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git commit -q -F - <<'EOF'
Remove the retired Azure deploy workflow

The Azure Web App no longer exists and the workflow's secrets are gone, so
every push to master produced a failed run.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -2 --format='%h %G? %s'
```
(The second commit picks up the staged deletion from `git rm`.)

- [ ] **Step 4: Push and verify**

```bash
cd /mnt/media/Sources/GitHub/Personal/synack-web-search-engine && git push origin master
gh api repos/jorius/synack-web-search-engine/contents/.env.example -H "Accept: application/vnd.github.raw"
gh api repos/jorius/synack-web-search-engine/contents/.github/workflows 2>&1 | head -1
```
Expected: placeholders; the workflows call returns `Not Found`.

---

### Task 7: pratech-tt-web on GitHub Pages

**Files:**
- Modify (via merge): `master` of `/mnt/media/Sources/GitHub/Personal/pratech-tt-web`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md` (new header)

**Interfaces:**
- Produces: `https://jorius.github.io/pratech-tt-web/` serving the app; repo homepage set.

- [ ] **Step 1: Merge the real app into master**

```bash
cd /mnt/media/Sources/GitHub/Personal/pratech-tt-web
git status --short; git checkout -q master
git merge --no-ff origin/feature/1/check-validations-for-each-input -m "Merge feature/1/check-validations-for-each-input into master" -m "master held only the Create React App scaffold; the technical test itself lived on this branch since March 2020."
git log --oneline -3; test -f src/config/data/dynamic-form.json && echo APP_PRESENT
```
Expected: a merge commit on top, `APP_PRESENT`. (The 2020 branch was never merged, so there are no conflicts; if git reports one, STOP and report.)

- [ ] **Step 2: Reproduce the build in a Node 12 container**

`node-sass` 4.13.1 (pinned by the lockfile through `node-sass-chokidar`) has a prebuilt Linux binary for Node 12 (ABI 72) but not for Node 14.

```bash
SCRATCH=/tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad
mkdir -p "$SCRATCH/build-pratech"
rsync -a --delete --exclude node_modules --exclude build --exclude .git /mnt/media/Sources/GitHub/Personal/pratech-tt-web/ "$SCRATCH/build-pratech/"
docker run --rm -u "$(id -u):$(id -g)" -e HOME=/tmp -v "$SCRATCH/build-pratech":/app -w /app node:12-bullseye \
  bash -c 'npm ci --no-audit --no-fund 2>&1 | tail -3 && CI=false PUBLIC_URL=/pratech-tt-web/ npm run build:prd 2>&1 | tail -8'
grep -o '/pratech-tt-web/static/js/[^"]*' "$SCRATCH/build-pratech/build/index.html" | head -2
```
Expected: "Compiled successfully" (or "Compiled with warnings") and two `/pratech-tt-web/static/js/…` paths. If `npm ci` cannot install `node-sass`, STOP and report the exact error text. The spec allows swapping `node-sass` for `sass` as a separate commit (the `build-css`/`watch-css` scripts would then call `sass --load-path=src --load-path=node_modules src:src` and the workflow would move to Node 20), but that change is made only after the owner sees the failure.

- [ ] **Step 3: Add the workflow**

```bash
mkdir -p /mnt/media/Sources/GitHub/Personal/pratech-tt-web/.github/workflows
cat > /mnt/media/Sources/GitHub/Personal/pratech-tt-web/.github/workflows/deploy-pages.yml <<'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      # node-sass 4.13.1 (via node-sass-chokidar) only has a prebuilt binary up to Node 12.
      - name: Set up Node.js 12
        uses: actions/setup-node@v4
        with:
          node-version: '12'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build:prd
        env:
          CI: 'false'
          PUBLIC_URL: /pratech-tt-web/

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF
```

- [ ] **Step 4: Add a README header with the live URL**

Prepend to `README.md` (before the existing `# Prerequisites` line):

```markdown
# Pratech technical test (2020)

**Live:** https://jorius.github.io/pratech-tt-web/ — GitHub Pages build with the service mocker on; log in with the credentials listed under "Explore and discover the project".

A React app that renders a form dynamically from a JSON schema (`src/config/data/dynamic-form.json`) with per-field validations, a mocked login and English/Spanish text. Written in March 2020 as a technical test and published unchanged in 2026.

```
Verify: `head -3 README.md` shows the new title.

- [ ] **Step 5: Commit**

```bash
cd /mnt/media/Sources/GitHub/Personal/pratech-tt-web
git add .github/workflows/deploy-pages.yml README.md && git commit -q -F - <<'EOF'
Add a GitHub Pages deploy workflow and a README header

The test was never deployed anywhere visible. The workflow builds on Node 12
because the pinned node-sass has no newer prebuilt binary, and serves the
build under /pratech-tt-web/.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
```

- [ ] **Step 6: Enable Pages, then push, then watch**

```bash
gh api -X POST repos/jorius/pratech-tt-web/pages -f build_type=workflow --jq '.html_url'
cd /mnt/media/Sources/GitHub/Personal/pratech-tt-web && git push origin master
sleep 20; RUN=$(gh run list --repo jorius/pratech-tt-web --workflow deploy-pages.yml --limit 1 --json databaseId --jq '.[0].databaseId'); gh run watch "$RUN" --repo jorius/pratech-tt-web --exit-status
gh repo edit jorius/pratech-tt-web --homepage https://jorius.github.io/pratech-tt-web/
```
Expected: the Pages call prints `https://jorius.github.io/pratech-tt-web/`; the run finishes green.

- [ ] **Step 7: Verify the live site**

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://jorius.github.io/pratech-tt-web/
curl -s https://jorius.github.io/pratech-tt-web/ | grep -o '/pratech-tt-web/static/js/[^"]*' | head -1
```
Expected: `200` and a hashed bundle path. (Pages can take a minute after the run; retry once after 60 s if 404.)

---

### Task 8: wolox-tt on GitHub Pages

**Files:**
- Modify: `/mnt/media/Sources/GitHub/Personal/wolox-tt/src/config/settings/env-production.json`
- Delete: `.github/workflows/master_wlx-tt.yml`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md` line 3

- [ ] **Step 1: Confirm clean, turn the mocker on for production**

```bash
cd /mnt/media/Sources/GitHub/Personal/wolox-tt && git status --short && git branch --show-current
cat > src/config/settings/env-production.json <<'EOF'
{
  "environment": {
    "name": "production"
  },
  "reduxLogger": {
    "isEnabled": false
  },
  "serviceMocker": {
    "isEnabled": true
  },
  "services": {
    "root": "https://private-8e8921-woloxfrontendinverview.apiary-mock.com"
  }
}
EOF
git diff --stat
```
Expected: clean → `master`; the diff touches one file, +3 lines. (`config/index.js` deep-merges the env file over `globals.json`, so this overrides `serviceMocker.isEnabled: false`.)

- [ ] **Step 2: Reproduce the build in a Node 14 container**

```bash
SCRATCH=/tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad
mkdir -p "$SCRATCH/build-wolox"
rsync -a --delete --exclude node_modules --exclude build --exclude .git /mnt/media/Sources/GitHub/Personal/wolox-tt/ "$SCRATCH/build-wolox/"
docker run --rm -u "$(id -u):$(id -g)" -e HOME=/tmp -v "$SCRATCH/build-wolox":/app -w /app node:14-bullseye \
  bash -c 'npm ci --no-audit --no-fund 2>&1 | tail -3 && CI=false PUBLIC_URL=/wolox-tt/ npm run build-prod 2>&1 | tail -8'
grep -o '/wolox-tt/static/js/[^"]*' "$SCRATCH/build-wolox/build/index.html" | head -2
grep -o '"isEnabled":true' "$SCRATCH/build-wolox/build/static/js/main.*.js" | head -1
```
Expected: compiled, two `/wolox-tt/static/js/…` paths, and the mocker flag present in the bundle. If `npm ci` cannot install `node-sass`, STOP and report the exact error text; the `sass` swap is a separate commit made only after the owner sees the failure (same rule as pratech).

- [ ] **Step 3: Replace the Azure workflow with the Pages workflow**

```bash
cd /mnt/media/Sources/GitHub/Personal/wolox-tt && git rm -q .github/workflows/master_wlx-tt.yml
cat > .github/workflows/deploy-pages.yml <<'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      # node-sass 4.14.1 has a prebuilt binary up to Node 14 only.
      - name: Set up Node.js 14
        uses: actions/setup-node@v4
        with:
          node-version: '14'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build-prod
        env:
          CI: 'false'
          PUBLIC_URL: /wolox-tt/

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF
```

- [ ] **Step 4: Point the README at the new deployment**

Replace line 3 of `README.md`, currently
`## [https://wlx-tt.azurewebsites.net](https://wlx-tt.azurewebsites.net)`
with
`## [https://jorius.github.io/wolox-tt/](https://jorius.github.io/wolox-tt/) — GitHub Pages, service mocker enabled (the original Azure deployment was retired in 2026)`.
Verify with `sed -n '2,3p' README.md`.

- [ ] **Step 5: Commit (two commits)**

```bash
cd /mnt/media/Sources/GitHub/Personal/wolox-tt
git add src/config/settings/env-production.json && git commit -q -F - <<'EOF'
Enable the service mocker in the production build

The interview's mock API host no longer answers, so a static build has to
serve its own responses to be usable.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git add -A .github README.md && git commit -q -F - <<'EOF'
Replace the Azure workflow with a GitHub Pages deploy

The Azure Web App is gone and its secrets with it. The new workflow builds on
Node 14 because the pinned node-sass has no newer prebuilt binary, and serves
the build under /wolox-tt/.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
EOF
git log -2 --format='%h %G? %s'
```

- [ ] **Step 6: Enable Pages, push, watch, set homepage**

```bash
gh api -X POST repos/jorius/wolox-tt/pages -f build_type=workflow --jq '.html_url'
cd /mnt/media/Sources/GitHub/Personal/wolox-tt && git push origin master
sleep 20; RUN=$(gh run list --repo jorius/wolox-tt --workflow deploy-pages.yml --limit 1 --json databaseId --jq '.[0].databaseId'); gh run watch "$RUN" --repo jorius/wolox-tt --exit-status
gh repo edit jorius/wolox-tt --homepage https://jorius.github.io/wolox-tt/
```

- [ ] **Step 7: Verify the live site renders its login**

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://jorius.github.io/wolox-tt/
cat > /tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad/smoke-wolox.cjs <<'EOF'
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('https://jorius.github.io/wolox-tt/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const inputs = await page.locator('input').count();
  console.log(JSON.stringify({ url: page.url(), inputs, errors }));
  await browser.close();
})();
EOF
NODE_PATH=/mnt/media/Sources/JerichoDigital/geromanager/node_modules node /tmp/claude-1000/-home-jorius/33b2420a-0cc6-42ed-9a54-a2b333440b05/scratchpad/smoke-wolox.cjs
```
Expected: `200`, then JSON with `inputs` ≥ 2 (email + password) and an empty `errors` array. The URL will carry a hash route.

---

### Task 9: A real README for my-steam-dashboard

**Files:**
- Create: `README.md` on a new branch `docs/readme` of `/mnt/media/Sources/GitHub/Personal/my-steam-dashboard`, worked from a separate worktree so the 23 uncommitted files in the main checkout are untouched.

- [ ] **Step 1: Create the worktree**

```bash
cd /mnt/media/Sources/GitHub/Personal/my-steam-dashboard && git worktree prune
git worktree add -b docs/readme /mnt/media/Sources/GitHub/Personal/.worktrees/steam-readme main
cd /mnt/media/Sources/GitHub/Personal/.worktrees/steam-readme && git branch --show-current && test ! -f README.md && echo NO_README_YET
```
Expected: `docs/readme`, `NO_README_YET`.

- [ ] **Step 2: Write the README**

```bash
cat > /mnt/media/Sources/GitHub/Personal/.worktrees/steam-readme/README.md <<'EOF'
# My Steam Dashboard

A client-side dashboard for your Steam library: grid and list views with playtime stats, favourites, an achievement tracker with guide sections, and a settings page with JSON export and import. Everything you enter stays in your browser. The only server involved is a tiny CORS proxy that you run locally or deploy yourself.

> **Status: early and unfinished.** It works end to end, but it is far from what I want it to be. Expect rough edges and missing pieces.

## What it does

| Route | What you get |
| --- | --- |
| `/` | Library: every game you own as a grid or a list, with stats, search and filters |
| `/favorites` | A hand-picked shortlist, kept in the browser |
| `/game/:appId` | Achievement tracker: your progress, global unlock percentages, guide sections |
| `/settings` | Show or hide the stored API key, export everything as JSON, import a backup, clear data |
| `/family` | Steam Family games. Reachable by URL but hidden from the navigation: family data needs a Steam client session token that a Web API key cannot replace |

English and Spanish, light and dark theme, a small "Nothing"-style design system under `src/components/`.

## How it talks to Steam

The Steam Web API does not send CORS headers, so a browser cannot call it directly. A ~20-line proxy forwards `GET` requests to `https://api.steampowered.com` and adds the headers. Four interchangeable versions live in `proxy/`:

| File | Runs on |
| --- | --- |
| `proxy/local.mjs` | your machine: `node proxy/local.mjs` listens on port 8787 |
| `proxy/cloudflare-worker.js` | Cloudflare Workers |
| `proxy/netlify-function.ts` | Netlify Functions |
| `proxy/vercel-edge.ts` | Vercel Edge Functions |

The proxy holds no key and no state; the key travels in the query string from the browser, so deploy the proxy somewhere you control and do not share its URL.

## Running it locally

Requirements: Node 22 or newer, a [Steam Web API key](https://steamcommunity.com/dev/apikey) and your 64-bit Steam ID.

```bash
npm ci
cp .env.example .env        # VITE_PROXY_URL=http://localhost:8787
node proxy/local.mjs        # terminal 1: the CORS proxy
npm run dev                 # terminal 2: http://localhost:5173
```

On first load the app asks for the key and the Steam ID, validates them through the proxy and stores them in `localStorage`. `VITE_PROXY_URL` is the only configuration.

## Scripts

- `npm run dev` — Vite dev server with HMR
- `npm run build` — type check (`tsc -b`) then production build to `dist/`
- `npm run preview` — serve `dist/` locally
- `npm run lint` — ESLint
- `npx vitest` — unit tests under `src/test/`

## Stack

React 19, TypeScript, Vite, React Router 7, TanStack Query 5, Zustand, Tailwind CSS 4, react-i18next, Vitest.

## Design notes

The design spec and the implementation plan live in `docs/superpowers/`.
EOF
```

- [ ] **Step 3: Commit on the branch (no trailer)**

```bash
cd /mnt/media/Sources/GitHub/Personal/.worktrees/steam-readme
git add README.md && git commit -q -m "Add a README describing the dashboard, its proxy and its status" -m "The repository is linked from the owner's site; a visitor needs to know what it is, how it reaches Steam, and that it is unfinished."
git log -1 --format='%h %G? %s'
```

- [ ] **Step 4: Merge into main from the main checkout and push**

The main checkout is dirty with unrelated work; `README.md` is not among those files, so the merge is allowed.

```bash
cd /mnt/media/Sources/GitHub/Personal/my-steam-dashboard
git status --short | grep -c README.md   # expected 0
git merge --no-ff docs/readme -m "Merge docs/readme into main"
git push origin main
git worktree remove /mnt/media/Sources/GitHub/Personal/.worktrees/steam-readme
git status --short | wc -l   # still 23 dirty files, untouched
```

- [ ] **Step 5: Verify**

```bash
gh api repos/jorius/my-steam-dashboard/readme -H "Accept: application/vnd.github.raw" | head -3
```
Expected: the new title and first paragraph.

---

## Done when

- Five new public repos exist with LICENSE and topics, and `git ls-remote` matches local `main` for each.
- synack shows placeholders on GitHub and has no workflow.
- `https://jorius.github.io/pratech-tt-web/` and `https://jorius.github.io/wolox-tt/` answer 200 with hashed bundles under their prefixes.
- my-steam-dashboard's README renders on GitHub; its working tree still has exactly the uncommitted changes it had before.
- Report back the final URLs; the site plan's content files use them verbatim.
