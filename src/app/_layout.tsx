import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DriveProvider } from "../context/DriveContext";
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  return (
    <DriveProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown:     false,
          contentStyle:    { backgroundColor: COLORS.bg },
          animation:       'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="summary"                                  />
        <Stack.Screen name="detail"                                   />
      </Stack>
    </DriveProvider>
  );
}
