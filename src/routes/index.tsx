import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, FileText, Mail } from "lucide-react";

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
    <main className="min-h-screen">
      <header className="bg-hero text-surface-foreground">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-surface-foreground/70">
            Intelligent workplace assistant
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Turn scattered work into finished output.
          </h1>
          <p className="mt-4 max-w-xl text-base text-surface-foreground/80">
            Three focused tools: draft the email, turn a transcript into owned action items, and
            block out a day that actually fits.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <Tabs defaultValue="email" className="space-y-8">
          <TabsList className="h-auto w-full justify-start gap-1 p-1 sm:w-auto">
            {MODULES.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="gap-2 px-4 py-2">
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="email">
            <EmailGenerator />
          </TabsContent>
          <TabsContent value="meeting">
            <MeetingSummarizer />
          </TabsContent>
          <TabsContent value="planner">
            <TaskPlanner />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
