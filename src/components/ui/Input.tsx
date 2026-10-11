import * as React from "react"

import { cn } from "@/utils/cn"

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, fullWidth, ...props }, ref) => {
    const inputElement = (
      <input
        type={type}
        className={cn(
          "flex h-11 min-h-[44px] w-full rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 px-3.5 py-2 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rome-500 focus-visible:border-rome-500 transition-all shadow-xs disabled:cursor-not-allowed disabled:opacity-50",
          className,
          fullWidth && "w-full"
        )}
        ref={ref}
        {...props}
      />
    );
    
    if (label) {
      return (
        <div className="space-y-1.5 w-full">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {inputElement}
        </div>
      );
    }
    return inputElement;
  }
)
Input.displayName = "Input"

export { Input }
