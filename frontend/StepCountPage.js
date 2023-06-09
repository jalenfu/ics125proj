import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';
import GoogleFit from 'react-native-google-fit';

const StepCountPage = () => {
  const [stepcountlast24hours, setStepCountLast24Hours] = useState(0);
  const [stepcountlast7days, setStepCountLast7Days] = useState([5025, 8070, 6234, 4182, 4302, 5102, 6302]);
  const totalStepCount = stepcountlast7days.reduce((sum, steps) => sum + steps, 0);
  const [dailyStepCount, setDailyStepCount] = useState([0]);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const last24HoursDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      
      const options = {
        startDate: last24HoursDate.toISOString(),
        endDate: today.toISOString(),
        bucketUnit: 'DAY',
        bucketInterval: 1,
      };

      try {
        const res = await GoogleFit.getDailyStepCountSamples(options);
        if (res.length !== 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].source === 'com.google.android.gms:estimated_steps') {
              const data = res[i].steps.reverse();
              setDailyStepCount(data[0].value);
              break;
            }
          }
        } else {
          console.log('Not Found');
        }
      } catch (error) {
        console.log('Error retrieving step count:', error);
      }
    };

    fetchData();
  }, []);

  DeviceEventEmitter.emit('OnSaveInfo', {
    StepCount: stepcountlast7days,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Count Today</Text>
      <Text style={styles.stepCount}>{dailyStepCount} steps</Text>

      <Text style={styles.title}>Step Count Last 7 Days</Text>
      <View style={styles.barGraph}>
        {stepcountlast7days.map((steps, index) => (
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
  stepCount: {
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
  barContainer: {
    alignItems: 'center',
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
