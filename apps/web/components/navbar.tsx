"use client";

import { Menu, X, Globe } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/locale-provider";

export function Navbar({
  staticLinks,
}: {
  staticLinks: Record<string, string>;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");
  const { locale, toggleLocale } = useLocale();

  const navLinks = [
    { label: t("projects"), href: "/proyectos" },
    { label: t("snippets"), href: "/snippets" },
    { label: t("about"), href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2 text-foreground">
          <Image
            width={75}
            height={75}
            src="/logo.webp"
            alt="Spacehole tech logo"
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Switch to ${locale === "es" ? "English" : "Español"}`}
          >
            <Globe className="h-4 w-4" />
            {locale === "es" ? "EN" : "ES"}
          </button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a target="_blank" href={staticLinks.linkedIn}>
              {t("hireMe")}
            </a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border px-6 pb-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={toggleLocale}
            className="flex w-full items-center gap-1.5 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            {locale === "es" ? "English" : "Español"}
          </button>
          <Button
            size="sm"
            className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a target="_blank" href={staticLinks.linkedIn}>
              {t("hireMe")}
            </a>
          </Button>
        </div>
      )}
    </header>
  );
}
