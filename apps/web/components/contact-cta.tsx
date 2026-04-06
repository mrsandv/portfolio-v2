"use client";

import { useState, useRef } from "react";
import {
  Send,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Globe,
  Layout,
  Server,
  Smartphone,
  HelpCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Turnstile from "react-turnstile";
import { Button } from "@/components/ui/button";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

const PROJECT_TYPES = [
  { key: "webapp", icon: Globe },
  { key: "landing", icon: Layout },
  { key: "api", icon: Server },
  { key: "mobile", icon: Smartphone },
  { key: "other", icon: HelpCircle },
] as const;

const MATURITY_KEYS = ["idea", "wireframes", "existing", "ready"] as const;
const TIMELINE_KEYS = ["asap", "months", "nohurry", "exploring"] as const;

export function ContactCTA() {
  const t = useTranslations("cta");
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [maturity, setMaturity] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [isVerified, setIsVerified] = useState(false);
  const turnstileTokenRef = useRef<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified || !turnstileTokenRef.current) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          projectType,
          maturity,
          timeline,
          message: message.trim(),
          turnstileToken: turnstileTokenRef.current,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="px-6 py-24">
        <div className="mx-auto max-w-xl">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="size-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {t("success")}
            </h3>
            <p className="text-muted-foreground">{t("successDescription")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Progress bar */}
          <div className="flex gap-1 p-3 pb-0">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          <div className="p-6">
            <p className="mb-1 text-xs text-muted-foreground">
              {t("stepOf", { current: step, total: 3 })}
            </p>

            {/* Step 1: Project type */}
            {step === 1 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  {t("step1Title")}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PROJECT_TYPES.map(({ key, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setProjectType(key)}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors ${
                        projectType === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-5" />
                      {t(`projectTypes.${key}`)}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!projectType}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {t("next")}
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Budget & Timeline */}
            {step === 2 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  {t("step2Title")}
                </h3>

                <p className="mb-2 text-sm text-muted-foreground">
                  {t("maturityLabel")}
                </p>
                <div className="grid grid-cols-1 gap-2 mb-5 sm:grid-cols-2">
                  {MATURITY_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMaturity(key)}
                      className={`rounded-lg border px-3 py-2.5 text-sm text-left transition-colors ${
                        maturity === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {t(`maturity.${key}`)}
                    </button>
                  ))}
                </div>

                <p className="mb-2 text-sm text-muted-foreground">
                  {t("timelineLabel")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TIMELINE_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTimeline(key)}
                      className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        timeline === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {t(`timelines.${key}`)}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-border"
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    {t("back")}
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!maturity || !timeline}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {t("next")}
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Contact info */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  {t("step3Title")}
                </h3>

                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("namePlaceholder")}
                      required
                      className="rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      required
                      className="rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("messagePlaceholder")}
                    required
                    rows={4}
                    className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                {!isVerified && (
                  <div className="mt-4 flex justify-center">
                    <Turnstile
                      sitekey={TURNSTILE_SITE_KEY}
                      onVerify={(token) => {
                        turnstileTokenRef.current = token;
                        setIsVerified(true);
                      }}
                      theme="dark"
                    />
                  </div>
                )}

                {status === "error" && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="size-4" />
                    {t("error")}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="border-border"
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    {t("back")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      status === "sending" ||
                      !isVerified ||
                      !name ||
                      !email ||
                      !message
                    }
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {status === "sending" ? (
                      t("sending")
                    ) : (
                      <>
                        <Send className="mr-2 size-4" />
                        {t("submit")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
