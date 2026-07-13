import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaComputerMouse,
  FaHammer,
  FaLayerGroup,
} from "react-icons/fa6";

const guideSections = [
  {
    title: "How to Move",
    description:
      "Hold the left mouse button and drag to pan across the world. Use the mouse wheel to zoom in for detail or out for a wider layout view",
    eyebrow: "Navigation",
    icon: FaComputerMouse,
    video: "/videos/movement.mp4",
  },
  {
    title: "How to Build",
    description:
      "Click any tile to open the build bar, then choose the terrain, structure, or detail you want to place into the world",
    eyebrow: "Placement",
    icon: FaHammer,
    video: "/videos/building.mp4",
  },
  {
    title: "Mass Selection",
    description:
      "Hold the right mouse button and drag to select multiple tiles at once when you want to edit larger areas quickly",
    eyebrow: "Editing",
    icon: FaLayerGroup,
    video: "/videos/selection.mp4",
  },
];

export default function DocsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-(--nook-ink) text-(--nook-cream)">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,231,184,0.14),transparent_28%),linear-gradient(180deg,rgba(37,28,23,0.94),rgba(20,15,12,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(232,193,122,0.05),transparent_36%,rgba(255,255,255,0.04)_100%)]" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-start justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-amber-50 transition hover:-translate-y-px hover:bg-white/12"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <Link
              href="/game"
              className="inline-flex items-center gap-2 rounded-full bg-(--nook-gold) px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-(--nook-ink) transition hover:-translate-y-px hover:bg-[#f0cb82]"
            >
              Enter World
              <FaArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/70">
              Player Guide
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-widest text-(--nook-gold) sm:text-5xl lg:text-6xl">
              How to Play
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-stone-100/80 sm:text-lg">
              These quick tutorials cover the core controls so you can move
              faster from exploring to building. Each section pairs a short
              explanation with a demo
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8">
          {guideSections.map((section, index) => {
            const Icon = section.icon;
            const reversed = index % 2 === 1;

            return (
              <article
                key={section.title}
                className="grid items-center gap-6 rounded-4xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm lg:grid-cols-2 lg:p-6"
              >
                <div className={reversed ? "lg:order-2" : undefined}>
                  <div className="inline-flex items-center gap-3 rounded-full border border-amber-200/15 bg-amber-100/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100/80">
                    <Icon className="h-4 w-4" />
                    {section.eyebrow}
                  </div>
                  <h2 className="mt-5 text-3xl font-black uppercase tracking-[0.12em] text-white sm:text-4xl">
                    {section.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-stone-100/78 sm:text-lg">
                    {section.description}
                  </p>
                </div>

                <div
                  className={`overflow-hidden rounded-3xl border border-white/10 bg-[#120d0a] ${
                    reversed ? "lg:order-1" : ""
                  }`}
                >
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="aspect-video h-full w-full object-cover"
                  >
                    <source src={section.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
