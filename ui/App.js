/**
 * Jarvis — App Entry Point
 * Expo SDK 51+ / React Native 0.74+
 *
 * Sets up:
 *  - Navigation container (native stack)
 *  - Gesture handler root
 *  - Font loading (Inter)
 *  - Splash screen hide on ready
 */

import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer }    from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen          from 'expo-splash-screen';
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import MainScreen    from './ui/screens/MainScreen';
import { Colors }   from './ui/theme';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

// ─── Minimal nav theme ────────────────────────────────────────────────────────
const NavTheme = {
  dark: true,
  colors: {
    primary:    Colors.accent.blue,
    background: Colors.bg.primary,
    card:       Colors.bg.elevated,
    text:       Colors.text.primary,
    border:     Colors.ui.divider,
    notification: Colors.accent.violet,
  },
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={NavTheme}>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown:         false,
            animation:           'fade_from_bottom',
            contentStyle:        { backgroundColor: Colors.bg.primary },
            gestureEnabled:       true,
            fullScreenGestureEnabled: true,
          }}
        >
          <Stack.Screen name="Main" component={MainScreen} />
          {/* Add Settings / History screens here */}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
