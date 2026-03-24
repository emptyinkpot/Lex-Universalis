import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthProvider } from "@/contexts/AuthContext";
import { ColorSchemeProvider } from '@/hooks/useColorScheme';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
  // Add other noisy logs here if needed.
]);

export default function RootLayout() {
  return (
    <AuthProvider>
      <ColorSchemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="dark"></StatusBar>
          <Stack screenOptions={{
            // 设置所有页面的切换动画为从右侧滑入，适用于iOS �?Android
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            // Hide the built-in header
            headerShown: false
          }}>
            <Stack.Screen name="index" options={{ title: "" }} />
            <Stack.Screen name="campaign" options={{ title: "战役模式" }} />
            <Stack.Screen name="scenario-detail" options={{ title: "剧本详情" }} />
            <Stack.Screen name="campaign-detail" options={{ title: "关卡详情" }} />
            <Stack.Screen name="deck-builder" options={{ title: "卡组编辑" }} />
            <Stack.Screen name="battle" options={{ title: "战斗" }} />
            <Stack.Screen name="theme-settings" options={{ title: "主题设置" }} />
            <Stack.Screen name="card-editor" options={{ title: "���Ʊ༭��" }} />
          </Stack>
          <Toast />
        </GestureHandlerRootView>
      </ColorSchemeProvider>
    </AuthProvider>
  );
}
