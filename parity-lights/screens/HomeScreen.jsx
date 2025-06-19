// screens/HomeScreen.jsx
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ background: "#000", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Parity Lights!</Text>
        <Button title="Start" onPress={() => navigation.navigate('Game')} />
    </View>
  );
}
