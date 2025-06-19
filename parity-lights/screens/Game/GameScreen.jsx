import { Dimensions, View } from 'react-native';
import Grid from './Grid';

export default function App() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Grid width={5} height={5} screenWidth={screenWidth} screenHeight={screenHeight} pattern={[[0,1],[-1,0],[0,-1],[1,0]]} />
    </View>
  );
}