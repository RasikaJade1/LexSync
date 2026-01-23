
  # LexSync Web App UI

  LexSync is a modern law-firm management web application UI built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.  
  The visual design is based on the original Figma file:  
  `https://www.figma.com/design/lxyBsf6IEI8MfObKRIzCIX/LexSync-Web-App-UI-Design`

  ## Tech stack

  - **Build tool**: Vite
  - **Language**: TypeScript + React
  - **Styling**: Tailwind CSS + custom global styles
  - **UI components**: Shadcn/Radix-style component library

  ## Getting started

  ```bash
  # install dependencies
  npm install

  # start dev server
  npm run dev
  ```

  Then open the printed local URL (usually `http://localhost:5173`) in your browser.

  ## Available scripts

  - `npm run dev` – start the development server
  - `npm run build` – create a production build
  - `npm run preview` – preview the production build locally

  ## Project structure

  - `src/App.tsx` – main app shell and routing/layout wiring
  - `src/components` – feature-level UI (dashboard, profile, case management, etc.)
  - `src/components/ui` – reusable building-block components (buttons, inputs, dialogs, etc.)
  - `src/styles/globals.css` – theme tokens and global styles

  ## Contributing / development notes

  - Do not commit `node_modules`, build artefacts, or local env files – these are ignored via `.gitignore`.
  - Keep components small and focused; prefer reusing primitives from `src/components/ui` where possible.
  - When adjusting layouts that come from Figma, try to match spacing and typography tokens defined in `globals.css`.

  