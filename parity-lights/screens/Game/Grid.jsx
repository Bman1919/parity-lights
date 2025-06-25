import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Animated, Vibration, Button } from 'react-native';

export default function Grid({
  width,
  height,
  screenWidth,
  pattern,
  navigation,
  sandbox = false,
}) {
  const cellSize = Math.floor((screenWidth - 4 - (width - 1)) / width);

  const [gridData, setGridData] = useState(
    Array.from({ length: height }, () => Array.from({ length: width }, () => false))
  );

  const [subGrid] = useState(() =>
    Array.from({ length: height }, () => Array.from({ length: width }, () => Math.random() < 0.5))
  );

  const animatedScales = useRef(
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Animated.Value(1))
    )
  ).current;

  const animatedRotations = useRef(
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Animated.Value(0))
    )
  ).current;

  const centerRow = Math.floor(height / 2);
  const centerCol = Math.floor(width / 2);

  useEffect(() => {
    if (sandbox) return;
    const temp = gridData.map(r => [...r]);
    subGrid.forEach((row, r) => {
      row.forEach((v, c) => {
        if (v) {
          toggleAt(r, c, temp);
          for (const [dy, dx] of pattern) toggleAt(r + dy, c + dx, temp);
        }
      });
    });
    setGridData(temp);
  }, []);

  const toggleAt = (row, col, grid) => {
    const r = (row + height) % height;
    const c = (col + width) % width;
    grid[r][c] = !grid[r][c];
  };

  const handlePress = (row, col) => {
    const newGrid = gridData.map(r => [...r]);

    if (sandbox) {
      newGrid[row][col] = !newGrid[row][col];
    } else {
      toggleAt(row, col, newGrid);
      for (const [dy, dx] of pattern) toggleAt(row + dy, col + dx, newGrid);
    }

    setGridData(newGrid);

    if (!sandbox) {
      setTimeout(() => {
        if (newGrid.every(row => row.every(cell => !cell))) {
          Vibration.vibrate(300);
          startVictoryAnimation();
        }
      }, 10);
    }
  };

  const startVictoryAnimation = async () => {
    const animations = [];
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const dx = c - centerCol;
        const dy = r - centerRow;
        const delay = Math.sqrt(dx * dx + dy * dy) * 75;

        animations.push(
          new Promise(resolve => {
            setTimeout(() => {
              Animated.parallel([
                Animated.timing(animatedScales[r][c], {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(animatedRotations[r][c], {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ]).start(() => resolve());
            }, delay);
          })
        );
      }
    }

    await Promise.all(animations);
    navigation.navigate('Home');
  };

  const clearGrid = () => {
    setGridData(
      Array.from({ length: height }, () => Array.from({ length: width }, () => false))
    );
  };

  const randomizeGrid = () => {
    setGridData(
      Array.from({ length: height }, () =>
        Array.from({ length: width }, () => Math.random() < 0.5)
      )
    );
  };

  return (
    <View style={{ backgroundColor: 'black', alignItems: 'center' }}>
      {sandbox && (
        <View style={{ flexDirection: 'row', marginVertical: 8 }}>
          <Button title="Clear" onPress={clearGrid} color="#888" />
          <View style={{ width: 16 }} />
          <Button title="Randomize" onPress={randomizeGrid} color="#888" />
        </View>
      )}
      {gridData.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {row.map((cell, c) => {
            const rotate = animatedRotations[r][c].interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            });

            return (
              <Animated.View
                key={`${r}-${c}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  margin: 0.5,
                  transform: [{ scale: animatedScales[r][c] }, { rotate }],
                }}
              >
                <Pressable
                  onPress={() => handlePress(r, c)}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: cell ? 'white' : 'black',
                  }}
                />
              </Animated.View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
