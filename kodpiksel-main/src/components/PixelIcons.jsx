// // src/components/pixelIcons.jsx
// //
// // Pixel-art SVG icon set for kodpiksel.
// //
// // USAGE — anywhere you currently render an emoji, render <PixelIcon /> instead:
// //
// //   <PixelIcon emoji="🗝️" size={20} />
// //   <PixelIcon name="key" size={20} className="text-yellow-400" />
// //
// // The icons use `fill="currentColor"` for the main color, so you can theme
// // them with a CSS `color` (Tailwind: text-*) just like an emoji's implicit
// // color, no per-icon props needed. A couple of icons use a secondary muted
// // tone via `fillOpacity` for shading/depth.
// //
// // DICTIONARY — the whole point of this file: instead of hunting down every
// // 🗝️ / 🖥️ / ⏳ / 🧩 / ⭐ across the codebase, you swap the *render call*.
// // `EMOJI_TO_ICON` is the single source of truth mapping emoji -> icon name.
// // Anywhere you need the *string* itself (e.g. inside template strings sent
// // to flyReward, or notification text), use `ICON_GLYPH` lookups or just
// // keep rendering <PixelIcon> components directly in JSX.

// import React from 'react';

// // ---------------------------------------------------------------------------
// // 1. THE DICTIONARY
// // ---------------------------------------------------------------------------
// // emoji -> internal icon name
// export const EMOJI_TO_ICON = {
//   '🖥️': 'chip',
//   '🗝️': 'key',
//   '⏳': 'hourglass',
//   '🧩': 'puzzle',
//   '⭐': 'level',
//   '⌂': 'home',
//   '🔔': 'bell',
//   '🗂️': 'notebook',
//   '▶️': 'play',
//   '⚙️': 'settings',
//   '👤': 'profile',
// };

// // reverse lookup, handy for debugging / fallback
// export const ICON_TO_EMOJI = Object.fromEntries(
//   Object.entries(EMOJI_TO_ICON).map(([emoji, name]) => [name, emoji])
// );

// // ---------------------------------------------------------------------------
// // 2. RAW PIXEL ICONS (16x16 grid, drawn with <rect> "pixels")
// // ---------------------------------------------------------------------------
// // Each icon is a plain functional component. Grid: viewBox 0 0 16 16,
// // one unit = one "pixel". Keep edits aligned to whole units to preserve
// // the chunky pixel-art look.

// const base = {
//   shapeRendering: 'crispEdges',
// };

// export function ChipIcon({ size = 20, className, title = 'chip', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       {/* monitor stand */}
//       <rect x="6" y="13" width="4" height="1" fill="currentColor" fillOpacity="0.55" />
//       <rect x="5" y="14" width="6" height="1" fill="currentColor" fillOpacity="0.55" />
//       {/* monitor body */}
//       <rect x="1" y="2" width="14" height="10" fill="currentColor" />
//       {/* screen inset (cut-out, shown via opacity) */}
//       <rect x="2" y="3" width="12" height="8" fill="currentColor" fillOpacity="0.25" />
//       {/* screen "code" pixels */}
//       <rect x="3" y="4" width="3" height="1" fill="currentColor" />
//       <rect x="3" y="6" width="5" height="1" fill="currentColor" />
//       <rect x="3" y="8" width="2" height="1" fill="currentColor" />
//       <rect x="9" y="8" width="4" height="1" fill="currentColor" />
//     </svg>
//   );
// }

// export function KeyIcon({ size = 20, className, title = 'key', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       {/* bow (head) of the key - ring, outline only */}
//       <rect x="1" y="2" width="5" height="1" fill="currentColor" />
//       <rect x="1" y="8" width="5" height="1" fill="currentColor" />
//       <rect x="1" y="3" width="1" height="5" fill="currentColor" />
//       <rect x="5" y="3" width="1" height="5" fill="currentColor" />
//       {/* shaft, starts past the bow's right edge */}
//       <rect x="6" y="5" width="9" height="1" fill="currentColor" />
//       {/* teeth */}
//       <rect x="11" y="6" width="1" height="2" fill="currentColor" />
//       <rect x="13" y="6" width="1" height="3" fill="currentColor" />
//     </svg>
//   );
// }

