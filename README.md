# Running the Project

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
JWT_SECRET=YOUR_SECRET
ENCRYPTION_KEY=YOUR_SECRET
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

## Install Dependencies

```bash
pnpm install
```

## Development

Start the development server with hot-reloading:

```bash
pnpm dev
```

## Build

Compile TypeScript, rewrite path aliases, generate Prisma client, and copy Prisma files:

```bash
pnpm build
```

## Production

Run the compiled application:

```bash
pnpm start
```
