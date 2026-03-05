import { Star, Quote, GitFork, Users, Code2 } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Manager at Stripe",
    text: "One of the most talented full-stack engineers I have worked with. Delivers clean, well-tested code with an eye for performance that is rare to find.",
  },
  {
    name: "Marcus Rivera",
    role: "CTO at Launchpad AI",
    text: "Joined our seed-stage startup and architected the entire backend. Their Go microservices are still running in production two years later with zero downtime.",
  },
  {
    name: "Aisha Patel",
    role: "Senior Developer at Vercel",
    text: "The code snippets on this site are genuinely useful. I reference the retry patterns and the auth middleware regularly in my own projects.",
  },
]

const stats = [
  { label: "GitHub Stars", value: "2.4k+", icon: Star },
  { label: "Open Source Repos", value: "38", icon: Code2 },
  { label: "Forks", value: "520+", icon: GitFork },
  { label: "Contributors", value: "140+", icon: Users },
]

export function SocialProof() {
  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* GitHub Stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-primary/30"
            >
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-12 flex items-center gap-3">
          <Quote className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            What People Say
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {`"${t.text}"`}
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
