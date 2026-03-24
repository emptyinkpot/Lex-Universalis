import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { UI_ICONS, UIIconKey } from '@/constants/icons';

interface UIIconProps {
  iconName: UIIconKey;
  size?: number;
  color?: string;
}

export const UIIcon: React.FC<UIIconProps> = ({
  iconName,
  size = 20,
  color
}) => {
  const config = UI_ICONS[iconName];

  if (!config) return null;

  return (
    <FontAwesome6
      name={config.name}
      size={size}
      color={color || config.color}
    />
  );
};
