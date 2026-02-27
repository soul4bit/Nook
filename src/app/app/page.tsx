import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThoughtEditor } from "@/components/editor/thought-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth/session";

const cards = [
  {
    title: "Главы",
    text: "Собирай идеи в страницы, как в вики, но с личным контекстом.",
    tag: "структура",
  },
  {
    title: "Связи",
    text: "Связывай заметки между собой, чтобы видеть карту мышления.",
    tag: "граф",
  },
  {
    title: "Ревизии",
    text: "Держи историю изменений и возвращайся к прошлым версиям.",
    tag: "контроль",
  },
];

export default async function AppPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#ffd8b4,transparent_35%),radial-gradient(circle_at_0%_90%,#bdebe0,transparent_35%),#f4ede5] px-4 py-8 sm:px-8 sm:py-12">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-stone-900/10 bg-white/70 p-5 backdrop-blur sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Nook workspace
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Привет, {session.user.email}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/auth">Аккаунт</Link>
            </Button>
            <SignOutButton />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {cards.map((item) => (
            <Card
              key={item.title}
              className="border-stone-900/10 bg-white/80 backdrop-blur"
            >
              <CardHeader>
                <Badge variant="outline" className="w-fit border-stone-300">
                  {item.tag}
                </Badge>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-stone-600">
                  {item.text}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-stone-500">
                v1.0 личного knowledge space
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="rounded-3xl border border-stone-900/10 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6">
          <h2 className="mb-4 text-lg font-medium text-stone-800">
            Черновик страницы
          </h2>
          <ThoughtEditor />
        </section>
      </main>
    </div>
  );
}