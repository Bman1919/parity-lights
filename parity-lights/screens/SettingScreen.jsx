import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';

const patterns = [
  {
    name: 'Cross',
    value: [
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 0],
    ],
  },
  {
    name: 'X',
    value: [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ],
  },
  {
    name: 'Plus & Diag',
    value: [
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 0],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ],
  },
];

const CELL_SIZE = 20;

export default function SettingScreen({ navigation, setSettings, settings }) {
    const [width, setWidth] = useState(settings?.width || 5);
    const [height, setHeight] = useState(settings?.height || 5);
    const [patternIndex, setPatternIndex] = useState(() => {
        const index = patterns.findIndex(p =>
            JSON.stringify(p.value) === JSON.stringify(settings?.pattern)
        );
        return index !== -1 ? index : 0;
    });

    const [customPattern, setCustomPattern] = useState(null);


  const screenWidth = Dimensions.get('window').width;

  const renderGridPreview = () => {
    const rows = [];
    for (let r = 0; r < height; r++) {
      const cols = [];
      for (let c = 0; c < width; c++) {
        cols.push(
          <View
            key={c}
            style={[
              styles.cell,
              { backgroundColor: (r + c) % 2 === 0 ? '#0f0' : '#050' },
            ]}
          />
        );
      }
      rows.push(
        <View key={r} style={{ flexDirection: 'row' }}>
          {cols}
        </View>
      );
    }
    return (
      <View
        style={{
          borderWidth: 2,
          borderColor: '#0f0',
          padding: 4,
          marginVertical: 12,
          alignSelf: 'center',
          backgroundColor: '#000',
        }}
      >
        {rows}
      </View>
    );
  };

const handleSave = () => {
  setSettings({
    width,
    height,
    pattern: customPattern ?? patterns[patternIndex].value,
  });
  navigation.navigate('Home');
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingGroup}>
        <Text style={styles.label}>Grid Width: {width}</Text>
        <Slider
          minimumValue={3}
          maximumValue={10}
          step={1}
          value={width}
          minimumTrackTintColor="#0f0"
          maximumTrackTintColor="#050"
          thumbTintColor="#0f0"
          onValueChange={val => setWidth(val)}
          style={{ width: screenWidth * 0.8 }}
        />
      </View>

      <View style={styles.settingGroup}>
        <Text style={styles.label}>Grid Height: {height}</Text>
        <Slider
          minimumValue={3}
          maximumValue={10}
          step={1}
          value={height}
          minimumTrackTintColor="#0f0"
          maximumTrackTintColor="#050"
          thumbTintColor="#0f0"
          onValueChange={val => setHeight(val)}
          style={{ width: screenWidth * 0.8 }}
        />
      </View>

      <Text style={[styles.label, { marginTop: 20 }]}>Grid Preview</Text>
      {renderGridPreview()}

      <Text style={[styles.label, { marginTop: 20 }]}>Toggle Pattern</Text>
      <FlatList
        data={patterns}
        keyExtractor={item => item.name}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => setPatternIndex(index)}
            style={[
              styles.patternButton,
              patternIndex === index && styles.patternButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.patternButtonText,
                patternIndex === index && { fontWeight: 'bold' },
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
      />
      <Pressable
  onPress={() =>
    navigation.navigate('CustomPattern', {
      onSave: (newPattern) => {
        setPatternIndex(-1);
        setCustomPattern(newPattern);
      },
    })
  }
  style={styles.customButton}
>
  <Text style={styles.customButtonText}>Create Custom Pattern</Text>
</Pressable>


      <Pressable onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save & Return</Text>
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
    fontSize: 32,
    color: '#0f0',
    fontWeight: 'bold',
    marginBottom: 24,
    textShadowColor: '#0f0',
    textShadowRadius: 8,
  },
  settingGroup: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    color: '#0f0',
    fontSize: 18,
    marginBottom: 8,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
    margin: 1,
  },
  customButton: {
  marginTop: 20,
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderColor: '#0f0',
  borderWidth: 1,
  borderRadius: 8,
},
customButtonText: {
  color: '#0f0',
  fontSize: 16,
  textAlign: 'center',
},

  patternButton: {
    borderWidth: 1,
    borderColor: '#0f0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    height: 40,
    justifyContent: 'center',  // Vertical centering
  },
  patternButtonSelected: {
    backgroundColor: '#030',
  },
  patternButtonText: {
    color: '#0f0',
  },
saveButton: {
    marginTop: 20, // Was 40, reduce to raise
    marginBottom: 24, // Add some bottom spacing
    backgroundColor: '#1f1',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: '#0f0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
},
  saveButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
