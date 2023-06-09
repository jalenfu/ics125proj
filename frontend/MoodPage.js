import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter } from 'react-native';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

const MoodPage = () => {
  const [moodArray, setMoodArray] = useState([]);
  const [moodLast7Days, setMoodLast7Days] = useState([]);

  async function handleSelect(value){
    const updatedMoodArray = [...moodArray, value];
    if (updatedMoodArray.length > 7) {
      updatedMoodArray.shift(); // Remove the first element if the array size exceeds 7
    }
    DeviceEventEmitter.emit("OnSaveInfo", {
      Moods : updatedMoodArray
    });
    setMoodArray(updatedMoodArray);

  };

  React.useEffect(() => {
    const auth = getAuth();
    const database = getDatabase();
    const user = auth.currentUser;
    const userId = user.uid;
    return onValue(ref(database, `userinfo/${userId}`), querySnapShot => {
      let data = querySnapShot.val() || {Moods: []};
      if ("Moods" in data) {
        setMoodArray(data.Moods);
        setMoodLast7Days(data.Moods);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>

      <View style={styles.barGraph}>
        {moodLast7Days.map((mood, index) => (
          <View key={index} style={[styles.barContainer]}>
            <View
              style={[styles.bar_7day, { height: mood * 20 }]}
            />
            <Text style={styles.moodText}>{mood}</Text>
          </View>
        ))}
      </View>

      <View style={styles.barContainer_moodArray}>
        {[...Array(11)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.bar,
              moodArray[moodArray.length - 1] === index && styles.selectedBar,
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
    justifyContent: 'space-evenly',
  },
  bar: {
    flex: 1,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 2,
  },
  bar_7day: {
    width: 20,
    backgroundColor: '#2196F3',
  },
  barContainer_moodArray: {
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
  moodText: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default MoodPage;
