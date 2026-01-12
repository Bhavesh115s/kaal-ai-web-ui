"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/meditation", label: "Meditation" },
    { href: "/assessment", label: "Self Reflection" },
    { href: "/psychologist", label: "Psychologist" },
    { href: "/events", label: "Events" },
    { href: "/support", label: "Support" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-border/60 bg-card/98 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold flex-shrink-0">
            <span className="text-2xl">ॐ</span>
            <span>
              <span className="font-bold">काल</span> <span className="font-normal">AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.slice(0, -1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground/90 hover:bg-muted/80 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Button asChild className="hidden md:flex shadow-md hover:shadow-lg font-semibold">
            <Link href="/chat">Start Conversation</Link>
          </Button>

          <div className="lg:hidden">
            <MobileNav links={links} pathname={pathname} />
          </div>
        </div>
      </div>
    </nav>
  )
}

function MobileNav({ links, pathname }: { links: { href: string; label: string }[]; pathname: string }) {
  return (
    <div className="relative">
      <details className="group">
        <summary className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
          Menu
          <svg
            className="h-4 w-4 transition-transform group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card p-2 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-4 py-2 text-sm rounded-md transition-colors",
                pathname === link.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </details>
    </div>
  )
}
