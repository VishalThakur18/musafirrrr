"use client";

import { useState } from "react";
import Link from "next/link";
import { signupOrganizer } from "@/app/actions/auth";

export default function OrganizerSignupPage() {
  const [communityName, setCommunityName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [basedIn, setBasedIn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
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
    formData.set("communityName", communityName);
    formData.set("contactPerson", contactPerson);
    formData.set("basedIn", basedIn);
    formData.set("email", email);
    formData.set("phone", phone);
    formData.set("whatsapp", whatsapp);
    formData.set("instagram", instagram);
    formData.set("bio", bio);
    formData.set("password", password);

    const result = await signupOrganizer(formData);
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
          it to activate your community profile.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <Link href="/auth" className="text-sm text-gray-500">
        &larr; Change account type
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          label="Community or agency name"
          value={communityName}
          onChange={setCommunityName}
          placeholder="Wanderlust Co."
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact person" value={contactPerson} onChange={setContactPerson} placeholder="Your name" />
          <Field label="Based in" value={basedIn} onChange={setBasedIn} placeholder="New Delhi" />
        </div>

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="hello@community.com"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="98765 43210" />
          <div>
            <Field
              label="WhatsApp number"
              type="tel"
              value={whatsapp}
              onChange={setWhatsapp}
              placeholder="919876543210"
              required
            />
            <p className="mt-1 text-xs text-gray-400">With country code.</p>
          </div>
        </div>

        <div>
          <Field
            label="Instagram username"
            value={instagram}
            onChange={setInstagram}
            placeholder="wanderlust.co"
          />
          <p className="mt-1 text-xs text-gray-400">Optional &mdash; shown on your trips.</p>
        </div>

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

        <div>
          <label className="mb-1 block text-sm font-semibold text-[#12181c]">Short bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="We run small-group trips across the Himalayas..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#12181c] focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#12181c] px-4 py-4 font-bold text-white disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
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