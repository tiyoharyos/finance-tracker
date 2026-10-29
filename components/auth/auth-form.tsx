"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register, type AuthState } from "@/app/(auth)/actions";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [state, action, pending] = useActionState<AuthState, FormData>(
    isLogin ? login : register,
    undefined
  );

  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">
        {isLogin ? "Masuk" : "Buat akun"}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        {isLogin
          ? "Lanjutkan mencatat keuanganmu."
          : "Mulai catat pemasukan dan pengeluaran."}
      </p>

      <form action={action} className="mt-6 space-y-4">
        {!isLogin && (
          <Field label="Nama" name="name" type="text" autoComplete="name" />
        )}
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
        />

        {state?.error && (
          <p role="alert" className="text-sm text-rose-600">
            {state.error}
          </p>
        )}
        {state?.info && (
          <p role="status" className="text-sm text-emerald-700">
            {state.info}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Memproses…" : isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-neutral-500">
        {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-medium text-emerald-700 hover:underline"
        >
          {isLogin ? "Daftar" : "Masuk"}
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<"input">) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        {...props}
        required
        className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
      />
    </label>
  );
}
