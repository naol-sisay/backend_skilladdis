import { useNavigate } from "react-router-dom";
import { CapMark } from "./Logo";

const orbitPanels = [
  {
    badge: "Paths",
    title: "Guided tracks",
    detail: "Clear next steps from intro lessons to project work.",
    wrapperClass: "absolute left-1/2 top-5 -translate-x-[145%] sm:-translate-x-[195%]",
    cardClass: "welcome-orbit-card welcome-orbit-card--soft",
    delay: "0.15s",
  },
  {
    badge: "Practice",
    title: "Hands-on labs",
    detail: "Build with short exercises that stay active on the page.",
    wrapperClass: "absolute left-1/2 top-3 translate-x-[50%] sm:translate-x-[108%]",
    cardClass: "welcome-orbit-card",
    delay: "0.55s",
  },
  {
    badge: "Streak",
    title: "Daily progress",
    detail: "Momentum stays visible every time you come back.",
    wrapperClass: "absolute left-1/2 bottom-11 hidden -translate-x-[165%] sm:block sm:-translate-x-[215%]",
    cardClass: "welcome-orbit-card",
    delay: "0.35s",
  },
  {
    badge: "Mastery",
    title: "Track outcomes",
    detail: "See what is done, what is next, and what needs work.",
    wrapperClass: "absolute left-1/2 bottom-12 hidden translate-x-[65%] sm:block sm:translate-x-[118%]",
    cardClass: "welcome-orbit-card welcome-orbit-card--soft",
    delay: "0.85s",
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const authed = !!localStorage.getItem("token");

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas px-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="welcome-backdrop__beam" />
        <div className="welcome-backdrop__grid" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center py-14 sm:py-20">
        <div className="w-full max-w-3xl text-center">
          <div className="relative mx-auto mb-6 h-[320px] w-full max-w-[760px] sm:mb-8 sm:h-[380px]" aria-hidden="true">
            <div className="welcome-stage-floor" />
            <div className="welcome-stage-ring welcome-stage-ring--outer" />
            <div className="welcome-stage-ring welcome-stage-ring--inner" />

            {orbitPanels.map((panel) => (
              <div key={panel.title} className={panel.wrapperClass}>
                <div className={panel.cardClass} style={{ animationDelay: panel.delay }}>
                  <div className="flex items-center justify-between">
                    <span className="welcome-chip">{panel.badge}</span>
                    <span className="welcome-status-dot" />
                  </div>
                  <p className="mt-4 text-left text-sm font-semibold text-brand">{panel.title}</p>
                  <p className="mt-1 text-left text-xs leading-5 text-slate-500">{panel.detail}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="welcome-orbit-card__bar" style={{ animationDelay: panel.delay }} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="h-2 flex-1 rounded-full bg-slate-100" />
                    <span className="h-2 w-12 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}

            <div className="welcome-spark welcome-spark--left" />
            <div className="welcome-spark welcome-spark--right" />

            <div className="relative mx-auto h-[250px] w-[280px] pt-8 sm:h-[290px] sm:w-[320px] sm:pt-10">
              <div className="welcome-core-shadow welcome-core-shadow--rear" />
              <div className="welcome-core-shadow welcome-core-shadow--mid" />
              <div className="welcome-core-card animate-scale-in">
                <div className="welcome-core__cap-shell">
                  <div className="welcome-core__cap-aura" />
                  <CapMark className="welcome-core__cap" />
                </div>
                <div className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent/80">
                  Learn. Practice. Grow.
                </div>
                <div className="mt-3 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
                  SkillAddis
                </div>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Structured lessons, focused practice, and progress that feels alive the moment the page opens.
                </p>
                <div className="mt-6 w-full max-w-[15rem]">
                  <div className="welcome-core__meter">
                    <div className="welcome-core__meter-fill" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-brand animate-fade-in-up sm:text-5xl">
            Welcome to SkillAddis
          </h1>
          <p className="mt-4 text-lg text-slate-500 animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
            {authed ? "Pick up where you left off." : "Choose how you want to start learning."}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 animate-fade-in-up sm:flex-row" style={{ animationDelay: "0.16s" }}>
            {authed ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-white glow-accent-lg transition-all hover:-translate-y-0.5 hover:bg-accent-strong"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate("/catalog")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-brand transition-all hover:bg-slate-50"
                >
                  Explore
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-white glow-accent-lg transition-all hover:-translate-y-0.5 hover:bg-accent-strong"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v6m3-3h-6M9 12a4 4 0 100-8 4 4 0 000 8zm0 0c-2.67 0-8 1.34-8 4v2h10" />
                  </svg>
                  I&apos;m new
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-brand transition-all hover:bg-slate-50"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
