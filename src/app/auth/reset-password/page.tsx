import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ddf6e4,transparent_30%),radial-gradient(circle_at_bottom_right,#cdeed7,transparent_28%),linear-gradient(180deg,#f7fcf8_0%,#eef7f1_100%)] px-4 py-10 text-emerald-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:items-center">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-emerald-200 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Nook Access
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Восстановите доступ без лишних экранов и тупиков.
            </h1>
            <p className="max-w-xl text-base leading-7 text-emerald-900/70 sm:text-lg">
              После смены пароля вы вернетесь к обычному входу. Ссылка из письма одноразовая и быстро истекает.
            </p>
          </div>
        </section>

        <ResetPasswordForm
          token={params.token ?? null}
          error={params.error ?? null}
        />
      </div>
    </div>
  );
}
