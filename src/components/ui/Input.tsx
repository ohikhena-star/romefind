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
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
