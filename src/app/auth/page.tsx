import { redirect } from "next/navigation";
import { BookOpenText, NotebookPen } from "lucide-react";
import { AuthForms } from "@/components/auth/auth-forms";
import { getCurrentSession } from "@/lib/auth/session";

export default async function AuthPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f9fcf8_0%,#eef5ef_100%)] px-4 py-10 text-emerald-950 sm:px-6 lg:px-8">
      <main className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.02fr_minmax(0,0.98fr)] lg:items-center">
        <section className="space-y-8">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm">
              nook login
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Вход в Nook без лишних шагов.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-emerald-900/68 sm:text-lg">
                Сначала вход. Если аккаунта еще нет, регистрация открывается тут же. После входа ты сразу попадаешь к своим заметкам.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-emerald-100 bg-white/88 p-5 shadow-[0_16px_40px_rgba(88,141,108,0.08)] sm:p-6">
            <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <NotebookPen className="size-4" />
                  Список заметок
                </div>
                <div className="mt-4 space-y-2">
                  {["Личный журнал", "Идеи", "Черновик текста"].map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-2xl px-3 py-3 text-sm ${
                        index === 0 ? "bg-emerald-500 text-white" : "bg-white text-emerald-900"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-emerald-100 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <BookOpenText className="size-4" />
                  Открытая заметка
                </div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-emerald-900/72">
                  <p>Открыл заметку, перечитал мысль, дописал пару строк и пошел дальше.</p>
                  <p>Интерфейс должен исчезать на фоне текста, а не конкурировать с ним.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AuthForms />
      </main>
    </div>
  );
}

