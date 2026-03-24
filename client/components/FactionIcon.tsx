import React from 'react';
import { View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { FACTION_ICONS, FactionKey } from '@/constants/icons';

interface FactionIconProps {
  faction: FactionKey;
  size?: number;
  showBackground?: boolean;
}

export const FactionIcon: React.FC<FactionIconProps> = ({
  faction,
  size = 48,
  showBackground = true
}) => {
  const config = FACTION_ICONS[faction];

  if (!config) return null;

  return (
    <View style={{ width: size, height: size }}>
      {showBackground ? (
        <ThemedView
          level="tertiary"
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: config.color,
          }}
        >
          <FontAwesome6
            name={config.name}
            size={size * 0.5}
            color={config.color}
          />
        </ThemedView>
      ) : (
        <FontAwesome6
          name={config.name}
          size={size}
          color={config.color}
        />
      )}
    </View>
  );
};
