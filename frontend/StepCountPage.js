import React from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';

const StepCountPage = () => {
  // Mock step count data
  const stepCountLast7Days = [5025, 8070, 6234, 4182, 4302, 5102, 6302]; // Array of step count values for the last 7 days
  // const stepCountToday = stepCountLast7Days[6]+" steps";
  const totalStepCount = stepCountLast7Days.reduce((sum, steps) => sum + steps, 0);

  DeviceEventEmitter.emit("OnSaveInfo", {
    StepCount: stepCountLast7Days
  });
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Count Today</Text>
      <Text style={styles.stepCount}>{stepCountLast7Days[6]} steps</Text>

      <Text style={styles.title}>Step Count Last 7 Days</Text>
      <View style={styles.barGraph}>
        {stepCountLast7Days.map((steps, index) => (
          <View key={index} style={[styles.barContainer]}>
            <View
              style={[styles.bar, { height: (steps / totalStepCount) * 300 + '%' }]}
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