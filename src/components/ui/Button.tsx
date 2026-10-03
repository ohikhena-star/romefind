import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rome-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:     "bg-rome-500 text-white hover:bg-rome-600 active:bg-rome-700 shadow-2xs",
        primary:     "bg-rome-500 text-white hover:bg-rome-600 active:bg-rome-700 shadow-2xs",
        secondary:   "bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700 border border-surface-200/80 dark:border-surface-700",
        outline:     "border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-800 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800 hover:border-surface-400 dark:hover:border-surface-600",
        ghost:       "text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white",
        link:        "text-rome-600 dark:text-rome-400 underline-offset-4 hover:underline p-0 h-auto font-medium",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-2xs",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        md:      "h-10 px-4 py-2 text-sm",
        sm:      "h-8.5 px-3 rounded-lg text-xs",
        xs:      "h-7 px-2.5 rounded-lg text-xs",
        lg:      "h-11 px-6 rounded-xl text-base font-bold",
        icon:    "h-9 w-9 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, fullWidth, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), fullWidth && "w-full")}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <span className="mr-2 animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4 shrink-0" />}
        {!isLoading && leftIcon && <span className="mr-1.5 shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-1.5 shrink-0">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
