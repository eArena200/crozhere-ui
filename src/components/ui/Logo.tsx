'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'square' | 'rounded_square' | 'rounded';
  link?: boolean;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
};

const roundMap = {
  square: '',
  rounded_square: 'rounded-sm',
  rounded: 'rounded-full',
};

export default function Logo(
  { 
    src = "/assets/logo.png",
    size = 'md', 
    variant = 'rounded_square', 
    link = false 
  }: LogoProps) {
  const dimension = sizeMap[size];
  const rounding = roundMap[variant];

  const logoContent = (
    <div className="flex items-center gap-2">
      <Image
        src = {src}
        alt="Logo"
        width={dimension}
        height={dimension}
        className={cn(rounding)}
        priority
      />
    </div>
  );

  return link ? <Link href="/">{logoContent}</Link> : logoContent;
}
