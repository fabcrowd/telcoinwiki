website coding for telcoinwiki.com

## Supabase diagnostics & verification
- Netlify env (set both pairs so Vite + legacy tooling work):
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- After deploy, visit **/supabase-test/** to see live status.
- Automated check:
  - Add the same four variables as **GitHub Secrets** if you want CI
    (React/Vite + verification scripts):
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Run **Actions → Verify Supabase** or `npm run verify:supabase` locally.
