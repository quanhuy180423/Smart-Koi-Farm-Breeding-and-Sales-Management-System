import { ReactNode, Suspense } from "react";
import "core-js/stable";
import "regenerator-runtime/runtime";
import QueryProviders from "./QueryProviders";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProviders>
      <Suspense>{children}</Suspense>
    </QueryProviders>
  );
}
