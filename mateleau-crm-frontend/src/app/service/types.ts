import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter as BackendAppRouter } from '../../../../mateleau-crm-backend/src/trpc'; // Adjust the import path

export type AppRouter = BackendAppRouter;