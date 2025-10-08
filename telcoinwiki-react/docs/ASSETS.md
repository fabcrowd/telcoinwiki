Hero and Marquee Assets
=======================

Drop your assets here and update `public/data/cinematic.json`.

 Hero videos/posters (optional until provided)
--------------------------------------------
- Place in `public/media/hero/`
- Provide `webm` (VP9/AV1) and `mp4` (H.264) per layer: `bg`, `mid`, `hud`
- Include poster frames (`webp` or `jpg`).
- Example config snippet (local files):

```
{
  "heroLayers": [
    {
      "id": "bg",
      "label": "Ambient background",
      "mask": "diagonal",
      "poster": "/media/hero/bg-1080.webp",
      "sources": [
        { "src": "/media/hero/bg-1080.webm", "type": "video/webm" },
        { "src": "/media/hero/bg-1080.mp4", "type": "video/mp4" }
      ],
      "durationMs": 1200
    }
  ]
}
```

Using Supabase storage (signed URLs generated at runtime):

```
{
  "heroLayers": [
    {
      "id": "bg",
      "label": "Ambient background",
      "mask": "diagonal",
      "poster": "/media/hero/bg-1080.webp",
      "sources": [
        { "supabase": { "bucket": "media", "path": "hero/bg-1080.webm", "expiresIn": 3600 }, "type": "video/webm" },
        { "supabase": { "bucket": "media", "path": "hero/bg-1080.mp4",  "expiresIn": 3600 }, "type": "video/mp4" }
      ]
    }
  ],
  "videoPolicy": { "minEffectiveType": "3g", "allowSaveData": false }
}
```

Notes:
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your env. If absent, the app falls back to posters.
- We prefer WebM/VP9 when supported and fall back to MP4/H.264, and pick a reasonable resolution variant per viewport.

Logo marquee assets
-------------------
- Place SVG/PNG/WebP in `public/media/marquee/logos/`
- Example config item with SVG:

```
{
  "marquee": {
    "items": [
      { "id": "brand-tn", "label": "Telcoin Network", "logoSrc": "/media/marquee/logos/telcoin-network.svg" }
    ]
  }
}
```

 Connection-aware loading
------------------------
- Videos only load on `minEffectiveType` (default `3g`) and when `Save-Data` is off (configurable).
