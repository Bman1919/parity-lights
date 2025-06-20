import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Animated, Vibration, Dimensions } from 'react-native';

export default function Grid({ width, height, screenWidth, pattern, navigation }) {
  const cellSize = Math.floor((screenWidth - 4 - (width - 1)) / width);

  const [gridData, setGridData] = useState(
    Array.from({ length: height }, () => Array.from({ length: width }, () => false))
  );

  const [subGrid] = useState(() =>
    Array.from({ length: height }, () => Array.from({ length: width }, () => Math.random() < 0.5))
  );

  const animatedValues = useRef(
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Animated.ValueXY({ x: 0, y: 0 }))
    )
  ).current;

  const [visibleCells, setVisibleCells] = useState(
    Array.from({ length: height }, () => Array.from({ length: width }, () => true))
  );

  const centerRow = Math.floor(height / 2);
  const centerCol = Math.floor(width / 2);

  useEffect(() => {
    // Initialize grid from subGrid
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
    toggleAt(row, col, newGrid);
    for (const [dy, dx] of pattern) toggleAt(row + dy, col + dx, newGrid);
    setGridData(newGrid);

    setTimeout(() => {
      if (newGrid.every(row => row.every(cell => !cell))) {
        Vibration.vibrate(300);
        startFold();
      }
    }, 10);
  };

  const startFold = async () => {
    let curTop = 0,
      curBottom = height - 1,
      curLeft = 0,
      curRight = width - 1;

    while (curTop < curBottom || curLeft < curRight) {
      const promises = [];

      // Left -> Right
      if (curLeft < curRight) {
        for (let r = curTop; r <= curBottom; r++) {
          for (let c = curLeft; c < Math.floor((curLeft + curRight + 1) / 2); c++) {
            const mirrorCol = curRight - (c - curLeft);
            promises.push(
              animateAndHide(r, c, mirrorCol - c, 0)
            );
          }
        }
        curLeft = Math.floor((curLeft + curRight + 1) / 2);
        await Promise.all(promises);
      }

      // Top -> Bottom
      if (curTop < curBottom) {
        const promises = [];
        for (let c = curLeft; c <= curRight; c++) {
          for (let r = curTop; r < Math.floor((curTop + curBottom + 1) / 2); r++) {
            const mirrorRow = curBottom - (r - curTop);
            promises.push(
              animateAndHide(r, c, 0, mirrorRow - r)
            );
          }
        }
        curTop = Math.floor((curTop + curBottom + 1) / 2);
        await Promise.all(promises);
      }

      // Right -> Left
      if (curLeft < curRight) {
        const promises = [];
        for (let r = curTop; r <= curBottom; r++) {
          for (let c = curRight; c > Math.floor((curLeft + curRight) / 2); c--) {
            const mirrorCol = curLeft + (curRight - c);
            promises.push(
              animateAndHide(r, c, mirrorCol - c, 0)
            );
          }
        }
        curRight = Math.floor((curLeft + curRight) / 2);
        await Promise.all(promises);
      }

      // Bottom -> Top
      if (curTop < curBottom) {
        const promises = [];
        for (let c = curLeft; c <= curRight; c++) {
          for (let r = curBottom; r > Math.floor((curTop + curBottom) / 2); r--) {
            const mirrorRow = curTop + (curBottom - r);
            promises.push(
              animateAndHide(r, c, 0, mirrorRow - r)
            );
          }
        }
        curBottom = Math.floor((curTop + curBottom) / 2);
        await Promise.all(promises);
      }
    }

    // Blink center cell
    const blinkCell = animatedValues[centerRow][centerCol];
    Animated.sequence([
      Animated.timing(blinkCell, {
        toValue: { x: 0, y: 0 }, duration: 150, useNativeDriver: true
      }),
      Animated.timing(blinkCell, {
        toValue: { x: 0, y: 0 }, duration: 150, useNativeDriver: true
      }),
    ]).start(() => navigation.navigate('Home'));
  };

  const animateAndHide = (row, col, dx, dy) => {
    return new Promise(resolve => {
      Animated.timing(animatedValues[row][col], {
        toValue: { x: dx * cellSize, y: dy * cellSize },
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setVisibleCells(prev => {
          const newVis = prev.map(r => [...r]);
          newVis[row][col] = false;
          return newVis;
        });
        resolve();
      });
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
          {row.map((cell, colIndex) => {
            if (!visibleCells[rowIndex][colIndex]) return null;
            return (
              <Animated.View
                key={colIndex}
                style={{
                  transform: animatedValues[rowIndex][colIndex].getTranslateTransform(),
                }}
              >
                <Pressable
                  onPress={() => handlePress(rowIndex, colIndex)}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    margin: 0.5,
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
