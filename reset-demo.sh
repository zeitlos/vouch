#!/usr/bin/env bash
set -euo pipefail

# Reset the vouch repo to its pre-demo state.
# Run this before re-recording the Lucity demo.
#
# What this does:
#   1. Resets main to the base app (before the status filter merge)
#   2. Force-pushes main to GitHub
#   3. Ensures feature/status-filter branch still exists on remote
#
# What you still need to do manually in Lucity:
#   - Delete the "vouch" project from the dashboard (Project Settings → Danger Zone)
#   - Or if the project doesn't exist yet, you're good

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

# The commit hash of the base app (before status filter merge)
BASE_COMMIT="$(git log --oneline main | grep 'demo recording script' | awk '{print $1}')"

if [ -z "$BASE_COMMIT" ]; then
  echo "Could not find the demo script commit. Looking for first commit with 'Feedback board'..."
  BASE_COMMIT="$(git log --oneline main | grep 'Feedback board' | awk '{print $1}')"
fi

if [ -z "$BASE_COMMIT" ]; then
  echo "Error: could not determine the base commit to reset to."
  echo "Current history:"
  git log --oneline main
  exit 1
fi

echo "=== Vouch Demo Reset ==="
echo ""
echo "Current main:"
git log --oneline -3 main
echo ""
echo "Resetting main to: $BASE_COMMIT"
echo ""

# Check if the status filter merge has happened
if git log --oneline main | grep -q 'Add status filter bar'; then
  echo "Status filter was merged — resetting main..."
  git checkout main
  git reset --hard "$BASE_COMMIT"
  git push origin main --force
  echo "✓ main reset and force-pushed"
else
  echo "✓ main is already clean (status filter not merged)"
fi

# Ensure the feature branch exists on remote
if git ls-remote --heads origin feature/status-filter | grep -q feature/status-filter; then
  echo "✓ feature/status-filter exists on remote"
else
  echo "Pushing feature/status-filter to remote..."
  git push origin feature/status-filter
  echo "✓ feature/status-filter pushed"
fi

echo ""
echo "=== Reset Complete ==="
echo ""
echo "Git repo is ready for a fresh demo recording."
echo ""
echo "Don't forget to also:"
echo "  1. Delete the 'vouch' project in Lucity (if it exists)"
echo "  2. Clear any browser tabs from the previous recording"
echo ""
