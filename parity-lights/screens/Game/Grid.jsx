import React, { useState } from 'react';
import { View, Pressable } from 'react-native';

export default function Grid({ width, height, screenWidth, pattern }) {
  const cellSize = Math.floor((screenWidth - 4 - (width - 1)) / width);
  
  // Initialize grid with random booleans
  const [gridData, setGridData] = useState(() =>
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => Math.random() < 0.5)
    )
  );

  const toggleAt = (row, col, grid) => {
    // Wrap around (torus logic)
    const r = (row + height) % height;
    const c = (col + width) % width;
    grid[r][c] = !grid[r][c];
  };

  const handlePress = (row, col) => {
    setGridData(prev => {
      const newGrid = prev.map(r => [...r]); // deep copy

      // Always toggle self
      toggleAt(row, col, newGrid);

      // Toggle pattern neighbors
      for (const [dy, dx] of pattern) {
        toggleAt(row + dy, col + dx, newGrid);
      }

      return newGrid;
    });
  };

  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: 'white',
        padding: 1,
        backgroundColor: 'white',
      }}
    >
      {gridData.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row' }}>
          {row.map((cell, colIndex) => (
            <Pressable
              key={colIndex}
              onPress={() => handlePress(rowIndex, colIndex)}
              style={{
                width: cellSize,
                height: cellSize,
                margin: 0.5,
                backgroundColor: cell ? 'white' : 'black',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