// export function HourglassIcon({ size = 20, className, title = 'hourglass', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       {/* top + bottom caps */}
//       <rect x="3" y="1" width="10" height="1" fill="currentColor" />
//       <rect x="3" y="14" width="10" height="1" fill="currentColor" />
//       {/* frame */}
//       <rect x="4" y="2" width="8" height="1" fill="currentColor" />
//       <rect x="4" y="13" width="8" height="1" fill="currentColor" />
//       <rect x="5" y="3" width="1" height="2" fill="currentColor" />
//       <rect x="10" y="3" width="1" height="2" fill="currentColor" />
//       <rect x="5" y="11" width="1" height="2" fill="currentColor" />
//       <rect x="10" y="11" width="1" height="2" fill="currentColor" />
//       <rect x="6" y="5" width="1" height="1" fill="currentColor" />
//       <rect x="9" y="5" width="1" height="1" fill="currentColor" />
//       <rect x="6" y="10" width="1" height="1" fill="currentColor" />
//       <rect x="9" y="10" width="1" height="1" fill="currentColor" />
//       <rect x="7" y="6" width="2" height="2" fill="currentColor" />
//       {/* sand: top pile (full) */}
//       <rect x="6" y="3" width="4" height="1" fill="currentColor" fillOpacity="0.6" />
//       <rect x="6" y="4" width="4" height="1" fill="currentColor" fillOpacity="0.6" />
//       {/* sand: bottom pile (filling) */}
//       <rect x="6" y="11" width="4" height="1" fill="currentColor" fillOpacity="0.6" />
//       <rect x="7" y="10" width="2" height="1" fill="currentColor" fillOpacity="0.6" />
//     </svg>
//   );
// }

// export function PuzzleIcon({ size = 20, className, title = 'puzzle', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       {/* main piece body */}
//       <rect x="1" y="3" width="6" height="6" fill="currentColor" />
//       <rect x="9" y="1" width="6" height="6" fill="currentColor" />
//       <rect x="1" y="9" width="6" height="6" fill="currentColor" fillOpacity="0.7" />
//       <rect x="9" y="9" width="6" height="6" fill="currentColor" fillOpacity="0.45" />
//       {/* connecting knobs to sell the "puzzle piece" silhouette */}
//       <rect x="7" y="4" width="2" height="2" fill="currentColor" />
//       <rect x="7" y="10" width="2" height="2" fill="currentColor" fillOpacity="0.55" />
//       <rect x="4" y="9" width="2" height="2" fill="currentColor" fillOpacity="0.85" />
//       <rect x="10" y="7" width="2" height="2" fill="currentColor" fillOpacity="0.85" />
//     </svg>
//   );
// }

// export function LevelIcon({ size = 20, className, title = 'level', ...props }) {
//   // Clean 5-point pixel star, built row by row, mirror-symmetric on x=8.
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       <rect x="7"  y="0"  width="2"  height="4" fill="currentColor" />
//       <rect x="5"  y="4"  width="6"  height="2" fill="currentColor" />
//       <rect x="0"  y="6"  width="16" height="2" fill="currentColor" />
//       <rect x="2"  y="8"  width="12" height="2" fill="currentColor" />
//       <rect x="3"  y="10" width="3"  height="2" fill="currentColor" />
//       <rect x="10" y="10" width="3"  height="2" fill="currentColor" />
//       <rect x="1"  y="12" width="4"  height="2" fill="currentColor" />
//       <rect x="11" y="12" width="4"  height="2" fill="currentColor" />
//     </svg>
//   );
// }

