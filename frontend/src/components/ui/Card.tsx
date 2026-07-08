interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div className={`card-dark ${hover ? "hover:scale-[1.01]" : ""} ${className}`}>
      {children}
    </div>
  );
}
