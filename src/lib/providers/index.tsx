import { ReactNode, Suspense } from "react";
import "core-js/stable";
import "regenerator-runtime/runtime";
import QueryProviders from "./QueryProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProviders>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <Suspense>{children}</Suspense>
      </GoogleOAuthProvider>
    </QueryProviders>
  );
}
