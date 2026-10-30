'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'accent'
    | 'success'
    | 'glass';
  size?: 'default' | 'sm' | 'xs' | 'lg' | 'icon';
}

const variantStyles: Record<string, string> = {
  default: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm active:scale-95',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-95',
  outline: 'border border-border bg-transparent hover:bg-muted text-foreground active:scale-95',
  secondary: 'bg-muted text-foreground hover:opacity-80 active:scale-95',
  ghost: 'hover:bg-muted text-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  accent: 'bg-accent text-accent-foreground hover:opacity-90 shadow-sm active:scale-95',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-95',
  glass:
    'border border-white/25 bg-surface/45 text-foreground backdrop-blur-md hover:bg-surface/70 active:scale-95',
};

const sizeStyles: Record<string, string> = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-8 rounded-md px-3 text-xs',
  xs: 'h-7 rounded-md px-2 text-[11px]',
  lg: 'h-12 rounded-lg px-8 text-base font-medium',
  icon: 'h-10 w-10 p-0 flex items-center justify-center',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          'inline-flex cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-all duration-200 ease-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant] || variantStyles.default,
          sizeStyles[size] || sizeStyles.default,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
