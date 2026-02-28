import { redirect } from "next/navigation";
import { ArrowRight, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { AuthForms } from "@/components/auth/auth-forms";
import { getCurrentSession } from "@/lib/auth/session";

export default async function AuthPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#def5e5,transparent_30%),radial-gradient(circle_at_bottom_right,#ccebd6,transparent_28%),linear-gradient(180deg,#f8fdf9_0%,#eef7f1_100%)] px-4 py-10 text-emerald-950 sm:px-6 lg:px-8">
      <main className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:items-center">
        <section className="space-y-8">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-emerald-200 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm">
              Nook Access
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Вход без шума, регистрация только когда она действительно нужна.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-emerald-900/68 sm:text-lg">
                Экран авторизации теперь ведет по привычному сценарию: сначала вход, затем регистрация как отдельный шаг. Без перегруженных вкладок и лишних решений на старте.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: KeyRound,
                title: "Фокус на входе",
                text: "Сначала предлагаем войти. Это основной сценарий для возвращающегося пользователя.",
              },
              {
                icon: ShieldCheck,
                title: "Регистрация вторым шагом",
                text: "Если аккаунта нет, регистрация открывается отдельной кнопкой и не мешает первому экрану.",
              },
              {
                icon: Sparkles,
                title: "Чистый поток",
                text: "Сброс пароля и подтверждение email остались рядом, но больше не перегружают главный экран входа.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-white/70 bg-white/72 p-5 shadow-[0_20px_60px_rgba(88,141,108,0.12)] backdrop-blur"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <item.icon className="size-5" />
                </div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-900/66">
                  {item.text}
                </p>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-800/72">
            <span className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2">
              PostgreSQL + Better Auth
            </span>
            <span className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2">
              SMTP через Beget
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2">
              Чистый UX доступа
              <ArrowRight className="size-4" />
            </span>
          </div>
        </section>

        <AuthForms />
      </main>
    </div>
  );
}
