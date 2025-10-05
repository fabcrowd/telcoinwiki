import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

const outDir =
  process.argv[2] ||
  process.env.SUPABASE_TEST_OUT_DIR ||
  "telcoinwiki-react/public/supabase-test";
const outFile = join(outDir, "index.html");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const keyPreview = KEY ? `${KEY.slice(0, 12)}…${KEY.slice(-8)}` : "(empty)";
const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Supabase connection test</title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:24px;color:#e6f0ff;background:#0f2341}
.card{background:#11264a;border:1px solid #274874;border-radius:12px;padding:20px;max-width:900px}
pre{white-space:pre-wrap}
.pill{background:#0b1f3d;border:1px solid #274874;border-radius:999px;padding:4px 10px;font-size:12px;color:#cfe2ff;display:inline-block;margin-right:8px}
.note{color:#9fb3cf}
</style>
</head><body>
<h1>Supabase connection test</h1>
<div class="card">
  <span class="pill">URL: ${URL ? "present" : "missing"}</span>
  <span class="pill">ANON KEY: ${KEY ? "present" : "missing"}</span>
  <p class="note">Key preview: <code>${keyPreview}</code></p>
  <p id="status">Checking…</p>
  <pre id="details"></pre>
</div>
<script>
const URL = ${JSON.stringify(URL)};
const KEY = ${JSON.stringify(KEY)};
const statusEl = document.getElementById('status');
const detailsEl = document.getElementById('details');

async function probe(path, headers){ 
  try{ 
    const r = await fetch(URL+path,{ headers }); 
    const t = await r.text(); 
    return { ok:r.ok, status:r.status, text:t }; 
  }catch(e){ return { ok:false, status:0, text:String(e && e.message || e) }; }
}

(async () => {
  if(!URL || !KEY){ 
    statusEl.textContent = 'Missing env vars';
    detailsEl.textContent = 'Set NEXT_PUBLIC_SUPABASE_URL (or VITE_SUPABASE_URL) and NEXT_PUBLIC_SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY) in Netlify, then redeploy.';
    return;
  }
  const auth = await probe('/auth/v1/health', { apikey: KEY });
  const rest = await probe('/rest/v1/', { apikey: KEY, Authorization: 'Bearer ' + KEY });

  statusEl.textContent = 'auth/v1/health: ' + auth.status + ' | rest/v1/: ' + rest.status;
  detailsEl.textContent = 
    'auth/v1/health:\\n' + auth.text + '\\n\\n' +
    'rest/v1/:\\n' + rest.text + '\\n\\n' +
    'Sent headers:\\n' + JSON.stringify({ apikey: KEY ? '(present)' : '(missing)', Authorization: KEY ? 'Bearer (present)' : '(missing)' }, null, 2) + '\\n' +
    'URL used: ' + URL + '\\nKey preview: ${keyPreview}';
})();
</script>
</body></html>\n`;
writeFileSync(outFile, html);
console.log("[supabase-test] wrote", outFile, "URL present:", !!URL, "ANON present:", !!KEY);
