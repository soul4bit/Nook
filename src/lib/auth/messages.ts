export type AuthFeedback = {
  tone: "error" | "success" | "info";
  text: string;
};

type SearchParamsLike = Pick<URLSearchParams, "get">;

export function extractAuthErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const candidate = error as {
    message?: unknown;
    error?: { message?: unknown };
  };

  if (typeof candidate.message === "string") {
    return candidate.message;
  }

  if (typeof candidate.error?.message === "string") {
    return candidate.error.message;
  }

  return undefined;
}

export function getAuthErrorMessage(message?: string) {
  switch (message) {
    case "Invalid email or password":
      return "Неверный email или пароль.";
    case "User already exists. Use another email.":
      return "Такой email уже зарегистрирован.";
    case "Password is too short":
    case "Password too short":
      return "Пароль должен быть не короче 8 символов.";
    case "Password too long":
      return "Пароль слишком длинный. Используйте более короткий пароль.";
    case "Invalid email":
      return "Введите корректный email.";
    case "Email not verified":
      return "Email еще не подтвержден. Отправьте письмо повторно или проверьте входящие.";
    case "Reset password isn't enabled":
      return "Сброс пароля пока не настроен на сервере.";
    case "Verification email isn't enabled":
      return "Письма подтверждения пока не настроены на сервере.";
    case "Invalid token":
      return "Ссылка устарела или уже недействительна.";
    default:
      return "Не удалось выполнить запрос авторизации.";
  }
}

export function getQueryAuthFeedback(
  searchParams: SearchParamsLike
): AuthFeedback | null {
  const reset = searchParams.get("reset");
  const error = searchParams.get("error");

  if (reset === "success") {
    return {
      tone: "success",
      text: "Пароль обновлен. Теперь можно войти с новым паролем.",
    };
  }

  switch (error) {
    case "token_expired":
      return {
        tone: "error",
        text: "Ссылка истекла. Запросите новое письмо.",
      };
    case "invalid_token":
    case "INVALID_TOKEN":
      return {
        tone: "error",
        text: "Ссылка недействительна. Запросите новое письмо.",
      };
    case "user_not_found":
      return {
        tone: "error",
        text: "Пользователь для этой ссылки не найден.",
      };
    default:
      return null;
  }
}
