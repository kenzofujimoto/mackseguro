import { useUser } from "@clerk/react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserGamification, type UserGamification } from "../lib/gamification/badges";
import { CalendarDays, Trophy, Zap, ShieldCheck } from "lucide-react";
import CertificateGenerator from "../components/profile/CertificateGenerator";

export default function Perfil() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [gamification, setGamification] = useState<UserGamification | null>(null);
  const [isLoadingGamification, setIsLoadingGamification] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setIsLoadingGamification(true);
      fetchUserGamification(user.id)
        .then((data) => setGamification(data))
        .catch((e) => console.error("Error fetching gamification:", e))
        .finally(() => setIsLoadingGamification(false));
    }
  }, [user?.id]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-mack)] border-r-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const badges = gamification?.badges || [];
  const earnedBadges = badges.filter((b) => b.isEarned);
  const totalXp = gamification?.totalXp || 0;
  const completedTrails = gamification?.completedTrails || [];

  const rarityColors = {
    common: "bg-gray-100 text-gray-800 border-gray-200",
    rare: "bg-blue-50 text-blue-800 border-blue-200",
    epic: "bg-purple-50 text-purple-800 border-purple-200",
    legendary: "bg-orange-50 text-[var(--color-mack)] border-orange-200",
  };

  return (
    <div className="page-shell px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* CABEÇALHO DO PERFIL */}
        <section className="card-mk flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start text-center sm:text-left">
          <img
            src={user.imageUrl}
            alt={user.fullName || "Avatar do usuário"}
            className="h-28 w-28 rounded-full shadow-lg border-4 border-white object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{user.fullName || "Usuário"}</h1>
            <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
            <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start">
              <div className="flex items-center gap-2 rounded-full bg-[var(--color-mack)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-mack-dark)]">
                <Zap className="h-4 w-4" />
                {totalXp} XP Alcançados
              </div>
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                <Trophy className="h-4 w-4" />
                {earnedBadges.length} Conquistas
              </div>
            </div>
          </div>
        </section>

        {isLoadingGamification ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-mack)] border-r-transparent" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {/* MEDALHAS */}
            <section className="card-mk p-6">
              <div className="mb-6 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-[var(--color-mack)]" />
                <h2 className="text-2xl font-bold text-gray-900">Suas Insígnias</h2>
              </div>
              {badges.length === 0 ? (
              <p className="text-gray-500">Nenhuma insígnia ainda.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
                      badge.isEarned
                        ? rarityColors[badge.rarity] + " shadow-sm scale-100"
                        : "bg-gray-50 border-gray-200 opacity-60 grayscale scale-95"
                    }`}
                  >
                    <span className="text-4xl mb-2">{badge.icon}</span>
                    <h3 className="font-bold">{badge.title}</h3>
                    <p className="text-xs mt-1 leading-relaxed opacity-80">
                      {badge.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CERTIFICADOS */}
          <section className="card-mk p-6">
            <div className="mb-6 flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-[var(--color-mack)]" />
              <h2 className="text-2xl font-bold text-gray-900">Meus Certificados</h2>
            </div>

            {completedTrails.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center">
                <p className="text-gray-500">
                  Complete uma trilha inteira para desbloquear seu primeiro<br />
                  certificado digital MackSeguro!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedTrails.map((trail: any) => {
                  const today = new Intl.DateTimeFormat('pt-BR').format(new Date());
                  const hours = trail.slug === "seguranca-digital-todos" ? "20 horas" : "10 horas";

                  return (
                    <div
                      key={trail.slug}
                      className="flex flex-col items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h3 className="font-bold text-gray-900">{trail.titulo}</h3>
                        <p className="text-sm text-gray-500">
                          {hours} • Concluído
                        </p>
                      </div>
                      <CertificateGenerator
                        userId={user.id}
                        trailSlug={trail.slug}
                        userName={user.fullName || "Aluno(a)"}
                        courseName={trail.titulo}
                        completionDate={today}
                        totalHours={hours}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
        )}
      </div>
    </div>
  );
}