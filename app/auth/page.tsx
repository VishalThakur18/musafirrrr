import Link from "next/link";

export default function AuthEntryPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div>
        <h1 className="text-4xl font-extrabold text-[#12181c]">Welcome to Musafirrrr</h1>
        <p className="mt-3 text-gray-500">Two ways in. Pick the one that sounds like you.</p>
      </div>

      <div className="flex flex-col gap-4">
        <AccountTypeCard
          href="/auth/signup/traveller"
          icon={<CompassIcon />}
          title="I'm a traveller"
          description="Find group trips, save the ones you like and enquire directly."
        />
        <AccountTypeCard
          href="/auth/signup/organizer"
          icon={<PeopleIcon />}
          title="I'm a travel community"
          description="List your upcoming trips and receive enquiries."
        />
      </div>

      <p className="text-gray-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-[#12181c] underline">
          Log in
        </Link>
      </p>
    </main>
  );
}

function AccountTypeCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-2xl border border-gray-200 p-6 transition-colors hover:border-gray-300 hover:bg-gray-50"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F3E4D3] text-[#12181c]">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-lg font-bold text-[#12181c]">{title}</span>
        <span className="mt-1 block text-sm text-gray-500">{description}</span>
      </span>
      <ChevronIcon />
    </Link>
  );
}

function CompassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 9l-2 5-5 2 2-5 5-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 8a3 3 0 110 6M17 14.5c2.3.4 4 2.2 4 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-2 shrink-0 text-gray-300" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
