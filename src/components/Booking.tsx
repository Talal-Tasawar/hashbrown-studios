import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, LazyMotion, domMax, m, useReducedMotion } from "motion/react";
import { ArrowCounterClockwise, Check, Plus, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

const WHATSAPP = "923644915188";
const SERVICES = ["Website", "E-commerce store", "Redesign", "Branding", "SEO", "Something else"];
const BUDGETS = ["Under $1k", "$1k-3k", "$3k-7k", "$7k+", "Not sure yet"];
const SLOTS = [
  { id: "Morning", hint: "10am-12pm" },
  { id: "Afternoon", hint: "2pm-4pm" },
  { id: "Evening", hint: "6pm-8pm" },
];
const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

type Errors = Partial<Record<"name" | "services" | "date" | "slot", string>>;

const fieldBase =
  "w-full rounded-[0.875rem] bg-bg px-4 py-3.5 text-ink shadow-[inset_0_0_0_1px_var(--line)] outline-none transition-shadow duration-300 placeholder:text-muted/80 focus:shadow-[inset_0_0_0_2px_var(--accent)] aria-[invalid=true]:shadow-[inset_0_0_0_2px_var(--danger)]";

function ErrorText({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <p id={id} className="min-h-5 text-sm text-danger" aria-live="polite">
      {children}
    </p>
  );
}

function Pill({ selected, group, label, hint }: { selected: boolean; group: string; label: string; hint?: string }) {
  return (
    <>
      {selected && <m.span layoutId={`${group}-pill`} transition={spring} className="absolute inset-0 rounded-full bg-accent" />}
      <span className={`relative flex flex-col items-center leading-tight transition-colors duration-300 ${selected ? "text-on-accent" : ""}`}>
        <span>{label}</span>
        {hint && <span className={`text-xs ${selected ? "text-on-accent/75" : "text-muted"}`}>{hint}</span>}
      </span>
    </>
  );
}

export default function Booking() {
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [details, setDetails] = useState("");
  const [minDate, setMinDate] = useState<string>();
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    setMinDate(`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`);
  }, []);

  const toggleService = (s: string) =>
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Add your name so we know who to reply to.";
    if (!services.length) next.services = "Pick at least one thing you need.";
    if (!date) next.date = "Choose a day for the call.";
    else if (minDate && date < minDate) next.date = "Pick a day from tomorrow onwards.";
    if (!slot) next.slot = "Choose a time of day.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    const day = new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    const hint = SLOTS.find((s) => s.id === slot)?.hint;
    const lines = [
      "Hi Hashbrown Studios, I'd like to book a call.",
      "",
      `Name: ${name.trim()}`,
      ...(brand.trim() ? [`Business: ${brand.trim()}`] : []),
      `Looking for: ${services.join(", ")}`,
      ...(budget ? [`Budget: ${budget}`] : []),
      `Preferred time: ${day}, ${slot.toLowerCase()} (${hint} PKT)`,
      ...(details.trim() ? [`Details: ${details.trim()}`] : []),
    ];
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
    setSentUrl(url);
  };

  const reset = () => {
    setSentUrl(null);
    setServices([]);
    setBudget("");
    setDate("");
    setSlot("");
    setDetails("");
  };

  const fade = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <LazyMotion features={domMax} strict>
      <AnimatePresence mode="wait" initial={false}>
        {sentUrl ? (
          <m.div key="sent" {...fade} className="flex min-h-[36rem] flex-col items-start justify-center gap-6 p-7 md:p-10" role="status">
            <span className="grid size-16 place-items-center rounded-full bg-accent text-on-accent">
              <Check size={30} weight="bold" aria-hidden="true" />
            </span>
            <h3 className="text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-tight tracking-[-0.03em] [font-stretch:118%]">
              Your request is ready in WhatsApp
            </h3>
            <p className="max-w-[42ch] text-muted">
              Press send in WhatsApp and we will confirm your call time there. If WhatsApp did not open, use the button below.
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="btn btn-primary" href={sentUrl} target="_blank" rel="noopener noreferrer">
                <span>Open WhatsApp</span>
                <span className="btn-ico"><WhatsappLogo aria-hidden="true" /></span>
              </a>
              <button type="button" onClick={reset} className="btn btn-ghost">
                <span>Start over</span>
                <span className="btn-ico"><ArrowCounterClockwise aria-hidden="true" /></span>
              </button>
            </div>
          </m.div>
        ) : (
          <m.form key="form" {...fade} ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-6 p-6 md:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="bk-name" className="font-medium">Your name</label>
                <input id="bk-name" data-field="name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldBase} aria-invalid={!!errors.name} aria-describedby="bk-name-err" />
                <ErrorText id="bk-name-err">{errors.name}</ErrorText>
              </div>
              <div className="grid gap-2">
                <label htmlFor="bk-brand" className="font-medium">Business name <span className="font-normal text-muted">(optional)</span></label>
                <input id="bk-brand" name="business" autoComplete="organization" value={brand} onChange={(e) => setBrand(e.target.value)} className={fieldBase} />
                <span className="min-h-5" aria-hidden="true" />
              </div>
            </div>

            <fieldset className="grid gap-3" aria-describedby="bk-services-err">
              <legend className="mb-3 font-medium">What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s, i) => {
                  const on = services.includes(s);
                  return (
                    <label key={s} className={`relative inline-flex cursor-pointer items-center gap-2 rounded-full py-2.5 pl-4 pr-3 transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${on ? "bg-ink text-bg" : "shadow-[inset_0_0_0_1px_var(--line)] hover:bg-ink/5"}`}>
                      <input type="checkbox" name="services" value={s} className="sr-only" data-field={i === 0 ? "services" : undefined} checked={on} onChange={() => toggleService(s)} aria-invalid={!!errors.services} />
                      {s}
                      <span className="relative grid size-5 place-items-center" aria-hidden="true">
                        <AnimatePresence initial={false} mode="popLayout">
                          {on ? (
                            <m.span key="on" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={spring}><Check size={16} weight="bold" /></m.span>
                          ) : (
                            <m.span key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}><Plus size={16} /></m.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </label>
                  );
                })}
              </div>
              <ErrorText id="bk-services-err">{errors.services}</ErrorText>
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="mb-3 font-medium">Budget <span className="font-normal text-muted">(optional)</span></legend>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <label key={b} className="relative inline-flex cursor-pointer items-center rounded-full px-4 py-2.5 shadow-[inset_0_0_0_1px_var(--line)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
                    <input type="radio" name="budget" value={b} className="sr-only" checked={budget === b} onChange={() => setBudget(b)} />
                    <Pill selected={budget === b} group="budget" label={b} />
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="grid content-start gap-2">
                <label htmlFor="bk-date" className="font-medium">Preferred day</label>
                <input id="bk-date" name="date" autoComplete="off" data-field="date" type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className={`${fieldBase} min-h-[3.25rem]`} aria-invalid={!!errors.date} aria-describedby="bk-date-err" />
                <ErrorText id="bk-date-err">{errors.date}</ErrorText>
              </div>
              <fieldset className="grid content-start gap-2" aria-describedby="bk-slot-err">
                <legend className="mb-2 font-medium">Time of day <span className="font-normal text-muted">(Pakistan time)</span></legend>
                <div className="grid grid-cols-3 gap-1 rounded-full p-1 shadow-[inset_0_0_0_1px_var(--line)]">
                  {SLOTS.map((s, i) => (
                    <label key={s.id} className="relative flex min-h-[3rem] cursor-pointer items-center justify-center rounded-full px-2 text-[0.95rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
                      <input type="radio" name="slot" value={s.id} className="sr-only" data-field={i === 0 ? "slot" : undefined} checked={slot === s.id} onChange={() => setSlot(s.id)} aria-invalid={!!errors.slot} />
                      <Pill selected={slot === s.id} group="slot" label={s.id} hint={s.hint} />
                    </label>
                  ))}
                </div>
                <ErrorText id="bk-slot-err">{errors.slot}</ErrorText>
              </fieldset>
            </div>

            <div className="grid gap-2">
              <label htmlFor="bk-details" className="font-medium">Anything we should know? <span className="font-normal text-muted">(optional)</span></label>
              <textarea id="bk-details" name="details" autoComplete="off" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} className={`${fieldBase} resize-y`} placeholder="Your current site, a deadline, sites you like…" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
              <p className="max-w-[34ch] text-sm text-muted">Opens WhatsApp with your request filled in. Nothing is sent until you press send there.</p>
              <button type="submit" className="btn btn-primary">
                <span>Send on WhatsApp</span>
                <span className="btn-ico"><WhatsappLogo aria-hidden="true" /></span>
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
