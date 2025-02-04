import { Injectable } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './types'; // Import the types from the shared package or local file

@Injectable({
  providedIn: 'root'
})
export class TrpcService {
  private trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:5000/trpc',
      }),
    ],
  });

  // Expose les méthodes du backend
  getHello(name: string) {
    return this.trpcClient.hello.query({ name });
  }
}