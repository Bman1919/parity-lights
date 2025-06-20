// GameScreen.jsx

import { Dimensions, View } from 'react-native';
import Grid from './Grid';

export default function GameScreen({ navigation, settings }) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Use default values if none provided
  const width = settings?.width ?? 5;
  const height = settings?.height ?? 5;
  const pattern = settings?.pattern ?? [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Grid
        width={width}
        height={height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        pattern={pattern}
        navigation={navigation}
      />
    </View>
  );
}
