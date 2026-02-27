import { redirect } from "next/navigation";
import { ArrowRight, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { AuthForms } from "@/components/auth/auth-forms";
import { getCurrentSession } from "@/lib/auth/session";

export default async function AuthPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ddf6e4,transparent_30%),radial-gradient(circle_at_top_right,#f4fff7,transparent_32%),radial-gradient(circle_at_bottom_left,#cfeeda,transparent_28%),linear-gradient(180deg,#f8fdf9_0%,#eef7f1_100%)] px-4 py-10 text-emerald-950 sm:px-6 lg:px-8">
      <main className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:items-center">
        <section className="space-y-8">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-emerald-200 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm">
              Nook Identity
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Личная вики для мыслей, а не еще один унылый список заметок.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-emerald-900/70 sm:text-lg">
                Зарегистрируйтесь, подтвердите email и заходите в свое закрытое пространство. Nook построен как личный knowledge garden: страницы, связи, быстрые черновики и понятный доступ.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: MailCheck,
                title: "Понятный вход",
                text: "Регистрация, подтверждение email и сброс пароля сведены к одному ясному сценарию.",
              },
              {
                icon: ShieldCheck,
                title: "Своя инфраструктура",
                text: "Почта и база живут на вашей машине, без привязки к внешнему BaaS.",
              },
              {
                icon: KeyRound,
                title: "Под контроль",
                text: "Роль администратора создается отдельно и не смешивается с обычными аккаунтами.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_20px_60px_rgba(88,141,108,0.12)] backdrop-blur"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <item.icon className="size-5" />
                </div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-900/68">
                  {item.text}
                </p>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-800/70">
            <span className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2">
              Better Auth + PostgreSQL
            </span>
            <span className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2">
              Beget SMTP для писем
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2">
              Доступ без лишних экранов
              <ArrowRight className="size-4" />
            </span>
          </div>
        </section>

        <AuthForms />
      </main>
    </div>
  );
}
