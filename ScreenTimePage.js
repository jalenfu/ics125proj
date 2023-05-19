import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScreenTimePage = () => {
  // Mock screen time data
  const screenTimeToday = '4 hours 30 minutes';
  const screenTimeLast7Days = [3, 5, 6, 4, 4, 5, 6]; // Array of screen time values for the last 7 days

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen Time Today</Text>
      <Text style={styles.screenTime}>{screenTimeToday}</Text>

      <Text style={styles.title}>Screen Time Last 7 Days</Text>
      <View style={styles.barGraph}>
        {screenTimeLast7Days.map((time, index) => (
          <View
            key={index}
            style={[styles.bar, { height: time * 20 }]}
          ></View>
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
});

export default ScreenTimePage;
