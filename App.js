import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ResultScreen from './src/screens/ResultScreen';
import DrawScreen from './src/screens/DrawScreen';
import ApiKeyScreen from './src/screens/ApiKeyScreen';
import { getApiKey } from './src/services/apiKeyService';
import { COLORS } from './src/constants/theme';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [hasKey, setHasKey] = useState(null);

  useEffect(() => {
    getApiKey().then((key) => setHasKey(!!key));
  }, []);

  if (hasKey === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.gradientStart }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={hasKey ? 'Home' : 'ApiKey'}
    >
      <Stack.Screen
        name="ApiKey"
        component={ApiKeyScreen}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
      />
      <Stack.Screen
        name="Draw"
        component={DrawScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
