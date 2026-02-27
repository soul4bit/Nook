import { BookOpenText, RadioTower, Sparkles } from "lucide-react";
import { ThoughtEditor } from "@/components/editor/thought-editor";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const thoughtCards = [
  {
    title: "Наблюдение",
    text: "Идеи становятся объёмнее, когда им дать форму вопроса, а не утверждения.",
    tag: "мышление",
  },
  {
    title: "Эксперимент",
    text: "Проверить 7-дневный цикл обзора заметок: что остаётся ценным через неделю?",
    tag: "практика",
  },
  {
    title: "Связь",
    text: "Личные заметки о продуктивности связать с проектами и контекстом дня.",
    tag: "система",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,#ffe0bf,transparent_38%),radial-gradient(circle_at_20%_20%,#b8e6de,transparent_34%),#f6efe7] text-stone-900">
      <div className="pointer-events-none absolute -left-16 top-10 size-64 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-72 rounded-full bg-teal-200/40 blur-3xl" />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-12">
        <header className="rounded-3xl border border-stone-900/10 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="mb-4 flex items-center gap-2 text-sm text-stone-600">
            <BookOpenText className="size-4" />
            <span>Nook / personal second brain</span>
          </div>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Карточки мысли вместо скучного списка заметок
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-stone-600 sm:text-base">
            Локально сначала. Потом синхронизация через Supabase. Здесь первая
            версия интерфейса и редактора.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {thoughtCards.map((card) => (
            <Card
              key={card.title}
              className="border-stone-900/10 bg-white/75 backdrop-blur"
            >
              <CardHeader>
                <div className="mb-2">
                  <Badge
                    variant="outline"
                    className="border-stone-700/30 bg-stone-100/70 text-stone-700"
                  >
                    {card.tag}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <CardDescription className="text-stone-600">
                  {card.text}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5" />
                  <span>Следующий шаг: уточнить формулировку</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="rounded-3xl border border-stone-900/10 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-stone-700">
            <RadioTower className="size-4" />
            <h2 className="text-base font-medium sm:text-lg">
              Черновик заметки
            </h2>
          </div>
          <ThoughtEditor />
        </section>
      </main>
    </div>
  );
}
