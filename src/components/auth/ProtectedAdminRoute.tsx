import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";

type Props = {
  children: React.ReactNode;
};

const ADMIN_EMAILS = [
  "joaopaulo022005@gmail.com"
];

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

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}