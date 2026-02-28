import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f9fcf8_0%,#eef5ef_100%)] px-4 py-6 text-emerald-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4 rounded-[28px] border border-emerald-100 bg-white/88 px-5 py-4 shadow-[0_18px_55px_rgba(88,141,108,0.08)] sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Nook</p>
            <p className="mt-1 text-sm text-emerald-900/60">write notes, read notes</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="rounded-2xl text-emerald-900 hover:bg-emerald-50"
            >
              <Link href="/auth?mode=sign-in">Войти</Link>
            </Button>
            <Button asChild className="rounded-2xl bg-emerald-500 px-5 text-white hover:bg-emerald-600">
              <Link href="/auth?mode=sign-up">
                Регистрация
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1fr_minmax(0,0.98fr)] lg:items-center">
          <section className="space-y-7">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm">
                notes first
              </span>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  Nook нужен для двух вещей: писать заметки и спокойно их читать.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-emerald-900/68 sm:text-lg">
                  Без перегруженного интерфейса. Открыл заметку, записал мысль, позже вернулся к ней и продолжил с того же места.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="h-11 rounded-2xl bg-emerald-500 px-6 text-white hover:bg-emerald-600">
                <Link href="/auth?mode=sign-in">
                  Открыть Nook
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-2xl border-emerald-200 bg-white/80 px-6 text-emerald-900 hover:bg-emerald-50"
              >
                <Link href="/auth?mode=sign-up">Создать аккаунт</Link>
              </Button>
            </div>
          </section>

          <section>
            <div className="rounded-[34px] border border-emerald-100 bg-white/90 p-5 shadow-[0_24px_80px_rgba(88,141,108,0.1)] sm:p-6">
              <div className="grid gap-4 md:grid-cols-[0.78fr_1.22fr]">
                <div className="rounded-[26px] border border-emerald-100 bg-[#f7fbf7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Заметки</p>
                  <div className="mt-4 space-y-2">
                    {[
                      "Идеи для Nook",
                      "Утренние записи",
                      "Конспект книги",
                      "Черновик статьи",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-2xl px-3 py-3 text-sm ${
                          index === 0
                            ? "bg-emerald-500 text-white"
                            : "bg-white text-emerald-900"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[26px] border border-emerald-100 bg-white p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <BookOpenText className="size-4" />
                    Открытая заметка
                  </div>
                  <div className="mt-4 space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-950">Идеи для Nook</h2>
                    <p className="text-sm leading-7 text-emerald-900/72">
                      Основа продукта должна оставаться простой: заметки лежат в коротком списке, а сама запись открывается как спокойная страница для чтения.
                    </p>
                    <p className="text-sm leading-7 text-emerald-900/72">
                      Новый текст создается рядом. Пользователь не тратит время на лишние разделы и служебные экраны.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