// export function HomeIcon({ size = 20, className, title = 'home', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       {/* roof */}
//       <rect x="7" y="1" width="2" height="1" fill="currentColor" />
//       <rect x="6" y="2" width="4" height="1" fill="currentColor" />
//       <rect x="5" y="3" width="6" height="1" fill="currentColor" />
//       <rect x="4" y="4" width="8" height="1" fill="currentColor" />
//       <rect x="3" y="5" width="10" height="1" fill="currentColor" />
//       {/* body */}
//       <rect x="3" y="6" width="10" height="8" fill="currentColor" />
//       {/* door cut-out */}
//       <rect x="7" y="9" width="2" height="5" fill="currentColor" fillOpacity="0.3" />
//     </svg>
//   );
// }

// export function BellIcon({ size = 20, className, title = 'notifications', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       <rect x="7" y="1" width="2" height="1" fill="currentColor" />
//       <rect x="5" y="2" width="6" height="1" fill="currentColor" />
//       <rect x="4" y="3" width="8" height="6" fill="currentColor" />
//       <rect x="3" y="9" width="10" height="2" fill="currentColor" />
//       <rect x="6" y="12" width="4" height="1" fill="currentColor" />
//     </svg>
//   );
// }

// export function NotebookIcon({ size = 20, className, title = 'notebook', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       <rect x="2" y="1" width="11" height="14" fill="currentColor" />
//       <rect x="4" y="3" width="7" height="9" fill="currentColor" fillOpacity="0.3" />
//       <rect x="0" y="3" width="2" height="1" fill="currentColor" />
//       <rect x="0" y="7" width="2" height="1" fill="currentColor" />
//       <rect x="0" y="11" width="2" height="1" fill="currentColor" />
//     </svg>
//   );
// }

// export function PlayIcon({ size = 20, className, title = 'play', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       <rect x="3" y="2" width="2" height="12" fill="currentColor" />
//       <rect x="5" y="4" width="2" height="8" fill="currentColor" />
//       <rect x="7" y="5" width="2" height="6" fill="currentColor" />
//       <rect x="9" y="6" width="2" height="4" fill="currentColor" />
//       <rect x="11" y="7" width="2" height="2" fill="currentColor" />
//     </svg>
//   );
// }

// export function SettingsIcon({ size = 20, className, title = 'settings', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       <rect x="7" y="0" width="2" height="2" fill="currentColor" />
//       <rect x="7" y="14" width="2" height="2" fill="currentColor" />
//       <rect x="0" y="7" width="2" height="2" fill="currentColor" />
//       <rect x="14" y="7" width="2" height="2" fill="currentColor" />
//       <rect x="2" y="2" width="2" height="2" fill="currentColor" />
//       <rect x="12" y="2" width="2" height="2" fill="currentColor" />
//       <rect x="2" y="12" width="2" height="2" fill="currentColor" />
//       <rect x="12" y="12" width="2" height="2" fill="currentColor" />
//       <rect x="5" y="5" width="6" height="6" fill="currentColor" />
//       <rect x="7" y="7" width="2" height="2" fill="currentColor" fillOpacity="0.3" />
//     </svg>
//   );
// }

// export function ProfileIcon({ size = 20, className, title = 'profile', ...props }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-label={title} role="img" {...base} {...props}>
//       <rect x="5" y="1" width="6" height="6" fill="currentColor" />
//       <rect x="3" y="9" width="10" height="6" fill="currentColor" />
//     </svg>
//   );
// }



// export const ICONS = {
//   chip: ChipIcon,
//   key: KeyIcon,
//   hourglass: HourglassIcon,
//   puzzle: PuzzleIcon,
//   level: LevelIcon,
//   home: HomeIcon,
//   bell: BellIcon,
//   notebook: NotebookIcon,
//   play: PlayIcon,
//   settings: SettingsIcon,
//   profile: ProfileIcon,
// };

