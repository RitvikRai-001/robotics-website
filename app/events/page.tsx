"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Calendar, MapPin, Users, ChevronDown, ChevronUp, Loader2, Trophy } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeEventId, setActiveEventId] = useState("")

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data)
          setActiveEventId(data[0]._id)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--fg-tertiary)] animate-spin" />
      </main>
    )
  }

  if (events.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--bg)]">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-2xl font-bold text-[var(--fg)] mb-2">No Events Found</h1>
          <p className="text-[var(--fg-secondary)]">Check back later for upcoming events.</p>
        </div>
        <Footer />
      </main>
    )
  }

  const activeEvent = events.find(e => e._id === activeEventId) || events[0]

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div key={activeEventId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-[var(--fg)] tracking-tight leading-[1.05] mb-4">
              {activeEvent.name}
            </h1>
            <p className="text-xl text-[var(--fg-secondary)]">{activeEvent.tagline}</p>
          </motion.div>

          {/* Event tabs */}
          <div className="flex flex-wrap gap-2 mt-10">
            {events.map(event => (
              <button
                key={event._id}
                onClick={() => setActiveEventId(event._id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeEventId === event._id
                    ? "bg-[var(--fg)] text-[var(--bg)]"
                    : "bg-[var(--bg-secondary)] text-[var(--fg-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)]"
                }`}
              >
                {event.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Info sidebar */}
          <motion.div key={`${activeEventId}-info`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-6">
              <h3 className="font-display text-xl font-bold text-[var(--fg)]">Event Details</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">{activeEvent.description}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-[var(--fg-secondary)]">
                  <Calendar className="w-4 h-4 text-[var(--fg-tertiary)]" /> {activeEvent.date}
                </div>
                <div className="flex items-center gap-3 text-[var(--fg-secondary)]">
                  <MapPin className="w-4 h-4 text-[var(--fg-tertiary)]" /> {activeEvent.location}
                </div>
                <div className="flex items-center gap-3 text-[var(--fg-secondary)]">
                  <Users className="w-4 h-4 text-[var(--fg-tertiary)]" /> {activeEvent.participantsLabel || "Open for all"}
                </div>
              </div>

              {activeEvent.highlights?.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--fg-tertiary)] uppercase tracking-wider mb-2">Highlights</p>
                  <div className="flex flex-wrap gap-2">
                    {activeEvent.highlights.map((h: string) => (
                      <span key={h} className="px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--fg-secondary)] text-xs border border-[var(--border)]">{h}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Competitions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-lg font-bold text-[var(--fg)] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[var(--fg-tertiary)]" /> Competitions
              </h3>
              <span className="text-xs text-[var(--fg-tertiary)]">{activeEvent.competitions?.length || 0} events</span>
            </div>
            <AnimatePresence mode="wait">
              {activeEvent.competitions?.map((comp: any, idx: number) => (
                <CompetitionCard key={comp._id} data={comp} index={idx} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function CompetitionCard({ data, index }: { data: any; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl border bg-[var(--bg-secondary)] overflow-hidden transition-colors ${
        isOpen ? "border-[var(--border-hover)]" : "border-[var(--border)]"
      }`}
    >
      <button className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--bg-tertiary)]/50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div>
          <h4 className="font-display text-base font-semibold text-[var(--fg)]">{data.title}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-[var(--fg-tertiary)] uppercase tracking-wider">{data.type}</span>
            <span className="text-xs text-[var(--fg-tertiary)]">{data.minTeamSize}-{data.maxTeamSize} members</span>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--fg-tertiary)]" /> : <ChevronDown className="w-4 h-4 text-[var(--fg-tertiary)]" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-[var(--border)]">
            <div className="p-5 grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[var(--fg-secondary)] leading-relaxed mb-4">{data.description}</p>
                <Link href={`/participate/${data._id}`}>
                  <button className="w-full py-3 rounded-full bg-[var(--fg)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity">
                    Participate Now
                  </button>
                </Link>
              </div>
              {data.rules?.length > 0 && (
                <div className="rounded-xl bg-[var(--bg-tertiary)] p-4 border border-[var(--border)]">
                  <p className="text-xs text-[var(--fg-tertiary)] uppercase tracking-wider mb-3">Rules</p>
                  <ul className="space-y-2">
                    {data.rules.map((rule: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--fg-secondary)]">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--fg-tertiary)] shrink-0" /> {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
