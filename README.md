# Recipeasy 🧾

This project lets you collect your favourite recipes and prepare your shopping list.

It's written in [TypeScript](https://www.typescriptlang.org/) and uses [React](https://react.dev/), a JavaScript UI library, [React Router](https://reactrouter.com/), a full-stack framework, [Prisma](https://www.prisma.io/) for database ORM, [shadcn/ui](https://ui.shadcn.com/) for UI components and [Better Auth](https://www.better-auth.com/) for authentication. I'm hosting the live version at [Fly.io](https://fly.io/).

## Get started

1. Clone the repository:

   ```sh
   git clone https://github.com/marekzelinka/recipeasy.git
   ```

2. Install the dependencies:

   ```sh
   pnpm i
   ```

3. Define required env variables:

   - Copy the template contents in [.env.example](.env.example) to a new file named `.env` and fill all the required fields.
   - You'll need to [follow this guide](https://www.better-auth.com/docs/authentication/google) to get your Google credentials: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

4. Finally, run the app in dev mode by running:

   ```sh
   pnpm dev
   ```

## Goals

I wanted to practice implementing authentication using React and React Router. Also, playing around with shadcn/ui `<Sidebar />` component.

## Credits

- _N/A_
