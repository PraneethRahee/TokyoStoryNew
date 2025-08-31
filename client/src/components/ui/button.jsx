import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils/cn"

const buttonVariants = {
  variant: {
    default: "bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl",
    destructive: "bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl",
    outline: "border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-200",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200",
    ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200",
    link: "text-secondary-600 underline-offset-4 hover:underline font-medium py-3 px-6",
  },
  size: {
    default: "h-12 px-6 py-3",
    sm: "h-9 px-3 py-2",
    lg: "h-14 px-8 py-4",
    icon: "h-10 w-10",
  },
}

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants.variant[variant], buttonVariants.size[size], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
