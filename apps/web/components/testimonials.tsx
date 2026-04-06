"use client";

import { MessageSquareQuote, Quote } from "lucide-react";
import { useTranslations } from "next-intl";

export function Testimonials() {
  const t = useTranslations("testimonials");

  const testimonials = [
    {
      quote: t("placeholder1.quote"),
      author: t("placeholder1.author"),
      role: t("placeholder1.role"),
    },
    {
      quote: t("placeholder2.quote"),
      author: t("placeholder2.author"),
      role: t("placeholder2.role"),
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3">
          <MessageSquareQuote className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote
              key={item.author}
              className="rounded-xl border border-border bg-card p-6"
            >
              <Quote className="mb-3 size-5 text-primary/50" />
              <p className="text-foreground leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-muted-foreground">
                <strong className="text-foreground">{item.author}</strong>
                {" — "}
                {item.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
