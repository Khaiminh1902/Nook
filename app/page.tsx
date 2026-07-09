import Link from "next/link";

export default function Page() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f4ecd8] text-[#4A3323]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#fff4dd_0%,#f4ecd8_40%,#d6c09b_100%)]" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#d6b47e]/30 blur-3xl" />
      <div className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-[#8A6A4A]/18 blur-3xl" />
      <div className="absolute -bottom-20 left-1/2 h-64 w-152 -translate-x-1/2 rounded-full bg-[#5C4331]/18 blur-3xl" />

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.38em] text-[#8A6A4A]">
            Tiny World, Huge Energy
          </p>
          <h1 className="text-5xl font-black uppercase leading-none tracking-[-0.04em] text-[#5C4331] sm:text-7xl md:text-8xl">
            Build First.
            <br />
            Think Later.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-[#6b503a] sm:text-base">
            Make your little world bigger, weirder, and slightly out of control.
            Honestly, that&apos;s the plan.
          </p>
        </div>

        <Link
          href="/game"
          className="mt-12 inline-flex min-w-56 items-center justify-center rounded-full border-4 border-[#8A6A4A] bg-[#F2DFC2] px-12 py-5 text-2xl font-black uppercase tracking-[0.18em] text-[#4A3323] shadow-[0_18px_40px_rgba(74,51,35,0.22)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#E8D0AB] active:translate-y-0 active:bg-[#D6B47E]"
        >
          Enter
        </Link>
      </div>
    </main>
  );
}
