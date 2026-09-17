import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { CopyButton } from "@/components/CopyButton";
import { EmptyState, ModuleShell, OutputHeading } from "@/components/ModuleShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting, type MeetingOutput } from "@/lib/assistant.functions";

function asPlainText(result: MeetingOutput) {
  return [
    "EXECUTIVE SUMMARY",
    result.executiveSummary,
    "",
    "KEY DECISIONS",
    ...result.keyDecisions.map((item) => `- ${item}`),
    "",
    "ACTION ITEMS",
    ...result.actionItems.map((item) => `- ${item.task} — ${item.owner} (${item.deadline})`),
    "",
    "RISKS & OPEN QUESTIONS",
    ...result.risks.map((item) => `- ${item}`),
  ].join("\n");
}

export function MeetingSummarizer() {
  const [transcript, setTranscript] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<MeetingOutput | null>(null);

  const run = useServerFn(summarizeMeeting);
  const mutation = useMutation({
    mutationFn: () => run({ data: { transcript, context } }),
    onSuccess: (data) => setResult(data),
    onError: (error: Error) => toast.error(error.message || "Could not summarize the notes."),
  });

  return (
    <ModuleShell
      title="Meeting Notes Summarizer"
      description="Paste a transcript or messy notes. Get an executive summary, the decisions made, owners with deadlines, and open risks."
      form={
        <>
          <div className="space-y-2">
            <Label htmlFor="context">Meeting context (optional)</Label>
            <Input
              id="context"
              placeholder="Weekly product sync, 6 attendees"
              value={context}
              onChange={(event) => setContext(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript or raw notes</Label>
            <Textarea
              id="transcript"
              rows={14}
              placeholder="Sam: we agreed to push the beta to the 14th…"
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
            />
          </div>
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            disabled={mutation.isPending || transcript.trim().length < 20}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <FileText />}
            {mutation.isPending ? "Analysing…" : "Summarize notes"}
          </Button>
        </>
      }
      output={
        result ? (
          <div className="space-y-6">
            <OutputHeading action={<CopyButton value={asPlainText(result)} label="Copy all" />}>
              Meeting brief
            </OutputHeading>

            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Executive summary
              </p>
              <p className="mt-2 text-sm leading-relaxed">{result.executiveSummary}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Key decisions
              </p>
              {result.keyDecisions.length ? (
                <ul className="mt-2 space-y-2">
                  {result.keyDecisions.map((item) => (
                    <li key={item} className="flex gap-2 text-sm">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-highlight" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No decisions recorded.</p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Action items
              </p>
              {result.actionItems.length ? (
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Deadline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.actionItems.map((item, index) => (
                      <TableRow key={`${item.task}-${index}`}>
                        <TableCell className="text-sm">{item.task}</TableCell>
                        <TableCell className="text-sm">{item.owner}</TableCell>
                        <TableCell className="text-sm">{item.deadline}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No action items found.</p>
              )}
            </div>

            {result.risks.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Risks &amp; open questions
                </p>
                <ul className="mt-2 space-y-2">
                  {result.risks.map((item) => (
                    <li key={item} className="flex gap-2 text-sm">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <EmptyState hint="Your summary, decisions and action items table will appear here." />
        )
      }
    />
  );
}
