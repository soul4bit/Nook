import { redirect } from "next/navigation";
import { AuthForms } from "@/components/auth/auth-forms";
import { getCurrentSession } from "@/lib/auth/session";

export default async function AuthPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/app");
  }

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
        </section>

        <AuthForms initialFeedback={null} />
      </main>
    </div>
  );
}