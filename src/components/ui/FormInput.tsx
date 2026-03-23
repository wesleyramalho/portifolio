import { ComponentProps } from "react";

const baseClass =
  "bg-white/5 border rounded-md px-4 py-2.5 text-body text-zinc-100 placeholder-zinc-600 focus:outline-none transition-colors disabled:opacity-50";

function borderClass(hasError: boolean) {
  return hasError
    ? "border-red-500/60 focus:border-red-500/80"
    : "border-white/10 focus:border-white/30";
}

type InputProps = ComponentProps<"input"> & { hasError?: boolean };
type TextareaProps = ComponentProps<"textarea"> & { hasError?: boolean };

export function FormInput({ hasError = false, className = "", ...props }: InputProps) {
  return (
    <input
      className={`${baseClass} ${borderClass(hasError)} ${className}`}
      {...props}
    />
  );
}

export function FormTextarea({ hasError = false, className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`${baseClass} ${borderClass(hasError)} resize-none ${className}`}
      {...props}
    />
  );
}
