import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  size?: "default" | "small" | "compact" | "filter" | "action";
};

const variants = {
  primary: "border-transparent bg-primary text-primary-foreground hover:bg-t1-blue-600",
  secondary: "border-border bg-card text-foreground hover:bg-secondary",
  quiet: "border-transparent bg-transparent text-foreground hover:bg-secondary",
  danger: "border-transparent bg-t1-red-500 text-white hover:bg-t1-red-700",
} as const;

const sizes = {
  default: "min-h-11 px-4 text-sm",
  small: "min-h-10 px-4 text-[13px]",
  compact: "min-h-9 px-3 text-xs",
  filter: "min-h-10 gap-1.5 px-2 text-[13px]",
  action: "min-h-9 gap-1.5 px-0 text-xs",
} as const;

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