// /**
//  * <PixelIcon emoji="🗝️" />  OR  <PixelIcon name="key" />
//  * Drop-in replacement for an emoji glyph. Falls back to rendering the
//  * original emoji as text if no mapping/icon exists, so nothing breaks
//  * if a new emoji slips in before its icon is made.
//  */
// export function PixelIcon({ emoji, name, size = 20, className, ...props }) {
//   const iconName = name ?? EMOJI_TO_ICON[emoji];
//   const Icon = iconName && ICONS[iconName];

//   if (!Icon) {
//     // graceful fallback — unmapped emoji renders as-is
//     return <span className={className} style={{ fontSize: size * 0.8 }}>{emoji ?? '❓'}</span>;
//   }

//   return <Icon size={size} className={className} {...props} />;
// }

// // ---------------------------------------------------------------------------
// // 4. STRING HELPER for places that need raw SVG markup (e.g. flyReward,
// //    which injects into the DOM outside of React render).
// // ---------------------------------------------------------------------------

// /**
//  * Returns an SVG markup string for a given icon name or emoji — useful for
//  * vanilla-DOM code (innerHTML) like RewardFly.jsx, where you can't render
//  * a React component. Pass a `color` (CSS color string) since there's no
//  * `currentColor` context outside of inherited DOM styles.
//  */
// export function getIconSVGString(nameOrEmoji, { size = 32, color = '#1a1a1a' } = {}) {
//   const iconName = ICONS[nameOrEmoji] ? nameOrEmoji : EMOJI_TO_ICON[nameOrEmoji];
//   const paths = ICON_PIXEL_DATA[iconName];
//   if (!paths) return null;

//   const rects = paths
//     .map(([x, y, w, h, opacity = 1]) =>
//       `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" fill-opacity="${opacity}" />`
//     )
//     .join('');

//   return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" style="shape-rendering: crispEdges;" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
// }

// // Raw pixel data mirrors the JSX components above, kept in sync manually.
// // [x, y, width, height, opacity?]
// const ICON_PIXEL_DATA = {
//   chip: [
//     [6, 13, 4, 1, 0.55], [5, 14, 6, 1, 0.55],
//     [1, 2, 14, 10, 1],
//     [2, 3, 12, 8, 0.25],
//     [3, 4, 3, 1, 1], [3, 6, 5, 1, 1], [3, 8, 2, 1, 1], [9, 8, 4, 1, 1],
//   ],
//   key: [
//     [1, 2, 5, 1], [1, 8, 5, 1], [1, 3, 1, 5], [5, 3, 1, 5],
//     [6, 5, 9, 1],
//     [11, 6, 1, 2], [13, 6, 1, 3],
//   ],
//   hourglass: [
//     [3, 1, 10, 1], [3, 14, 10, 1],
//     [4, 2, 8, 1], [4, 13, 8, 1],
//     [5, 3, 1, 2], [10, 3, 1, 2], [5, 11, 1, 2], [10, 11, 1, 2],
//     [6, 5, 1, 1], [9, 5, 1, 1], [6, 10, 1, 1], [9, 10, 1, 1],
//     [7, 6, 2, 2],
//     [6, 3, 4, 1, 0.6], [6, 4, 4, 1, 0.6],
//     [6, 11, 4, 1, 0.6], [7, 10, 2, 1, 0.6],
//   ],
//   puzzle: [
//     [1, 3, 6, 6, 1], [9, 1, 6, 6, 1],
//     [1, 9, 6, 6, 0.7], [9, 9, 6, 6, 0.45],
//     [7, 4, 2, 2, 1], [7, 10, 2, 2, 0.55], [4, 9, 2, 2, 0.85], [10, 7, 2, 2, 0.85],
//   ],
//   level: [
//     [7, 0, 2, 4],
//     [5, 4, 6, 2],
//     [0, 6, 16, 2],
//     [2, 8, 12, 2],
//     [3, 10, 3, 2], [10, 10, 3, 2],
//     [1, 12, 4, 2], [11, 12, 4, 2],
//   ],
// };  