import React from 'react';
import { View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { CARD_TYPE_ICONS, CardTypeIconKey } from '@/constants/icons';

interface CardTypeIconProps {
  cardType: CardTypeIconKey;
  size?: number;
}

export const CardTypeIcon: React.FC<CardTypeIconProps> = ({
  cardType,
  size = 20
}) => {
  const config = CARD_TYPE_ICONS[cardType];

  if (!config) return null;

  return (
    <ThemedView
      level="tertiary"
      style={{
        width: size + 8,
        height: size + 8,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FontAwesome6
        name={config.name}
        size={size * 0.8}
        color={config.color}
      />
    </ThemedView>
  );
};
