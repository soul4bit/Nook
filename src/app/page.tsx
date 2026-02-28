import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpenText,
  GitBranchPlus,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/session";

const pillars = [
  {
    icon: Layers3,
    title: "Страницы, а не список",
    text: "Nook строится как personal wiki: каждая заметка живет как отдельная страница с собственным контекстом.",
  },
  {
    icon: GitBranchPlus,
    title: "Связи между идеями",
    text: "Карточки мысли соединяются между собой, чтобы из заметок собиралась карта твоего мышления.",
  },
  {
    icon: ShieldCheck,
    title: "Своя инфраструктура",
    text: "База, авторизация и почта остаются под твоим контролем на собственном сервере.",
  },
];

export default async function Home() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#def5e5,transparent_26%),radial-gradient(circle_at_80%_20%,#f6fff8,transparent_30%),radial-gradient(circle_at_bottom_right,#cae9d5,transparent_24%),linear-gradient(180deg,#f8fdf9_0%,#eef7f1_100%)] px-4 py-6 text-emerald-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white/72 px-5 py-4 shadow-[0_18px_55px_rgba(88,141,108,0.1)] backdrop-blur sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Nook
            </p>
            <p className="mt-1 text-sm text-emerald-900/60">
              personal wiki for thought cards
            </p>
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

        <main className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:items-center">
          <section className="space-y-8">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white/76 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm">
                second brain, not a note dump
              </span>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  Личный second brain с ощущением живой вики, а не скучного списка заметок.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-emerald-900/68 sm:text-lg">
                  Nook собирает заметки как связанные страницы, черновики и карточки мыслей. Главная теперь не техническая, а нормальная входная точка: показывает идею продукта и сразу ведет ко входу или регистрации.
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

            <div className="grid gap-4 md:grid-cols-3">
              {pillars.map((item) => (
                <Card
                  key={item.title}
                  className="rounded-[28px] border-white/70 bg-white/76 shadow-[0_20px_60px_rgba(88,141,108,0.11)] backdrop-blur"
                >
                  <CardHeader className="gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <item.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg text-emerald-950">{item.title}</CardTitle>
                    <CardDescription className="leading-6 text-emerald-900/66">
                      {item.text}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="absolute inset-0 -z-10 rounded-[36px] bg-[radial-gradient(circle_at_top,#d6f1de,transparent_45%)] blur-2xl" />
            <div className="rounded-[34px] border border-white/75 bg-white/82 p-5 shadow-[0_30px_90px_rgba(88,141,108,0.14)] backdrop-blur sm:p-6">
              <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#f9fffb_0%,#f1f9f3_100%)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      Preview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-emerald-950">
                      Workspace canvas
                    </h2>
                  </div>
                  <div className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-medium text-emerald-700">
                    early build
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-[24px] border border-emerald-100 bg-white/90 p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-emerald-950">Главная мысль</p>
                        <p className="mt-1 text-sm leading-6 text-emerald-900/64">
                          Заметка становится страницей, а страница может вести к следующим идеям и главам.
                        </p>
                      </div>
                      <Sparkles className="size-5 text-emerald-600" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-[24px] border border-emerald-100 bg-white/90 p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Spaces
                      </p>
                      <div className="mt-3 space-y-2 text-sm text-emerald-900/76">
                        <div className="rounded-2xl bg-emerald-50 px-3 py-2">Inbox</div>
                        <div className="rounded-2xl bg-emerald-50 px-3 py-2">Research</div>
                        <div className="rounded-2xl bg-emerald-50 px-3 py-2">Garden</div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-emerald-100 bg-emerald-950 p-4 text-emerald-50 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <BookOpenText className="size-4" />
                        Draft page
                      </div>
                      <div className="mt-3 space-y-3 text-sm leading-6 text-emerald-50/78">
                        <p>
                          &quot;Nook должен ощущаться как спокойная личная wiki-среда, а не как админка с заметками.&quot;
                        </p>
                        <p>
                          Следующий шаг: дерево страниц, сохранение Tiptap и backlinks между карточками.
                        </p>
                      </div>
                    </div>
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
