import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter, NativeModules, TouchableOpacity } from 'react-native';

import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const { ScreenTimeModule } = NativeModules;

const ScreenTimePage = () => {
  ScreenTimeModule.checkAndRequestUsageStatsPermission();

  // Mock screen time data
  const [screenTimeLast7Days, setScreenTimePastWeek] = useState([0, 0, 0, 0, 0, 0, 0]); // Array of screen time values for the last 7 days
  const [firebaseScreenTimeLast7Days, setFirebaseScreenTimePastWeek] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [screenTimeToday, setScreenTimeToday] = useState('');

  const fetchData = async () => {
    ScreenTimeModule.getDailyScreenTime((screenTimeMinutes) => {
      const todayScreenTime = `${screenTimeMinutes.screenTime} minutes`;
      console.log(todayScreenTime);
      setScreenTimeToday(todayScreenTime);
    });

    ScreenTimeModule.getPastWeekScreenTime((screenTimeArray) => {
      const normalizedScreenTime = screenTimeArray.map((time) => time.screenTime);
      console.log(normalizedScreenTime);
      setFirebaseScreenTimePastWeek(normalizedScreenTime); // Update only the last 7 values
    });
  };

  useEffect(() => {
    fetchData();

    const auth = getAuth();
    const database = getDatabase();
    const user = auth.currentUser;
    const userId = user.uid;
    return onValue(ref(database, `userinfo/${userId}`), querySnapShot => {
      let data = querySnapShot.val() || {ScreenTime: []};
      if ("ScreenTime" in data) {
        setScreenTimePastWeek(data.ScreenTime);
      }
    });
  }, []);

  const totalScreenTime = screenTimeLast7Days.reduce((sum, time) => sum + time, 0);

  const refreshPage = async () => {
    await fetchData();
    
    DeviceEventEmitter.emit("OnSaveInfo", {
      ScreenTime: firebaseScreenTimeLast7Days
    });

    const auth = getAuth();
    const database = getDatabase();
    const user = auth.currentUser;
    const userId = user.uid;
    return onValue(ref(database, `userinfo/${userId}`), querySnapShot => {
      let data = querySnapShot.val() || {ScreenTime: []};
      if ("ScreenTime" in data) {
        setScreenTimePastWeek(data.ScreenTime);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={refreshPage} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Screen Time Today</Text>
      <Text style={styles.screenTime}>{screenTimeToday}</Text>

      <Text style={styles.title}>Screen Time Last 7 Days</Text>
      <View style={styles.barGraph}>
        {screenTimeLast7Days.map((time, index) => (
          <View key={index} style={[styles.barContainer]}>
            <View style={[styles.bar, { height: (time / totalScreenTime) * 150 + '%' }]} />
            <Text style={styles.timeText}>{time} mins</Text>
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
  refreshButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScreenTimePage;
