import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

// Définition des routes tRPC
export const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello, ${input.name}!` };
    }),
});

// Export du type pour le frontend
export type AppRouter = typeof appRouter;