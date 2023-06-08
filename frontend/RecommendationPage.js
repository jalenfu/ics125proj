import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const RecommendationPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const database = getDatabase();
      const userRef = ref(database, `userinfo/${userId}`);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserData(data);
      });
    } else {
      console.log('No user is currently logged in');
    }
  }, []);

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Text style={styles.pageText}>Height: {userData.Height}</Text>
          <Text style={styles.pageText}>Weight: {userData.Weight}</Text>
        </>
      ) : (
        <Text style={styles.pageText}>Loading user data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RecommendationPage;
