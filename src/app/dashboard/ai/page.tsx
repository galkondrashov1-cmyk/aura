import { AiForm } from "@/components/ai/ai-form";

export default function AiBuilderPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-medium tracking-tight">
        Generate with AI
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Describe yourself and AURA will design a starting page — you can refine
        everything in the builder afterward.
      </p>

      <div className="mt-6">
        <AiForm />
      </div>

      <p className="mt-6 text-xs text-text-muted">
        Powered by Claude. Needs <span className="font-mono">ANTHROPIC_API_KEY</span>{" "}
        in <span className="font-mono">.env</span> to run.
      </p>
    </div>
  );
}
