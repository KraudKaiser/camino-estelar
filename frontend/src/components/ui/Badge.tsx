interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "default";
}

const variants = {
  success: "bg-success/20 text-success border-success/30",
  warning: "bg-accent/20 text-accent border-accent/30",
  error: "bg-error/20 text-error border-error/30",
  default: "bg-surface-600/50 text-text-secondary border-surface-500/50",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
}
