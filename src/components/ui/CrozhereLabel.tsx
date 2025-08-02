import Link from 'next/link';
import { cn } from '@/lib/utils';
import Logo from './Logo';

interface CrozhereLabelProps {
    showLogo?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'square' | 'rounded_square' | 'rounded';
    link?: boolean;
}

export default function CrozhereLabel({
    showLogo = true,
    size = 'md', 
    variant = 'rounded_square', 
    link = false }: CrozhereLabelProps) {

    const crozhereLabel = (
        <div className="flex items-center gap-2 cursor-pointer">
            <Logo 
                src="/assets/logo.png"
                variant='rounded_square'
                size= {size} 
            />
            
            <span className={cn(
                'font-bold text-blue-600',
                size === 'sm' && 'text-xl',
                size === 'md' && 'text-2xl',
                size === 'lg' && 'text-3xl'
            )}>
                CrozHere
            </span>
        </div>
    );

    return link ? <Link href="/">{crozhereLabel}</Link> : crozhereLabel;
}
