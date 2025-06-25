import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/Game/GameScreen';
import SettingScreen from './screens/SettingScreen';
import CustomPatternScreen from './screens/CustomPatternScreen';
import SandboxScreen from './screens/SandboxScreen.jsx';

const Stack = createNativeStackNavigator();

export default function App() {
  const [settings, setSettings] = useState({});

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game">
          {props => <GameScreen {...props} settings={settings} />}
        </Stack.Screen>        
        <Stack.Screen name="Settings">
          {props => <SettingScreen {...props} setSettings={setSettings} settings={settings} />}
        </Stack.Screen>
        <Stack.Screen name="CustomPattern" component={CustomPatternScreen} />
        <Stack.Screen name="Sandbox" component={SandboxScreen} settings={settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
