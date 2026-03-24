"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Snippets", href: "/snippets" },
];

export function Navbar({
  staticLinks,
}: {
  staticLinks: Record<string, string>;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2 text-foreground">
          <Image
            width={50}
            height={50}
            src="/logo.webp"
            alt="Spacehole tech logo"
          />
          <span className="font-mono text-sm font-semibold tracking-tight">
            {"Spacehole.tech"}
          </span>
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
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a target="_blank" href={staticLinks.linkedIn}>
              Hire Me
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
          <Button
            size="sm"
            className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a target="_blank" href={staticLinks.linkedIn}>
              Hire Me
            </a>
          </Button>
        </div>
      )}
    </header>
  );
}
