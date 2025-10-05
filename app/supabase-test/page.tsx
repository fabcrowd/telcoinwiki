'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export default function Page() {
  const [result, setResult] = useState('Loading…');

  useEffect(() => {
    if (!supabase) {
      setResult('Supabase client not initialized');
      return;
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setResult('Missing Supabase env vars (VITE_ or NEXT_PUBLIC_)');
      return;
    }

    // quick ping to REST root (no auth required) just to prove URL/key work
    fetch(SUPABASE_URL + '/rest/v1/', {
      headers: { apikey: SUPABASE_ANON_KEY as string }
    })
      .then(r => setResult(r.ok ? 'Connected to Supabase ✅' : `HTTP ${r.status}`))
      .catch(e => setResult('Error: ' + e.message));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Supabase connection test</h1>
      <p>{result}</p>
    </div>
  );
}
