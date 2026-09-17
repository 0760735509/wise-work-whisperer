import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
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
import { generateEmail, type EmailOutput } from "@/lib/assistant.functions";

const TONES = ["Professional", "Friendly", "Direct", "Apologetic", "Persuasive", "Formal"];
const LENGTHS = ["Short (under 100 words)", "Standard (150-200 words)", "Detailed (300+ words)"];

export function EmailGenerator() {
  const [intent, setIntent] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<string>("Professional");
  const [length, setLength] = useState<string>("Standard (150-200 words)");
  const [result, setResult] = useState<EmailOutput | null>(null);

  const run = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: () => run({ data: { intent, audience, tone, length } }),
    onSuccess: (data) => setResult(data),
    onError: (error: Error) => toast.error(error.message || "Could not write the email."),
  });

  return (
    <ModuleShell
      title="Smart Email Generator"
      description="Describe what you need to say. Get a polished subject line and email body tuned to your audience and tone."
      form={
        <>
          <div className="space-y-2">
            <Label htmlFor="intent">What do you want to say?</Label>
            <Textarea
              id="intent"
              rows={7}
              placeholder="Tell the client the launch slips two weeks, apologise, propose a new date and offer a call."
              value={intent}
              onChange={(event) => setIntent(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">Recipient / audience</Label>
            <Input
              id="audience"
              placeholder="Enterprise client, non-technical"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            disabled={mutation.isPending || intent.trim().length < 5}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {mutation.isPending ? "Writing…" : "Generate email"}
          </Button>
        </>
      }
      output={
        result ? (
          <div className="space-y-5">
            <OutputHeading
              action={
                <CopyButton
                  value={`Subject: ${result.subject}\n\n${result.body}`}
                  label="Copy all"
                />
              }
            >
              Draft
            </OutputHeading>
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Subject
              </p>
              <p className="mt-1 font-medium">{result.subject}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.body}</p>
            </div>
          </div>
        ) : (
          <EmptyState hint="Your generated subject line and email body will appear here." />
        )
      }
    />
  );
}
