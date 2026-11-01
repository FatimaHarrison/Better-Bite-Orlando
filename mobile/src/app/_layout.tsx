import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
    Stack,
} from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from "@/components/animated-icon";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const colorScheme = useColorScheme();

    return (
        <ThemeProvider
         value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
         >

            <AnimatedSplashOverlay />

            <Stack>

                {/* Main application tabs */}
                <Stack.Screen 
                name="(tabs)"
                options={{
                     headerShown: false,
                      }}
                 />

                 {/* Healthy Restaurants screen    */}
                 <Stack.Screen 
                 name="healthy-restaurants"
                 options={{
                    title: "Healthy Restaurants",
                    headerTintColor: "#3D622C",
                    headerStyle: {
                        backgroundColor: "#F4ECE5",
                        },  
                    }}
                 />

            </Stack>
            
        </ThemeProvider>
    );
}