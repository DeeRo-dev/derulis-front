import { FiAlertCircle } from "react-icons/fi";

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm text-error"
    >
      <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
