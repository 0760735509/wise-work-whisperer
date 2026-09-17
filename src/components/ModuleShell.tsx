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
    <section className="grid min-h-[570px] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:divide-x lg:divide-border">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="border-b border-border/70 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Input workspace</p>
          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className="mt-6 space-y-5">{form}</div>
      </div>
      <div className="border-t border-border bg-muted/25 p-6 sm:p-8 lg:border-t-0 lg:p-10">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Assistant output
        </p>
        <div className="min-h-[430px] rounded-lg border border-border bg-card p-5 shadow-panel sm:p-6">
          {output}
        </div>
      </div>
    </section>
  );
}

export function EmptyState({ hint }: { hint: string }) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-md border border-dashed border-border p-8 text-center">
      <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-accent text-primary">
        <span className="size-2 rounded-full bg-primary" />
      </div>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{hint}</p>
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
