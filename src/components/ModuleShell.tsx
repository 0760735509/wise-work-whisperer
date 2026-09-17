import type { ReactNode } from "react";

export function ModuleShell({
  title,
  description,
  form,
  output,
}: {
  title: string;
  description: string;
  form: ReactNode;
  output: ReactNode;
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="panel p-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 space-y-4">{form}</div>
      </div>
      <div className="panel p-6">{output}</div>
    </section>
  );
}

export function EmptyState({ hint }: { hint: string }) {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border/70 p-8 text-center">
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function OutputHeading({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-display text-lg font-semibold">{children}</h3>
      {action}
    </div>
  );
}
