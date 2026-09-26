"use client";

import { useState } from "react";
import Link from "next/link";
import { signupTraveller } from "@/app/actions/auth";

export default function TravellerSignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Those passwords don't match.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.set("fullName", fullName);
    formData.set("email", email);
    formData.set("phone", phone);
    formData.set("password", password);
    // confirmPassword is deliberately never added here — it only exists
    // to catch typos client-side and has nothing to do with the server.

    const result = await signupTraveller(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-[#12181c]">Check your email</h1>
        <p className="text-gray-500">
          We sent a confirmation link to <span className="font-semibold">{email}</span>. Click
          it to activate your account.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div>
        <h1 className="text-3xl font-extrabold leading-tight text-[#12181c]">
          Create your traveller account
        </h1>
        <p className="mt-2 text-gray-500">Saved trips and enquiries, all in one place.</p>
      </div>

      <Link href="/auth" className="-mt-2 text-sm text-gray-500">
        &larr; Change account type
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Aarav Mehta" required />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" required />
        <Field label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="98765 43210" />

        <div>
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
          />
          <p className="mt-1 text-xs text-gray-400">At least 6 characters.</p>
        </div>

        <Field
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          minLength={6}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#12181c] px-4 py-4 font-bold text-white disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-xs text-gray-400">
          Any trips you saved on this device move into your account.
        </p>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-[#12181c] underline">
          Log in
        </Link>
      </p>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-[#12181c]">{label}</label>
      <input
        type={type}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#12181c] focus:outline-none"
      />
    </div>
  );
}