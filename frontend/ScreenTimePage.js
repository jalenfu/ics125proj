import React from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';

const ScreenTimePage = () => {
  // Mock screen time data
  const screenTimeLast7Days = [3, 5, 6, 4, 4, 5, 6]; // Array of screen time values for the last 7 days
  const screenTimeToday = screenTimeLast7Days[6]+" hours";
  const totalScreenTime = screenTimeLast7Days.reduce((sum, time) => sum + time, 0);

  DeviceEventEmitter.emit("OnSaveInfo", {
    ScreenTime: screenTimeLast7Days
  });
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen Time Today</Text>
      <Text style={styles.screenTime}>{screenTimeToday}</Text>

      <Text style={styles.title}>Screen Time Last 7 Days</Text>
      <View style={styles.barGraph}>
        {screenTimeLast7Days.map((time, index) => (
          <View key={index} style={[styles.barContainer]}>
            <View style={[styles.bar, { height: (time / totalScreenTime) * 3000 + '%' }]} />
            <Text style={styles.timeText}>{time} hrs</Text>
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
  timeText: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default ScreenTimePage;
