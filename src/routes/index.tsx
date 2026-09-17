import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, FileText, Mail, Sparkles } from "lucide-react";

import { EmailGenerator } from "@/components/EmailGenerator";
import { MeetingSummarizer } from "@/components/MeetingSummarizer";
import { TaskPlanner } from "@/components/TaskPlanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workday — Intelligent Workplace Assistant" },
      {
        name: "description",
        content:
          "Write emails, summarize meeting notes into action items, and plan your day with an Eisenhower priority matrix — all in one AI workspace.",
      },
      { property: "og:title", content: "Workday — Intelligent Workplace Assistant" },
      {
        property: "og:description",
        content:
          "AI email drafting, meeting note summaries with owners and deadlines, and time-blocked task planning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MODULES = [
  { value: "email", label: "Email", icon: Mail },
  { value: "meeting", label: "Meeting notes", icon: FileText },
  { value: "planner", label: "Task planner", icon: CalendarClock },
];

function Index() {
  return (
    <main className="min-h-screen bg-background px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-xl border border-border bg-card shadow-lift">
        <header className="bg-hero px-6 py-9 text-surface-foreground sm:px-10 sm:py-11 lg:px-12">
          <div className="flex items-start justify-between gap-8">
            <div>
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-surface-foreground/75">
                <span className="flex size-7 items-center justify-center rounded-md border border-surface-foreground/20 bg-surface-foreground/10">
                  <Sparkles className="size-3.5" />
                </span>
                Workday AI
              </div>
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                Intelligent Workplace Assistant
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-surface-foreground/78 sm:text-lg">
                Draft polished emails, distill meeting decisions, and turn priorities into a clear plan.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-surface-foreground/15 bg-surface-foreground/8 px-3 py-2 text-xs font-medium text-surface-foreground/75 md:flex">
              <span className="size-1.5 rounded-full bg-highlight" />
              Ready to assist
            </div>
          </div>
        </header>

        <Tabs defaultValue="email">
          <div className="border-b border-border bg-card px-3 py-3 sm:px-8">
            <TabsList className="h-auto w-full justify-start gap-1 rounded-none bg-transparent p-0 sm:w-auto">
            {MODULES.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="min-h-10 flex-1 gap-2 rounded-md px-3 py-2.5 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-none sm:flex-none sm:px-4 sm:text-sm"
              >
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
            </TabsList>
          </div>

          <TabsContent value="email" className="m-0">
            <EmailGenerator />
          </TabsContent>
          <TabsContent value="meeting" className="m-0">
            <MeetingSummarizer />
          </TabsContent>
          <TabsContent value="planner" className="m-0">
            <TaskPlanner />
          </TabsContent>
        </Tabs>

        <footer className="flex flex-col gap-1 border-t border-border bg-muted/35 px-6 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Three focused tools. One clear workspace.</span>
          <span>Workday Intelligent Assistant</span>
        </footer>
      </div>
    </main>
  );
}
