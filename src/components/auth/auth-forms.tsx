"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Feedback = {
  tone: "error" | "message";
  text: string;
};

type AuthFormsProps = {
  initialFeedback: Feedback | null;
};

function getAuthErrorMessage(message?: string) {
  switch (message) {
    case "Invalid email or password":
      return "Неверный email или пароль.";
    case "User already exists. Use another email.":
      return "Пользователь с таким email уже существует.";
    case "Password is too short":
      return "Пароль должен быть не короче 8 символов.";
    default:
      return "Не удалось выполнить запрос авторизации.";
  }
}

export function AuthForms({ initialFeedback }: AuthFormsProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(initialFeedback);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  async function handleSignIn(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setFeedback({
        tone: "error",
        text: "Введите email и пароль.",
      });
      return;
    }

    setIsSigningIn(true);
    setFeedback(null);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setFeedback({
          tone: "error",
          text: getAuthErrorMessage(error.message),
        });
        return;
      }

      router.replace("/app");
      router.refresh();
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleSignUp(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setFeedback({
        tone: "error",
        text: "Введите email и пароль.",
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

    setIsSigningUp(true);
    setFeedback(null);

    try {
      const name = email.split("@")[0] || "nook-user";
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setFeedback({
          tone: "error",
          text: getAuthErrorMessage(error.message),
        });
        return;
      }

      router.replace("/app");
      router.refresh();
    } finally {
      setIsSigningUp(false);
    }
  }

  return (
    <div className="grid gap-4">
      {feedback ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.tone === "error"
              ? "border-rose-300 bg-rose-50 text-rose-800"
              : "border-emerald-300 bg-emerald-50 text-emerald-800"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <Card className="border-stone-900/10 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Войти</CardTitle>
          <CardDescription>Для существующего аккаунта Nook.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSignIn(new FormData(event.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <label htmlFor="signin-email" className="text-sm text-stone-700">
                Email
              </label>
              <Input id="signin-email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="signin-password" className="text-sm text-stone-700">
                Пароль
              </label>
              <Input
                id="signin-password"
                name="password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSigningIn}>
              {isSigningIn ? "Входим..." : "Войти"}
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
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSignUp(new FormData(event.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-sm text-stone-700">
                Email
              </label>
              <Input id="signup-email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-sm text-stone-700">
                Пароль
              </label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                required
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? "Создаем аккаунт..." : "Зарегистрироваться"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}