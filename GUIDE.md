# Student Hands-On Challenge Guide

You only need basic HTML, CSS, and Java experience to do this. You just need a free GitHub account, Git installed, and the repo link from your facilitator: `https://github.com/SLU-AWS-Cloud/git-series-sandbox-lab`.

---

## Prerequisites & Local Sanity Check

Before Challenge 1, run these in your terminal (Terminal on macOS/Linux, Git Bash or PowerShell on Windows) and confirm you get real output, not an error:

```bash
git --version
git config --global user.name
git config --global user.email
```

If `user.name` or `user.email` are empty, set them now (used to label every commit you make):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**Cheat sheet — the four places your code can live:**

| Area | What it is | How code gets there |
| --- | --- | --- |
| Working Directory | The files on your disk, as you see/edit them | You editing a file |
| Staging Area | A draft of your next commit | `git add <file>` |
| Local Repo | Commits saved in your `.git` history | `git commit` |
| Remote Repo | The copy on GitHub (your fork, or upstream) | `git push` / `git fetch` |

**Cheat sheet — Fast-Forward vs. 3-Way Merge vs. Rebase:**

| Strategy | When it happens | What your history looks like after |
| --- | --- | --- |
| Fast-forward merge | `main` hasn't moved since you branched | `main`'s pointer simply slides forward — no new commit |
| 3-way merge | Both branches have new commits since they diverged | A new "merge commit" is created, tying both histories together |
| Rebase | You replay your commits on top of the latest target branch | Your commits get new hashes and sit in a straight line after the target's commits — no merge commit |

---

## The 5 Progressive Hands-On Challenges

# Challenge 1: The Upstream Sync & Rebase Challenge

**Type:** Individual
**Learning objective:** Fork → clone → configure `upstream` → branch → commit → sync with a moving upstream via rebase → open a clean PR.
**Scenario:** You're joining a project that's already live. While you're working on your first feature, a teammate (your facilitator) pushes a change to the real `main`. You need to catch up without losing your own work.

**Steps:**

1. Fork `git-series-sandbox-lab` on GitHub (click **Fork**, top right).
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR-USERNAME/git-series-sandbox-lab.git
   cd git-series-sandbox-lab
   ```
3. Add the original repo as a second remote, `upstream`:

   ```bash
   git remote add upstream https://github.com/SLU-AWS-Cloud/git-series-sandbox-lab.git
   git remote -v
   ```

   You should now see both `origin` (your fork) and `upstream` (the shared repo) listed.
4. Create your feature branch:

   ```bash
   git checkout -b feat/add-<your-nickname>-profile
   ```
5. Copy the template and fill in your own details:

   ```bash
   cp profiles/template.json profiles/<YOUR-GITHUB-USERNAME>.json
   ```

   Edit the new file — set `name`, `githubUsername` (your real GitHub handle), `role`, `favoriteLanguage`, and `funFact`.
6. Commit:

   ```bash
   git add profiles/<YOUR-GITHUB-USERNAME>.json
   git commit -m "Add my profile"
   ```
7. **Wait for your facilitator's announcement** that they've pushed a change to `upstream/main`. When they do:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

   Your profile commit now sits on top of the facilitator's new commit.
8. Push your branch to your own fork:

   ```bash
   git push origin feature/add-my-profile
   ```
9. On GitHub, open a PR from your fork's branch into `upstream`'s `main`. Fill out the PR template fully.

**Expected output / verification:** `git log --oneline` shows your commit sitting directly on top of the facilitator's commit (no merge commit), and your PR shows "This branch is up to date with the base branch."

---

# Challenge 2: The Intentional Collision — Merge Conflict Resolution

**Type:** Pair
**Learning objective:** Produce and resolve a real merge conflict; read conflict markers correctly.
**Scenario:** You and your partner have both been asked to claim "Seat 5" in the shared registry — nobody told you someone else was assigned the same seat.

Decide who is **Developer A** and who is **Developer B**.

1. Both of you start clean:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b fix/claim-seat-5
   ```
2. Both open `shared-registry.md` and edit **Line 14** — the row `| 5 | _available_ | _available_ |` — but put **different** names/tracks in it.
3. **Developer A** commits, pushes, and opens + merges a PR into `main` first:

   ```bash
   git add shared-registry.md
   git commit -m "Claim seat 5"
   git push origin fix/claim-seat-5
   ```
