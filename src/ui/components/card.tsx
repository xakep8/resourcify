// components/ui/card.tsx

import React from 'react';
import { cn } from '../utils/cn'; // Utility to join class names (optional)

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800',
                className?.toString()
            )}
            {...props}
        />
    );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { }

export function CardContent({ className, ...props }: CardContentProps) {
    return (
        <div className={cn('p-4', className?.toString())} {...props} />
    );
}
