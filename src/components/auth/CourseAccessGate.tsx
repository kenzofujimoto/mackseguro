import { useUser } from "@clerk/react";
import { Navigate } from "react-router-dom";
import { isCourseAuthRequired } from "../../lib/clerkConfig.ts";

type CourseAccessGateProps = {
  children: React.ReactNode;
};

export default function CourseAccessGate({ children }: CourseAccessGateProps) {
  const { isLoaded, isSignedIn } = useUser();
  const requireAuth = isCourseAuthRequired();

  if (!requireAuth) {
    return <>{children}</>;
  }

  if (!isLoaded) {
    return (
      <section className="px-4 py-20 text-center text-sm text-[var(--color-text-secondary)]">
        Carregando acesso do curso...
      </section>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <>{children}</>;
}
