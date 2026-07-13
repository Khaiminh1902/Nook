import Link from "next/link";
import { FaArrowRight, FaHouseChimney, FaLayerGroup } from "react-icons/fa6";

const controls = [
  "Hold left mouse and drag to move through the map",
  "Click a tile to open the build bar and place structures",
  "Hold right mouse and drag to select a larger area at once",
];

const highlights = [
  {
    title: "Shape The Map",
    description:
      "Place buildings, roads, and terrain pieces one tile at a time",
    icon: FaHouseChimney,
  },
  {
    title: "Build In Layers",
    description:
      "Compose small scenes or stretch out into a full neighborhood layout",
    icon: FaLayerGroup,
  },
];

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-(--nook-ink) text-(--nook-cream)">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,231,184,0.18),transparent_34%),linear-gradient(135deg,rgba(24,18,16,0.55),rgba(24,18,16,0.82))]" />
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          backgroundImage: "url('/assets/bg.png')",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(24,18,16,0.3)_35%,rgba(24,18,16,0.88))]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between">
          <div className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100/90 backdrop-blur-sm">
            Isometric World Builder
          </div>
        </div>

        <div className="grid items-end gap-12 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-amber-200/75">
              Block By Block
            </p>
            <h1 className="max-w-4xl text-6xl font-black uppercase leading-none tracking-widest text-(--nook-gold) drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:text-7xl lg:text-8xl">
              Nook
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-100/82 sm:text-lg">
              An isometric building game where every tile becomes part of a
              larger scene. Lay terrains, place homes, and create your own quiet
              little world
            </p>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/game"
                className="inline-flex items-center gap-1 rounded-full bg-(--nook-gold) px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-(--nook-ink) transition hover:-translate-y-px hover:bg-[#f0cb82]"
              >
                Enter World
                <FaArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-[28px] border border-white/12 bg-white/10 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-(--nook-gold)/90 text-(--nook-ink)">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-200/80">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 border-t border-white/10 pt-8 pb-2 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200/80">
              Controls
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-200/72">
              The page is simple: move around, select tiles, and build
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {controls.map((control) => (
              <div
                key={control}
                className="rounded-3xl border border-white/10 bg-[rgba(255,248,232,0.08)] p-3 flex items-center justify-center"
              >
                <p className=" text-sm leading-6 text-stone-100/84">
                  {control}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
