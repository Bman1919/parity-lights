import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';

const CELL_SIZE = 40;

export default function CustomPatternScreen({ navigation, route }) {
  const [size, setSize] = useState(3);
  const [grid, setGrid] = useState(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => false))
  );

  const toggleCell = (row, col) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = !newGrid[row][col];
    setGrid(newGrid);
  };

  const updateGridSize = newSize => {
    setSize(newSize);
    setGrid(
      Array.from({ length: newSize }, () =>
        Array.from({ length: newSize }, () => false)
      )
    );
  };

  const savePattern = () => {
    const mid = Math.floor(size / 2);
    const pattern = [];

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && !(x === mid && y === mid)) {
          pattern.push([y - mid, x - mid]);
        }
      });
    });

    if (route.params?.onSave) {
      route.params.onSave(pattern);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Custom Pattern</Text>

      <View style={styles.gridContainer}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <Pressable
                key={colIndex}
                onPress={() => toggleCell(rowIndex, colIndex)}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell ? '#0f0' : '#111',
                    borderColor:
                      rowIndex === Math.floor(size / 2) &&
                      colIndex === Math.floor(size / 2)
                        ? '#f00'
                        : '#333',
                  },
                ]}
              />
            ))}
          </View>
        ))}
        <Text style={styles.centerLabel}>(Red cell is the center)</Text>
      </View>

      <Text style={styles.label}>Pattern Size</Text>
      <View style={styles.sizeSelectorRow}>
        {[3, 5, 7].map(item => (
          <Pressable
            key={item}
            onPress={() => updateGridSize(item)}
            style={[
              styles.sizeButton,
              item === size && styles.sizeButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.sizeButtonText,
                item === size && { color: '#000', fontWeight: 'bold' },
              ]}
            >
              {item}×{item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.saveButton} onPress={savePattern}>
        <Text style={styles.saveButtonText}>Save Pattern</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#0f0',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  gridContainer: {
    marginVertical: 16,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#0f0',
    padding: 6,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 2,
    margin: 2,
  },
  centerLabel: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  label: {
    color: '#0f0',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 24,
  },
  sizeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sizeButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#0f0',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
  },
  sizeButtonSelected: {
    backgroundColor: '#0f0',
  },
  sizeButtonText: {
    color: '#0f0',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#1f1',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#0f0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
