import React from 'react';
import { Icon, IconProps } from '@iconify/react';
import { cn } from '@/utils/cn';

interface SolarIconProps extends Omit<IconProps, 'icon'> {
  name: string;
  size?: number | string;
  className?: string;
}

export const SolarIcon: React.FC<SolarIconProps> = ({ name, size = 18, className, ...props }) => (
  <Icon icon={`solar:${name}`} width={size} height={size} className={className} {...props} />
);