4. **Developer B** commits and pushes the same way, then opens a PR — GitHub will show **This branch has conflicts that must be resolved**.
5. Developer B pulls the now-updated `main` into their branch:

   ```bash
   git fetch origin
   git merge origin/main
   ```
6. Git marks the conflict in `shared-registry.md` with:

   ```
   <<<<<<< HEAD
   | 5 | (Developer B's entry) |
   =======
   | 5 | (Developer A's entry) |
   >>>>>>> origin/main
   ```

   Everything between `<<<<<<<` and `=======` is **your** version; everything between `=======` and `>>>>>>>` is the version already on `main`.
7. Resolve by keeping both entries — edit the table so Seat 5 becomes two rows (renumber one to Seat 6), removing all three marker lines entirely.
8. Stage and complete the merge:

   ```bash
   git add shared-registry.md
   git commit -m "Resolve seat conflict: keep both entries"
   git push origin fix/claim-seat-5
   ```
9. Finish the PR merge on GitHub.

**Expected output / verification:** `git status` shows "nothing to commit, working tree clean" after resolving, and the merged `shared-registry.md` on `main` contains both developers' entries with no `<<<<<<<` markers left anywhere (the CI workflow will fail the PR if any remain — check the PR's checks tab).

---

# Challenge 3: Atomic Commits & Interactive Rebase

**Type:** Individual
**Learning objective:** Clean up messy commit history with `git rebase -i` before anyone else sees it.
**Scenario:** You were debugging live and committed every little change as you went. Before opening a PR, you need to present one clean, professional commit.

1. Start a fresh branch from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/logger-cleanup
   ```
2. Make 3 separate, intentionally messy commits to `utils/logger.js`:

   ```bash
   # Edit 1: add a comment
   git add utils/logger.js && git commit -m "wip"
   # Edit 2: fix a typo you just made
   git add utils/logger.js && git commit -m "fix typo"
   # Edit 3: add a new logDebug function
   git add utils/logger.js && git commit -m "more stuff"
   ```
3. Start an interactive rebase covering the last 3 commits:

   ```bash
   git rebase -i HEAD~3
   ```
4. Your editor opens a list like:

   ```
   pick a1b2c3d wip
   pick e4f5g6h fix typo
   pick i7j8k9l more stuff
   ```

   Change it to squash the last two into the first:

   ```
   pick a1b2c3d wip
   fixup e4f5g6h fix typo
   fixup i7j8k9l more stuff
   ```
5. Save and close the editor. Git will prompt you for a final commit message (since you used `pick` on the first one) — replace it with a proper conventional commit message:

   ```
   feat(logger): add logDebug and tidy structured log output
   ```
6. Verify:

   ```bash
   git log --oneline
   ```
7. Push (note: since you rewrote history, a normal push to a **brand-new** branch works fine; if you'd already pushed this branch before rebasing, you'd need `git push --force-with-lease`):

   ```bash
   git push origin feat/logger-cleanup
   ```

**Expected output / verification:** `git log --oneline` shows exactly **one** new commit (`feat(logger): ...`) instead of three, with no `wip` or `fix typo` messages left in history.

---

# Challenge 4: Rogue Branch Recovery with `git rebase --onto`

**Type:** Pair or Individual
**Learning objective:** Fix the common real-world mistake of branching off an unmerged feature branch instead of `main`.
**Scenario:** You branched `feat/analytics` off a teammate's unfinished, unapproved branch `feat/unapproved-api` instead of `main` — and now you need your work to land cleanly on `main` without dragging their unfinished code along.

1. Set up the mistake deliberately so you can practice fixing it:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/unapproved-api
   echo "// experimental, not approved" >> utils/logger.js
   git add utils/logger.js && git commit -m "WIP experimental API (do not merge)"
   
   git checkout -b feat/analytics
   echo "// analytics hook" >> app.js
   git add app.js && git commit -m "Add analytics hook"
   ```

   Right now, `feat/analytics` sits on top of `feat/unapproved-api`, which is not something you want merged into `main`.
