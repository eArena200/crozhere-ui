import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "link" | "m_primary" | "m_secondary" | "m_danger" | "m_link";
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "font-semibold transition focus:outline-none disabled:opacity-50";

  const variants = {
    primary: "px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700",
    secondary: "px-4 py-2 rounded-lg border bg-white-100 text-blue-700 hover:bg-gray-200",
    danger: "px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-600",
    link: "text-blue-600 hover:underline p-0 bg-transparent",
    m_primary: "px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700",
    m_secondary: "px-2 py-1 rounded-md border bg-white-100 text-blue-700 hover:bg-gray-200",
    m_danger: "px-2 py-1 rounded-md bg-red-700 text-white hover:bg-red-600",
    m_link: "text-blue-600 hover:underline p-0 bg-transparent",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
