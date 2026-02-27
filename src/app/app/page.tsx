import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpenText, Layers3, Plus, Sparkles, Zap } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThoughtEditor } from "@/components/editor/thought-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/session";

const cards = [
  {
    title: "Главы",
    text: "Собирай страницы как куски личной вики: темы, исследования, проекты и дневниковые карты.",
    tag: "структура",
  },
  {
    title: "Связи",
    text: "Связывай идеи между собой, чтобы мысль не терялась между отдельными карточками и черновиками.",
    tag: "граф",
  },
  {
    title: "Ревизии",
    text: "Храни изменения без ощущения перегруженной CMS. Быстрый драфт всегда рядом, но структура не разваливается.",
    tag: "контроль",
  },
];

export default async function AppPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth");
  }

  const role = (session.user as { role?: string }).role ?? "user";
  const displayName = session.user.name?.trim() || session.user.email;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dff6e6,transparent_28%),radial-gradient(circle_at_bottom_right,#cdeed8,transparent_24%),linear-gradient(180deg,#f8fdf9_0%,#eef7f1_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-[32px] border border-white/70 bg-white/78 p-5 shadow-[0_24px_70px_rgba(88,141,108,0.12)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  Nook workspace
                </span>
                <Badge className="rounded-full bg-emerald-500/12 px-3 py-1 text-emerald-700">
                  {role}
                </Badge>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-balance text-emerald-950 sm:text-4xl">
                  {displayName}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-emerald-900/68 sm:text-base">
                  Пространство уже выглядит как личная вики, а не как черновой список. Следующий шаг: дерево страниц, сохранение заметок и история изменений.
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
                  Новая страница
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-emerald-200 bg-white/80 text-emerald-900 hover:bg-emerald-50"
              >
                <Link href="/auth">
                  Аккаунт
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <SignOutButton />
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
          <aside className="space-y-4">
            <Card className="rounded-[28px] border-white/70 bg-white/82 shadow-[0_20px_60px_rgba(88,141,108,0.1)] backdrop-blur">
              <CardHeader className="gap-3">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-950">
                  <Layers3 className="size-5 text-emerald-600" />
                  Пространства
                </CardTitle>
                <CardDescription className="text-emerald-900/65">
                  Основа для sidebar и дерева страниц.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-emerald-900/80">
                {["Inbox", "Research", "Garden", "Archive"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/70 bg-white/82 shadow-[0_20px_60px_rgba(88,141,108,0.1)] backdrop-blur">
              <CardHeader className="gap-3">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-950">
                  <Zap className="size-5 text-emerald-600" />
                  Быстрый фокус
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-emerald-900/72">
                <p>Сегодня стоит доделать структуру страницы, сохранить редактор в базу и добавить дерево заметок.</p>
                <p className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                  Сейчас это хороший фундамент для перехода к полноценной wiki-структуре.
                </p>
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-6">
            <Card className="rounded-[32px] border-white/70 bg-white/86 shadow-[0_28px_80px_rgba(88,141,108,0.12)] backdrop-blur">
              <CardHeader className="gap-4 border-b border-emerald-100/80 pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full bg-emerald-500/12 px-3 py-1 text-emerald-700">
                    Draft
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-emerald-200 text-emerald-700">
                    personal wiki
                  </Badge>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-emerald-950 sm:text-3xl">
                    Черновик главной страницы
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-base leading-7 text-emerald-900/68">
                    Здесь уже чувствуется формат personal wiki: короткий контекст сверху, рабочее полотно ниже, а справа вспомогательные блоки.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ThoughtEditor />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              {cards.map((item) => (
                <Card
                  key={item.title}
                  className="rounded-[28px] border-white/70 bg-white/82 shadow-[0_20px_60px_rgba(88,141,108,0.1)] backdrop-blur"
                >
                  <CardHeader className="gap-3">
                    <Badge
                      variant="outline"
                      className="w-fit rounded-full border-emerald-200 text-emerald-700"
                    >
                      {item.tag}
                    </Badge>
                    <CardTitle className="text-xl text-emerald-950">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="leading-6 text-emerald-900/68">
                      {item.text}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs uppercase tracking-[0.18em] text-emerald-700/65">
                    v1 · knowledge garden
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <Card className="rounded-[28px] border-white/70 bg-white/82 shadow-[0_20px_60px_rgba(88,141,108,0.1)] backdrop-blur">
              <CardHeader className="gap-3">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-950">
                  <BookOpenText className="size-5 text-emerald-600" />
                  Что дальше
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-emerald-900/72">
                <p>Поднять таблицы `spaces`, `pages`, `page_blocks` и связать редактор с PostgreSQL.</p>
                <p>Отрисовать sidebar tree и маршрут страницы по slug.</p>
                <p>Добавить файлы и превью карточек через локальное хранилище.</p>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/70 bg-emerald-950 text-emerald-50 shadow-[0_24px_70px_rgba(30,76,53,0.24)]">
              <CardHeader className="gap-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="size-5" />
                  Личный режим
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-emerald-50/80">
                <p>До пяти человек можно обслужить спокойно: PostgreSQL, Better Auth и локальный SMTP-поток покрывают базовые сценарии без лишней инфраструктуры.</p>
                <p className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3">
                  Следующий этап уже про структуру контента, а не про авторизацию.
                </p>
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>
    </div>
  );
}
