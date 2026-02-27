"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  extractAuthErrorMessage,
  getAuthErrorMessage,
  type AuthFeedback,
} from "@/lib/auth/messages";

async function postAuth(path: string, payload: Record<string, unknown>) {
  const response = await fetch(`/api/auth${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(extractAuthErrorMessage(result) ?? `HTTP_${response.status}`);
  }

  return result;
}

function FeedbackBanner({ feedback }: { feedback: AuthFeedback }) {
  const toneClass =
    feedback.tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : feedback.tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>
      {feedback.text}
    </div>
  );
}

type ResetPasswordFormProps = {
  token: string | null;
  error: string | null;
};

export function ResetPasswordForm({ token, error }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<AuthFeedback | null>(null);
  const [isPending, setIsPending] = useState(false);

  const invalidLink = !token || error === "INVALID_TOKEN";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setFeedback({
        tone: "error",
        text: "Ссылка для сброса недействительна.",
      });
      return;
    }

    if (!password || !confirmPassword) {
      setFeedback({
        tone: "error",
        text: "Введите новый пароль и повторите его.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({
        tone: "error",
        text: "Пароли не совпадают.",
      });
      return;
    }

    if (password.length < 8) {
      setFeedback({
        tone: "error",
        text: "Пароль должен быть не короче 8 символов.",
      });
      return;
    }

    setIsPending(true);
    setFeedback(null);

    try {
      await postAuth("/reset-password", {
        token,
        newPassword: password,
      });

      router.replace("/auth?mode=sign-in&reset=success");
      router.refresh();
    } catch (submitError) {
      setFeedback({
        tone: "error",
        text: getAuthErrorMessage(extractAuthErrorMessage(submitError)),
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-[28px] border-white/70 bg-white/85 shadow-[0_30px_80px_rgba(88,141,108,0.15)] backdrop-blur">
      <CardHeader className="gap-3 border-b border-emerald-100/80 pb-6">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <KeyRound className="size-5" />
        </div>
        <CardTitle className="text-2xl text-emerald-950">
          Новый пароль
        </CardTitle>
        <CardDescription className="max-w-md text-sm leading-6 text-emerald-900/70">
          Ссылка из письма ведет сюда. Задайте новый пароль и затем вернитесь ко входу.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {feedback ? <FeedbackBanner feedback={feedback} /> : null}

        {invalidLink ? (
          <div className="space-y-4">
            <FeedbackBanner
              feedback={{
                tone: "error",
                text: "Ссылка уже недействительна. Запросите новое письмо для сброса пароля.",
              }}
            />
            <Button asChild variant="outline" className="w-full rounded-2xl border-emerald-200">
              <Link href="/auth?mode=reset">Вернуться к форме сброса</Link>
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="reset-password" className="text-sm font-medium text-emerald-950">
                Новый пароль
              </label>
              <Input
                id="reset-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Минимум 8 символов"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reset-password-confirm"
                className="text-sm font-medium text-emerald-950"
              >
                Повторите пароль
              </label>
              <Input
                id="reset-password-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Повторите пароль"
                required
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-2xl"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Сохраняем пароль...
                </>
              ) : (
                "Сохранить новый пароль"
              )}
            </Button>

            <Button
              asChild
              type="button"
              variant="ghost"
              className="w-full rounded-2xl text-emerald-900/70"
            >
              <Link href="/auth">
                <ArrowLeft className="size-4" />
                Назад ко входу
              </Link>
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
