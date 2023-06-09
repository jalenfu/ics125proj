import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import GoogleFit from 'react-native-google-fit';

import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const StepCountPage = () => {
  const [stepcountlast24hours, setStepCountLast24Hours] = useState(0);
  const [stepcountlast7days, setStepCountLast7Days] = useState([]);
  const [uploadStepsToFirebase, setUploadStepsToFirebase] = useState([])
  const totalStepCount = stepcountlast7days.reduce((sum, steps) => sum + steps, 0);
  const [dailyStepCount, setDailyStepCount] = useState([0]);

  useEffect(() => {
    fetchData();

    const auth = getAuth();
    const database = getDatabase();
    const user = auth.currentUser;
    const userId = user.uid;
    return onValue(ref(database, `userinfo/${userId}`), querySnapShot => {
      let data = querySnapShot.val() || {StepCount: []};
      if ("StepCount" in data) {
        setStepCountLast7Days(data.StepCount);
      }
    });
  }, []);

  const fetchData = async () => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    startOf8DaysAgo = new Date();
    startOf8DaysAgo.setDate(startOf8DaysAgo.getDate() - 8);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    const options = {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
      bucketUnit: 'MINUTE',
      bucketInterval: 1,
    };

    try {
      const res = await GoogleFit.getDailyStepCountSamples(options);
      if (res.length !== 0) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].source === 'com.google.android.gms:estimated_steps') {
            const data = res[i].steps.reverse();
            if (data[0] != null){
              setDailyStepCount(data[0].value);
            } else {
              setDailyStepCount(0);
            }
            
            break;
          }
        }
      } else {
        console.log('Not Found');
      }
    } catch (error) {
      console.log('Error retrieving step count:', error);
    }

    const pastSevenDays = [];
    
    for (let i = 0; i < 7; i++) {
      startOf8DaysAgo.setDate(startOf8DaysAgo.getDate() + 1);
      pastSevenDays.push(new Date(startOf8DaysAgo));
    }
    console.log(pastSevenDays)
    const stepCountData = [];
    
    for (const date of pastSevenDays) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const weekOptions = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        bucketUnit: 'MINUTE',
        bucketInterval: 1,
      };

      try {
        const stepCount = await GoogleFit.getDailyStepCountSamples(weekOptions);
        if (stepCount.length !== 0) {
          for (let i = 0; i < stepCount.length; i++) {
            if (stepCount[i].source === 'com.google.android.gms:estimated_steps') {
              const data = stepCount[i].steps.reverse();
              if (data[0] != null){
                stepCountData.push(data[0].value);
              } else {
                stepCountData.push(0);
              }
              break;
            }
          }
        } else {
          console.log('Not Found');
        }
      } catch (error) {
        console.log('Error retrieving step count:', error);
      }
    }
    console.log(stepCountData);
    setUploadStepsToFirebase(stepCountData);
  };

  const handleRefresh = () => {
    fetchData();
    if(uploadStepsToFirebase.length > 0){
      uploadDataToFirebase();
    }

    const auth = getAuth();
    const database = getDatabase();
    const user = auth.currentUser;
    const userId = user.uid;
    return onValue(ref(database, `userinfo/${userId}`), querySnapShot => {
      let data = querySnapShot.val() || {StepCount: []};
      if ("StepCount" in data) {
        setStepCountLast7Days(data.StepCount);
      }
    });
  };

  const uploadDataToFirebase = () => {
    // Code to upload the last 7 days data to Firebase
    // Replace this with your Firebase upload logic
    DeviceEventEmitter.emit('OnSaveInfo', {
      StepCount: uploadStepsToFirebase,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Count Today</Text>
      <Text style={styles.stepCount}>{dailyStepCount} steps</Text>

      <Text style={styles.title}>Step Count Last 7 Days</Text>
      <View style={styles.barGraph}>
        {stepcountlast7days.map((steps, index) => (
          <View key={index} style={[styles.barContainer]}>
            <View
              style={[styles.bar, { height: (steps / totalStepCount) * 75 + '%' }]}
            />
            <Text style={styles.stepText}>{steps}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
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
  refreshButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default StepCountPage;
