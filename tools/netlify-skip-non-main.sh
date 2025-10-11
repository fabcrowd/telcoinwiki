#!/usr/bin/env bash
set -euo pipefail

# Netlify runs this script before each build. A zero exit status tells Netlify
# to skip the build; a non-zero status continues as normal.

branch="${BRANCH:-unknown}"
context="${CONTEXT:-unknown}"

if [[ "${context}" == "production" || "${branch}" == "main" ]]; then
  # Allow production builds from the main branch.
  exit 1
fi

echo "Skipping Netlify build for branch '${branch}' in context '${context}'."
exit 0

