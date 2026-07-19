import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-(--nook-ink) text-(--nook-cream)">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,231,184,0.16),transparent_32%),linear-gradient(135deg,rgba(24,18,16,0.52),rgba(24,18,16,0.84))]" />
      <div
        className="absolute inset-0 opacity-22 mix-blend-screen"
        style={{
          backgroundImage: "url('/assets/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(24,18,16,0.3)_35%,rgba(24,18,16,0.88))]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(92,67,49,0.26)_55%,rgba(242,223,194,0.06))]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="border-2 border-[#8A6A4A] bg-[#5C4331]/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#F2DFC2] shadow-[0_18px_40px_rgba(27,18,12,0.32)] backdrop-blur-md">
            Isometric World Builder
          </div>
        </div>

        <div className="grid items-end gap-12 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-20 mb-55">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-amber-200/75">
              Block By Block
            </p>
            <h1 className="max-w-4xl text-6xl font-black uppercase leading-none tracking-widest text-(--nook-gold) drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:text-7xl lg:text-8xl">
              Nook
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-100/82 sm:text-lg">
              An isometric building game where every tile becomes part of a
              larger scene. Lay terrains, place homes, and create your own
              little world
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/game"
                className="inline-flex items-center gap-2 border-2 border-[#8A6A4A] bg-[#F2DFC2] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#4A3323] shadow-[0_18px_40px_rgba(27,18,12,0.32)] transition hover:-translate-y-px hover:bg-[#E8D0AB]"
              >
                Enter World
                <FaArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 border-2 border-[#8A6A4A] bg-[#6B503C] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#F2DFC2] shadow-[0_18px_40px_rgba(27,18,12,0.32)] transition hover:-translate-y-px hover:bg-[#7A5D46]"
              >
                How to play
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
