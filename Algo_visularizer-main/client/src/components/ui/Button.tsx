import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 hover:shadow-primary/40',
      secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20',
      ghost: 'bg-transparent hover:bg-white/5 text-slate-500 hover:text-white',
      danger: 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 shadow-lg shadow-red-500/10',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[10px] font-black uppercase tracking-wider',
      md: 'px-5 py-2.5 text-xs font-black uppercase tracking-widest',
      lg: 'px-8 py-3.5 text-sm font-black uppercase tracking-widest',
      icon: 'p-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl font-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
