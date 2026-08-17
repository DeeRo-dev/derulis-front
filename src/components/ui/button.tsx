import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { tap } from "@/lib/motion";

/**
 * Los handlers de arrastre y animación de React chocan con los de framer:
 * mismo nombre, otra firma. Se quitan del tipo — este botón no los usa.
 */
type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover",
  secondary:
    "border border-lilac-300 bg-white text-primary hover:bg-lilac-50",
  ghost: "text-primary hover:bg-lilac-100",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <motion.button
      ref={ref}
      type={type}
      whileTap={tap}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6",
        "text-base font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };
