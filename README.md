website coding for telcoinwiki.com

## Supabase diagnostics & verification
- Netlify env (pick one convention):
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, or
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- After deploy, visit **/supabase-test/** to see live status.
- Automated check:
  - Add the same two variables as **GitHub Secrets** if you want CI:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Run **Actions → Verify Supabase** or `npm run verify:supabase` locally.
