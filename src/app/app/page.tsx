import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpenText, Clock3, List, Plus } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThoughtEditor } from "@/components/editor/thought-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/session";

const notes = [
  {
    title: "Идеи для Nook",
    excerpt: "Сделать интерфейс спокойным, чтобы было удобно и писать, и перечитывать заметки.",
    time: "сейчас",
  },
  {
    title: "Утренние мысли",
    excerpt: "Собирать короткие записи без лишней структуры, а потом уже раскладывать по темам.",
    time: "вчера",
  },
  {
    title: "Что почитать",
    excerpt: "Список материалов и конспекты, к которым хочется вернуться позже.",
    time: "3 дня назад",
  },
];

export default async function AppPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth");
  }

  const displayName = session.user.name?.trim() || session.user.email;

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f9fcf8_0%,#eef5ef_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-[32px] border border-emerald-100 bg-white/90 p-5 shadow-[0_20px_60px_rgba(88,141,108,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Nook notes
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-balance text-emerald-950 sm:text-4xl">
                  {displayName}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-emerald-900/68 sm:text-base">
                  Слева список заметок. В центре чтение. Ниже новый текст. Этого достаточно для первой версии Nook.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                asChild
                className="rounded-2xl bg-emerald-500 px-5 text-white hover:bg-emerald-600"
              >
                <Link href="/app">
                  <Plus className="size-4" />
                  Новая заметка
                </Link>
              </Button>
              <SignOutButton />
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <Card className="rounded-[28px] border-emerald-100 bg-white/90 shadow-[0_18px_50px_rgba(88,141,108,0.08)]">
              <CardHeader className="gap-3">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-950">
                  <List className="size-5 text-emerald-600" />
                  Заметки
                </CardTitle>
                <CardDescription className="text-emerald-900/65">
                  Быстрый список того, что уже можно открыть и перечитать.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {notes.map((note, index) => (
                  <article
                    key={note.title}
                    className={`rounded-[22px] border px-4 py-4 ${
                      index === 0
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-emerald-100 bg-emerald-50/55 text-emerald-950"
                    }`}
                  >
                    <div>
                      <h2 className="text-sm font-semibold">{note.title}</h2>
                      <p
                        className={`mt-2 text-sm leading-6 ${
                          index === 0 ? "text-white/85" : "text-emerald-900/68"
                        }`}
                      >
                        {note.excerpt}
                      </p>
                    </div>
                    <div
                      className={`mt-3 flex items-center gap-2 text-xs ${
                        index === 0 ? "text-white/75" : "text-emerald-700/70"
                      }`}
                    >
                      <Clock3 className="size-3.5" />
                      {note.time}
                    </div>
                  </article>
                ))}
              </CardContent>
            </Card>
          </aside>

          <section className="grid gap-6">
            <Card className="rounded-[32px] border-emerald-100 bg-white/92 shadow-[0_24px_70px_rgba(88,141,108,0.1)]">
              <CardHeader className="gap-3 border-b border-emerald-100 pb-6">
                <CardTitle className="text-2xl text-emerald-950 sm:text-3xl">
                  Открытая заметка
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7 text-emerald-900/68">
                  Основной режим Nook. Спокойный экран для чтения и возвращения к своим записям.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="rounded-[26px] border border-emerald-100 bg-[#f8fbf8] p-5">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <BookOpenText className="size-4" />
                    Идеи для Nook
                  </div>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-emerald-900/75">
                    <p>
                      Nook должен быть местом, куда легко скинуть мысль без сопротивления, а потом так же легко вернуться и перечитать ее в чистом виде.
                    </p>
                    <p>
                      Для этого интерфейс лучше делать спокойным: список заметок слева, читаемая страница по центру и простой редактор без лишней мишуры.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border-emerald-100 bg-white/92 shadow-[0_24px_70px_rgba(88,141,108,0.1)]">
              <CardHeader className="gap-3 border-b border-emerald-100 pb-6">
                <CardTitle className="text-2xl text-emerald-950 sm:text-3xl">
                  Новая заметка
                </CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7 text-emerald-900/68">
                  Быстрый редактор для новой записи. Следующим шагом подключим сохранение в базу.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ThoughtEditor />
              </CardContent>
            </Card>
          </section>
        </section>
      </main>
    </div>
  );
}

