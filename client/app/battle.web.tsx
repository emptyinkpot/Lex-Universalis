import React from 'react';
import { View } from 'react-native';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/commonjs/web';
import { ThemedText } from '@/components/ThemedText';

export default function BattleRouteWeb() {
  return (
    <WithSkiaWeb
      fallback={
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ThemedText variant="bodyMedium">正在加载战斗特效...</ThemedText>
        </View>
      }
      getComponent={() => import('@/screens/battle')}
    />
  );
}
