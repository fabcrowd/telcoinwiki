Hero and Marquee Assets
=======================

Drop your assets here and update `public/data/cinematic.json`.

Hero videos/posters (optional until provided)
--------------------------------------------
- Place in `public/media/hero/`
- Provide `webm` (VP9/AV1) and `mp4` (H.264) per layer: `bg`, `mid`, `hud`
- Include poster frames (`webp` or `jpg`).
- Example config snippet:

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

