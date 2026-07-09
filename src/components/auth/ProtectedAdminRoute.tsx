import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";

type Props = {
  children: React.ReactNode;
};

type AdminEnv = Readonly<{
  VITE_ADMIN_EMAILS?: string;
}>;

function parseAdminEmails(value: string | undefined): string[] {
  return (value ?? "")
    .split(/[,\s;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isConfiguredAdminEmail(
  email: string | undefined,
  env: AdminEnv = import.meta.env as AdminEnv,
): boolean {
  if (!email) {
    return false;
  }

  return parseAdminEmails(env.VITE_ADMIN_EMAILS).includes(email.trim().toLowerCase());
}

export default function ProtectedAdminRoute({ children }: Props) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return <div className="p-8">Verificando acesso...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const email = user?.primaryEmailAddress?.emailAddress;

  if (!isConfiguredAdminEmail(email)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
