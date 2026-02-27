import { redirect } from "next/navigation";
import { signInAction, signUpAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuthPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

const FEEDBACK: Record<string, string> = {
  missing_credentials: "Введите email и пароль.",
  invalid_credentials: "Неверный email или пароль.",
  weak_password: "Пароль должен быть не короче 6 символов.",
  signup_failed: "Не удалось создать аккаунт.",
  check_email: "Аккаунт создан. Проверьте почту для подтверждения входа.",
  invalid_code: "Ссылка подтверждения недействительна.",
  callback_failed: "Не удалось завершить подтверждение email.",
};

function resolveFeedback(params: { message?: string; error?: string }) {
  if (params.error) {
    return {
      tone: "error" as const,
      text: FEEDBACK[params.error] ?? "Произошла ошибка авторизации.",
    };
  }

  if (params.message) {
    return {
      tone: "message" as const,
      text: FEEDBACK[params.message] ?? "Действие выполнено.",
    };
  }

  return null;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app");
  }

  const params = await searchParams;
  const feedback = resolveFeedback(params);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,#c4eadf,transparent_35%),radial-gradient(circle_at_90%_0%,#ffd9b1,transparent_30%),#f4eee7] px-4 py-8 text-stone-900 sm:px-8 sm:py-12">
      <main className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-stone-900/10 bg-white/65 p-6 backdrop-blur sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            Nook
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Вход в личный second brain
          </h1>
          <p className="mt-4 max-w-md text-sm text-stone-600 sm:text-base">
            Начнем с аккаунта. После входа ты попадешь в закрытое рабочее
            пространство заметок.
          </p>
          {feedback ? (
            <div
              className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                feedback.tone === "error"
                  ? "border-rose-300 bg-rose-50 text-rose-800"
                  : "border-emerald-300 bg-emerald-50 text-emerald-800"
              }`}
            >
              {feedback.text}
            </div>
          ) : null}
        </section>

        <div className="grid gap-4">
          <Card className="border-stone-900/10 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Войти</CardTitle>
              <CardDescription>
                Для существующего аккаунта Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={signInAction} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="signin-email" className="text-sm text-stone-700">
                    Email
                  </label>
                  <Input id="signin-email" name="email" type="email" required />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="signin-password"
                    className="text-sm text-stone-700"
                  >
                    Пароль
                  </label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Войти
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-stone-900/10 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Регистрация</CardTitle>
              <CardDescription>
                Создает новый аккаунт с email и паролем.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={signUpAction} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="signup-email" className="text-sm text-stone-700">
                    Email
                  </label>
                  <Input id="signup-email" name="email" type="email" required />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="signup-password"
                    className="text-sm text-stone-700"
                  >
                    Пароль
                  </label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" variant="secondary" className="w-full">
                  Зарегистрироваться
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
