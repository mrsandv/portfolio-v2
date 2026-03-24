import { Github, Linkedin, Terminal } from "lucide-react";

const socials = [
  { label: "GitHub", href: "https://github.com/mrsandv", icon: Github },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/mrsan/?locale=en-US",
    icon: Linkedin,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm text-muted-foreground">
            {"Spacehole Tech"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={s.label}
            >
              <s.icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">{`Built with 💜 by mrsan`}</p>
      </div>
    </footer>
  );
}
