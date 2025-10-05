# Telcoin brand palette (2025 refresh)

The color tokens below were resampled directly from [`telcoin.network`](https://telcoin.network) by inspecting the production Next.js CSS bundles (`/_next/static/css/*.css`). The hues align with the hero gradients (`.bg-ocean-gradient`, `.bg-ocean-hero-home`) and supporting utility classes that ship on the live site.

| Token | Hex | RGB | Usage |
| --- | --- | --- | --- |
| `--tc-blue-sky` | `#37AEFF` | `rgb(55, 174, 255)` | Primary highlight, hover/focus states, and ocean gradient entry color. |
| `--tc-blue-core` | `#0093F5` | `rgb(0, 147, 245)` | Core Telcoin call-to-action blue used on CTAs and active controls. |
| `--tc-blue-royal` | `#391FFF` | `rgb(57, 31, 255)` | Deep royal accent leveraged for emphasis states and gradient tails. |
| `--tc-blue-violet` | `#5533FF` | `rgb(85, 51, 255)` | Violet anchor from `.bg-ocean-hero-home` gradient overlays. |
| `--tc-neutral-50` | `#F8F8FB` | `rgb(248, 248, 251)` | Lightest neutral for text ink mixes and glass surfaces. |
| `--tc-neutral-100` | `#F2F2F5` | `rgb(242, 242, 245)` | Soft neutral backgrounds and subdued cards. |
| `--tc-neutral-200` | `#DBDDE6` | `rgb(219, 221, 230)` | Border tints and table dividers. |
| `--tc-neutral-300` | `#D3D3D3` | `rgb(211, 211, 211)` | Secondary strokes inside gradients (e.g., ocean hero fallback). |
| `--tc-neutral-500` | `#636B92` | `rgb(99, 107, 146)` | Muted text and icon tint from body copy styles. |
| `--tc-neutral-600` | `#535979` | `rgb(83, 89, 121)` | Deep neutral for subdued headings and metadata. |
| `--tc-white` | `#FFFFFF` | `rgb(255, 255, 255)` | Pure white used for contrast checks and overlays. |

## Derived gradients and transparencies

- **Hero shell**: `radial-gradient(1200px 800px at 10% -10%, rgba(55, 174, 255, 0.16), transparent 70%), linear-gradient(180deg, #04345F 0%, #050B1F 60%)`
- **Ocean glass**: `linear-gradient(256deg, rgba(55, 174, 255, 0.6), rgba(85, 51, 255, 0.6)), linear-gradient(245deg, rgba(51, 172, 255, 0.3) 43.29%, #5533FF 78%)`
- **Soft fills**: `rgba(0, 147, 245, 0.22)` (primary), `rgba(55, 174, 255, 0.18)` (accent), `rgba(57, 31, 255, 0.32)` (royal)

These values drive the refreshed `tokens.css` palette to ensure the wiki mirrors the live marketing site’s contrast and depth.
