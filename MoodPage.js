import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MoodPage = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelect = value => {
    setSelectedValue(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>

      <View style={styles.barGraph}>
        <View style={styles.bar} />
        <View style={styles.bar} />
        <View style={styles.bar} />
        {/* Mock bars */}
      </View>

      <View style={styles.barContainer}>
        {[...Array(11)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.bar,
              selectedValue === index && styles.selectedBar,
            ]}
            onPress={() => handleSelect(index)}
          >
            <Text style={styles.barLabel}>{index}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  barGraph: {
    width: '100%',
    height: 200,
    backgroundColor: '#f2f2f2',
    marginBottom: 20,
    flexDirection: 'row',
  },
  bar: {
    flex: 1,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 2,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  selectedBar: {
    backgroundColor: '#2196F3',
  },
  barLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default MoodPage;
