const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

function fail(msg){ console.error("❌", msg); process.exit(1); }
function ok(msg){ console.log("✅", msg); }

if(!URL) fail("Missing NEXT_PUBLIC_SUPABASE_URL or VITE_SUPABASE_URL");
if(!KEY) fail("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY");

const headersAuth = { apikey: KEY };
const headersRest = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const fetchJson = async (path, headers) => {
  const r = await fetch(URL + path, { headers });
  const text = await r.text();
  let body; try { body = JSON.parse(text); } catch { body = text; }
  return { ok: r.ok, status: r.status, body };
};

const main = async () => {
  const health = await fetchJson("/auth/v1/health", headersAuth);
  if (!health.ok) fail(`auth/v1/health ${health.status} ${JSON.stringify(health.body)}`);
  ok("auth/v1/health OK");

  const rest = await fetchJson("/rest/v1/", headersRest);
  if (!rest.ok) fail(`rest/v1/ ${rest.status} ${JSON.stringify(rest.body)}`);
  ok("rest/v1/ OK");

  console.log("URL:", URL);
  console.log("ANON key preview:", KEY.slice(0,12) + "…" + KEY.slice(-8));
};

main().catch(e => fail(e.message || String(e)));
