import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LuxuryButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant"
> & {
  variant?: "primary" | "outline" | "ghost";
};

const variants = {
  primary: "bg-luxury-bronze text-white hover:bg-luxury-ink",
  outline:
    "border border-luxury-bronze text-luxury-bronze hover:bg-luxury-bronze hover:text-white",
  ghost: "text-luxury-stone hover:bg-luxury-taupe/20 hover:text-luxury-ink",
} as const;

export function LuxuryButton({
  variant = "primary",
  className,
  ...props
}: LuxuryButtonProps) {
  return (
    <Button
      className={cn(
        "h-auto rounded-none px-8 py-6 font-sans text-[10px] uppercase tracking-luxury transition-all duration-500",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
