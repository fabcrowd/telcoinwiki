#!/usr/bin/env bash
set -euo pipefail

# Netlify runs this script before each build. A zero exit status tells Netlify
# to skip the build; a non-zero status continues as normal.

branch="${BRANCH:-unknown}"
context="${CONTEXT:-unknown}"

case "${context}" in
  production|deploy-preview|branch-deploy)
    # Allow production builds from the main branch and all preview contexts.
    exit 1
    ;;
esac

if [[ "${branch}" == "main" ]]; then
  # Allow explicit main builds even if the context metadata is missing.
  exit 1
fi

echo "Skipping Netlify build for branch '${branch}' in context '${context}'."
exit 0
