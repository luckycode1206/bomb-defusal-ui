# Bomb Defusal UI

Build the initial frontend for a multiplayer web game called "Bomb Defusal".

This is a cooperative bomb-defusal game where players will eventually form teams, join a lobby, receive different roles, and communicate to defuse a bomb before the timer runs out.

For this first version, ONLY build the frontend UI. Do not implement authentication, Supabase, database functionality, multiplayer functionality, APIs, or real backend logic yet.

Create these pages/screens:

1. Landing page

- Game title: "BOMB DEFUSAL"

- Short description explaining the game

- "Play Now" button

- "How It Works" section

- Dark tactical/industrial visual theme

- Red warning accents

- Subtle animations

- Responsive design for desktop and mobile

2. Login page

- Email field

- Password field

- Login button

- Link to Sign Up

- This is UI only for now

3. Sign Up page

- Username

- Email

- Password

- Confirm password

- Create Account button

- UI only for now

4. Dashboard

- Player username placeholder

- Create Team button

- Join Team button

- Recent Games section

- Team section

- Clean game dashboard layout

5. Team Lobby

- Team name

- Room code

- List of players

- Player ready indicators

- Host indicator

- Start Game button

- Mission status

- This should look like a real multiplayer lobby, but it does not need real multiplayer functionality yet

6. Bomb Defusal Game screen

- Large central bomb interface

- Countdown timer

- Strike indicators

- Three modules:

  - Wires

  - Keypad

  - Password

- Defuser view

- Module interaction UI

- Tactical warning indicators

- This is only a visual prototype for now

7. Expert Manual screen

- Bomb manual interface

- Instructions for the three modules

- Clear distinction from the Defuser screen

- This is only a visual prototype

8. Results screen

- Victory / Defeat state

- Team name

- Completion time

- Strikes

- Modules solved

- Play Again button

- Return to Dashboard button

Design requirements:

- Premium dark tactical UI

- Industrial / military / cyberpunk inspiration

- Use red as the primary danger accent but don't overuse it

- Strong typography

- Glowing borders and subtle shadows

- Smooth transitions and hover effects

- Responsive layout

- Avoid excessive gradients

- Make it look like a polished real game rather than a generic dashboard

- Use reusable React components

- Keep the code organized and maintainable

Use React, TypeScript and Tailwind CSS.

For now, use mock/static data wherever necessary.

Do not connect any external services.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6f59c9fb-bc0d-4aee-9936-dd3d9ad3297f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
