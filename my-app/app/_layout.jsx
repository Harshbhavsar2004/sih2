import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from "../context/AuthContext"; // Import AuthProvider

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{
            headerShown: false,
          }}/>
          <Stack.Screen name="login/Phone" options={{
            headerShown: false,
          }}/>
          <Stack.Screen name="login/[mobileNumber]" options={{
            headerShown: false,
          }}/>
          <Stack.Screen name="(tabs)" options={{
            headerShown: false
          }}/>
          <Stack.Screen name="Trips/index" options={{
              headerShown: false
            }}/>
            <Stack.Screen name="Handover/index" options={{
              headerShown: false
            }}/>
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}