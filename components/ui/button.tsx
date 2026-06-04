import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-2 focus:ring-offset-background-primary disabled:opacity-50 disabled:pointer-events-none h-12 px-6",
          variant === "default" &&
            "bg-blue-primary text-white hover:bg-blue-glow hover:glow-blue-strong active:scale-[0.98]",
          variant === "outline" &&
            "border border-white/8 bg-white/5 hover:bg-white/10 text-text-primary",
          variant === "ghost" &&
            "hover:bg-white/5 text-text-secondary hover:text-text-primary",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
