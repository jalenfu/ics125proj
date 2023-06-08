import React from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';

const StepCountPage = () => {
  // Mock screen time data
  const stepcountlast7days = [5025, 8070, 6234, 4182, 4302, 5102, 6302]; // Array of screen time values for the last 7 days
  // const stepcounttoday = stepcountlast7days[6]+" steps";
  const totalStepCount = stepcountlast7days.reduce((sum, steps) => sum + steps, 0);

  DeviceEventEmitter.emit("OnSaveInfo", {
    StepCount: stepcountlast7days
  });
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Count Today</Text>
      <Text style={styles.stepCount}>{stepcountlast7days[6]} steps</Text>

      <Text style={styles.title}>Step Count Last 7 Days</Text>
      <View style={styles.barGraph}>
        {stepcountlast7days.map((steps, index) => (
          <View key={index} style={[styles.barContainer]}>
            <View
              style={[styles.bar, { height: (steps / totalStepCount) * 2000 + '%' }]}
            />
            <Text style={styles.stepText}>{steps}</Text>
          </View>
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
    marginBottom: 10,
  },
  screenTime: {
    fontSize: 18,
    marginBottom: 20,
  },
  barGraph: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  bar: {
    width: 20,
    backgroundColor: '#2196F3',
  },
  stepText: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default StepCountPage;