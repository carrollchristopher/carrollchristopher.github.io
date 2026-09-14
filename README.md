<div align="center">
  <img src="public/og.jpg" alt="Chris Carroll, Escalation Lead Engineer and Cloud Architect" width="100%" />
</div>

# Christopher Carroll | Personal Site

Source for my personal site.

Live site: https://carrollchristopher.github.io/

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- WebGL background shader
- Spline 3D hero scene

## Local Development

Prerequisites:

- Node.js 24 LTS

Steps:

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`

## Build

1. Type-check: `npm run typecheck`
2. Build the production site: `npm run build`
3. Preview the production build locally: `npm run preview`

## Deployment

The site deploys to GitHub Pages through GitHub Actions. Every push to `main` type-checks, builds, and publishes `dist`.

## Performance Notes

- On desktops with hardware WebGL, the hero shows a loader while the Spline runtime, scene, and WASM module load in parallel, then the robot enters with its camera move. Phones and other devices get a poster and a recorded idle loop. The scene stops after the hero has been out of view for a while.
- The aurora background is plain WebGL, capped at 30 fps, drawn at reduced resolution, and paused in hidden tabs. Devices without hardware-accelerated WebGL keep a static CSS gradient.
- Fonts and images are self-hosted: one variable WOFF2 subset and WebP images.
