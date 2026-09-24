import { Button } from "@/components/ui/Button";

type AiProposalProps = {
  title: string;
  loading: boolean;
  result: string | null;
  note?: string | null;
  error?: string | null;
  onAccept: () => void;
  onRegenerate: () => void;
  onCancel: () => void;
};

export function AiProposal({
  title,
  loading,
  result,
  note,
  error,
  onAccept,
  onRegenerate,
  onCancel,
}: AiProposalProps) {
  if (!loading && !result && !error && !note) return null;

  return (
    <div className="mt-3 border border-slate-200 bg-slate-50 p-3 text-sm">
      <p className="font-medium text-slate-900">{title}</p>
      {loading ? <p className="mt-2 text-slate-600">AI is thinking...</p> : null}
      {error ? <p className="mt-2 text-red-700">{error}</p> : null}
      {!loading && result ? (
        <p className="mt-2 whitespace-pre-wrap text-slate-800">{result}</p>
      ) : null}
      {!loading && note ? <p className="mt-2 text-slate-600">{note}</p> : null}
      {!loading ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {result ? (
            <Button onClick={onAccept}>Accept</Button>
          ) : null}
          <Button variant="secondary" onClick={onRegenerate}>
            Regenerate
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      ) : null}
    </div>
  );
}
