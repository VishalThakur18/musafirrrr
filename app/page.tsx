import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-4xl font-bold text-[#12181c]">
        Musafirrrr
      </h1>

      <p className="text-center text-gray-600">
        Find group trips, save the ones you like and enquire directly.
      </p>

      <div className="flex gap-3">
        <Link
          href="/auth/login"
          className="rounded-full bg-[#12181c] px-6 py-3 font-bold text-white"
        >
          Log in
        </Link>

        <Link
          href="/auth"
          className="rounded-full border border-gray-300 px-6 py-3 font-bold"
        >
          Create an account
        </Link>
      </div>
    </main>
  );
}