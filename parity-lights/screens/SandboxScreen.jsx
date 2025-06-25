import React from 'react';
import { View, Dimensions } from 'react-native';
import Grid from './Game/Grid';

export default function SandboxScreen({ settings }) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const gridWidth = settings?.width ?? 5;
  const gridHeight = settings?.height ?? 5;

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Grid
        width={gridWidth}
        height={gridHeight}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        pattern={[]}
        navigation={{ navigate: () => {} }} // dummy nav
        sandbox={true}
      />
    </View>
  );
}
