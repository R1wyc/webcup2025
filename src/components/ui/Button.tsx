"use client";

import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

// Props de base partagés
interface BaseButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
}

// Props spécifiques pour le button HTML
interface ButtonAsButtonProps extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  as?: 'button';
  href?: never;
}

// Props spécifiques pour le link
interface ButtonAsLinkProps extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  as?: 'a';
  href: string;
}

// Props spécifiques pour le Next.js Link
interface ButtonAsNextLinkProps extends BaseButtonProps {
  as: typeof Link;
  href: string;
  onClick?: () => void;
}

// Type de props union
type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps | ButtonAsNextLinkProps;

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    ...rest
  } = props;

  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 shadow-md',
    secondary: 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus-visible:ring-blue-500 shadow-sm',
    outline: 'border-2 border-gray-400 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500 text-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-md',
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 py-3 text-lg',
  };
  
  const classes = twMerge(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    className
  );

  const loadingSpinner = isLoading ? (
    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white" />
  ) : null;

  // Si c'est un Link de Next.js
  if (props.as === Link) {
    return (
      <Link
        href={props.href}
        className={classes}
        onClick={props.onClick}
      >
        {loadingSpinner}
        {children}
      </Link>
    );
  }

  // Si c'est un lien HTML
  if (props.as === 'a' && props.href) {
    return (
      <a
        href={props.href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {loadingSpinner}
        {children}
      </a>
    );
  }

  // Par défaut, c'est un bouton
  return (
    <button
      className={classes}
      disabled={('disabled' in props && props.disabled) || isLoading}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loadingSpinner}
      {children}
    </button>
  );
} 