import { ExternalLink, Globe, Layers, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "Antojo",
    description:
      "Say goodbye to group decision fatigue. An app to prioritize restaurants based on your friends' genuine enthusiasm, not just endless lists.",
    tags: ["React", "Tailwind", "Sockets", "MongoDB", "Go"],
    github: "",
    live: "",
    featured: true,
  },
  {
    title: "Luna de Miel salon SPA",
    description:
      "Tired of your ordinary nails? Soon we'll have a kawaii experience at your fingertips.",
    tags: ["React", "Tailwind", "MongoDB", "Go"],
    github: "",
    live: "",
    featured: false,
  },
  {
    title: "Pal' chesco",
    description:
      "A way to contribute to Mexican projects and help each other out among creators.",
    tags: ["Go"],
    github: "",
    live: "",
    featured: false,
  },
];

export function BentoPortfolio() {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-3">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Projects in progress
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:bg-secondary/50 ${
                project.featured && index === 0 ? "md:col-span-2" : ""
              }`}
            >
              {project.featured && (
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  In progress
                </span>
              )}

              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="border-border bg-secondary text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={`View ${project.title} source on GitHub`}
                  >
                    <Terminal className="h-4 w-4" />
                    <span>Source</span>
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`View ${project.title} live demo`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Live</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