2. Confirm the problem visually:

   ```bash
   git log --graph --oneline --all
   ```

   You'll see `feat/analytics`'s commit stacked on top of the unapproved commit, both above `main`.
3. Splice `feat/analytics` directly onto `main`, dropping the unapproved commit, using `rebase --onto`:

   ```bash
   git rebase --onto main feat/unapproved-api feat/analytics
   ```

   Read this command right to left: take everything on `feat/analytics` that comes **after** `feat/unapproved-api`, and replay it **onto** `main`.
4. Verify the fix:

   ```bash
   git log --graph --oneline --all
   ```

**Expected output / verification:** the graph now shows `feat/analytics`'s commit attached directly to `main`, with the "WIP experimental API" commit nowhere in its ancestry.

---

# Challenge 5: Simulated Enterprise Code Review

**Type:** Group of 3–4
**Learning objective:** Practice a realistic review cycle — checking out a teammate's PR locally, leaving inline comments, and iterating.

1. As a group, agree on review rules: every PR needs at least 1 approval and 1 real inline comment before merging.
2. Pick one group member's existing PR (from Challenge 1 or 3) to review first. Find its PR number on GitHub (e.g. `#7`).
3. Each reviewer checks the PR branch out **locally**, without needing push access to the author's fork:

   ```bash
   git fetch origin pull/7/head:review-pr-7
   git checkout review-pr-7
   ```

   (Run this inside your own clone of the shared/upstream repo if the author opened the PR there, or against their fork's URL if reviewing fork-to-fork.)
4. Open `index.html` locally and actually test the change.
5. On GitHub, go to the PR's **Files changed** tab, hover a specific line, click the **+** that appears, and leave a concrete, actionable comment (not just "looks good") — e.g., pointing out a missing field or a naming inconsistency.
6. Submit your review as **Request changes** (or **Approve** only if there is truly nothing to flag).
7. The PR author reads the feedback, makes the fix locally, and pushes a follow-up commit to the same branch:

   ```bash
   git add .
   git commit -m "Address review feedback"
   git push
   ```
8. The reviewer re-checks the diff, then clicks **Approve**.
9. Once the required approval + the `validate-contributions` CI check both pass, merge the PR.

**Expected output / verification:** the merged PR shows at least one inline review comment, a visible follow-up commit addressing it, and a green ✓ next to **Approve**.

---

# Emergency Rescue Protocol ("Oh No, What Did I Break?")

Use these any time you panic mid-challenge — all of them are safe and reversible.

| Situation | Command | What it does |
| --- | --- | --- |
| I edited a file and want to undo it, uncommitted | `git restore <file>` | Reverts the file in your working directory to its last committed state |
| I ran `git rebase` and it's a mess mid-way | `git rebase --abort` | Cancels the rebase entirely, returns you to exactly where you were before it started |
| I ran `git merge` and the conflict is too much right now | `git merge --abort` | Cancels the merge entirely, returns you to your pre-merge state |
| I think I lost commits (a bad rebase, a reset, a deleted branch) | `git reflog` | Shows a log of every place `HEAD` has pointed recently, including "lost" commits — find the commit hash you need and run `git checkout <hash>` or `git reset --hard <hash>` to recover it |

If none of these resolve it, ask a facilitator — getting stuck is a normal, expected part of today, not a sign you're doing something wrong.

---

## Quick Reference: Commands Used Today

| Action | Command |
| --- | --- |
| Add upstream remote | `git remote add upstream <url>` |
| Fetch from upstream | `git fetch upstream` |
| Rebase on upstream main | `git rebase upstream/main` |
| Create + switch branch | `git checkout -b <branch-name>` |
| Stage changes | `git add <file>` |
| Commit | `git commit -m "message"` |
| Push | `git push origin <branch-name>` |
| Interactive rebase | `git rebase -i HEAD~<n>` |
| Splice a branch onto another | `git rebase --onto <newBase> <oldBase> <branch>` |
| Check out a PR locally | `git fetch origin pull/<id>/head:<local-branch-name>` |
| View commit graph | `git log --graph --oneline --all --decorate` |
| Undo an uncommitted edit | `git restore <file>` |
| Cancel an in-progress rebase | `git rebase --abort` |
| Cancel an in-progress merge | `git merge --abort` |
| Recover a "lost" commit | `git reflog` |
