import { View, Text, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        position: 'relative',
      }}
    >
      <StatusBar style="light" />

      {/* Settings button top-right */}
      <Pressable
        onPress={() => navigation.navigate('Settings')}
        style={({ pressed }) => ({
          position: 'absolute',
          top: 40,
          right: 20,
          padding: 10,
          borderRadius: 8,
          backgroundColor: pressed ? '#0f0' : 'transparent',
          shadowColor: '#0f0',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: pressed ? 0.9 : 0.6,
          shadowRadius: 8,
        })}
      >
        <Text style={{ color: '#0f0', fontWeight: 'bold', fontSize: 16 }}>Settings</Text>
      </Pressable>

      <Text
        style={{
          color: 'white',
          fontSize: 36,
          fontWeight: 'bold',
          marginBottom: 20,
          textShadowColor: '#0f0',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 8,
        }}
      >
        Parity Lights
      </Text>

      <Pressable
        onPress={() => navigation.navigate('Game')}
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#0f0' : '#1f1',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          shadowColor: '#0f0',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 10,
        })}
      >
        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Start Game</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('Sandbox')}
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#0f0' : '#1f1',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          shadowColor: '#0f0',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 10,
        })}
      >
        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Sandbox</Text>
      </Pressable>
    </View>
  );
}
