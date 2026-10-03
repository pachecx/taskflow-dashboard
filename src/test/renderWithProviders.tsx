import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

type RenderOptions = {
  route?: string;
  queryClient?: QueryClient;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = "/", queryClient }: RenderOptions = {},
) {
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: Infinity } },
    });

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    ),
  });
}
