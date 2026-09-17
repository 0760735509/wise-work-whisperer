import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, Lightbulb, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CopyButton } from "@/components/CopyButton";
import { EmptyState, ModuleShell, OutputHeading } from "@/components/ModuleShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { planTasks, type PlannerOutput } from "@/lib/assistant.functions";

const HORIZONS = ["Today", "Tomorrow", "This week"];

const QUADRANTS = [
  { key: "doFirst", label: "Do first", note: "Urgent + important" },
  { key: "schedule", label: "Schedule", note: "Important, not urgent" },
  { key: "delegate", label: "Delegate", note: "Urgent, not important" },
  { key: "eliminate", label: "Drop", note: "Neither" },
] as const;

function asPlainText(result: PlannerOutput) {
  return [
    "PRIORITY MATRIX",
    ...QUADRANTS.flatMap((quadrant) => [
      `${quadrant.label} (${quadrant.note})`,
      ...result.matrix[quadrant.key].map((item) => `- ${item}`),
      "",
    ]),
    "SCHEDULE",
    ...result.timeline.map((slot) => `${slot.slot} — ${slot.task} (${slot.why})`),
    "",
    `TIP: ${result.productivityTip}`,
  ].join("\n");
}

export function TaskPlanner() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState(HORIZONS[0]);
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [result, setResult] = useState<PlannerOutput | null>(null);

  const run = useServerFn(planTasks);
  const mutation = useMutation({
    mutationFn: () => run({ data: { tasks, horizon, hoursPerDay } }),
    onSuccess: (data) => setResult(data),
    onError: (error: Error) => toast.error(error.message || "Could not build the plan."),
  });

  return (
    <ModuleShell
      title="AI Task Planner"
      description="Dump your backlog. Get an Eisenhower priority matrix, a realistic time-blocked schedule, and one tip to work smarter."
      form={
        <>
          <div className="space-y-2">
            <Label htmlFor="tasks">Your tasks (one per line)</Label>
            <Textarea
              id="tasks"
              rows={11}
              placeholder={"Fix production bug\nDraft Q4 roadmap\nReply to vendor emails\nGym"}
              value={tasks}
              onChange={(event) => setTasks(event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Plan for</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HORIZONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Focus hours per day</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                max={16}
                value={hoursPerDay}
                onChange={(event) => setHoursPerDay(Number(event.target.value) || 1)}
              />
            </div>
          </div>
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            disabled={mutation.isPending || tasks.trim().length < 5}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <CalendarClock />}
            {mutation.isPending ? "Planning…" : "Build my plan"}
          </Button>
        </>
      }
      output={
        result ? (
          <div className="space-y-6">
            <OutputHeading action={<CopyButton value={asPlainText(result)} label="Copy plan" />}>
              Your plan
            </OutputHeading>

            <div className="grid gap-3 sm:grid-cols-2">
              {QUADRANTS.map((quadrant) => (
                <div key={quadrant.key} className="rounded-lg border border-border p-4">
                  <p className="text-sm font-semibold">{quadrant.label}</p>
                  <p className="text-xs text-muted-foreground">{quadrant.note}</p>
                  <ul className="mt-3 space-y-1.5">
                    {result.matrix[quadrant.key].length ? (
                      result.matrix[quadrant.key].map((item) => (
                        <li key={item} className="text-sm">
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">—</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Schedule
              </p>
              <ol className="mt-3 space-y-3">
                {result.timeline.map((slot, index) => (
                  <li key={`${slot.slot}-${index}`} className="flex gap-4">
                    <span className="w-28 shrink-0 text-sm font-medium text-primary">
                      {slot.slot}
                    </span>
                    <span className="text-sm">
                      {slot.task}
                      <span className="block text-xs text-muted-foreground">{slot.why}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex gap-3 rounded-lg bg-secondary p-4">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-highlight" />
              <p className="text-sm leading-relaxed">{result.productivityTip}</p>
            </div>
          </div>
        ) : (
          <EmptyState hint="Your priority matrix, schedule and productivity tip will appear here." />
        )
      }
    />
  );
}
