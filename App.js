import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import HomePage from './HomePage';
import MoodPage from './MoodPage';
import ScreenTimePage from './ScreenTimePage';
import StepCountPage from './StepCountPage';
import RecommendationPage from './RecommendationPage';
import ProfilePage from './ProfilePage';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import { DeviceEventEmitter } from "react-native";

import GoogleFit, {Scopes} from 'react-native-google-fit';

const firebaseConfig = {
  apiKey: "AIzaSyCAPQLVsvywtLHZ9HnTYj3Zo035qW7V50o",
  authDomain: "ics125-2195d.firebaseapp.com",
  databaseURL: "https://ics125-2195d-default-rtdb.firebaseio.com",
  projectId: "ics125-2195d",
  storageBucket: "ics125-2195d.appspot.com",
  messagingSenderId: "725039446313",
  appId: "1:725039446313:web:204f968972cf91e2d05f38",
  measurementId: "G-PE9XRKBTVR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

const Stack = createStackNavigator();

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  var [dailySteps, setdailySteps] = useState(0);
  var [heartRate, setHeartRate] = useState(0);
  var [calories, setCalories] = useState(0);
  var [hydration, setHydration] = useState(0);
  var [sleep, setSleep] = useState(0);
  var [weight, setWeight] = useState(0);
  var [bloodPressure, setBloodPressure] = useState({});
  var [loading, setLoading] = useState(true);

  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_ACTIVITY_WRITE,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_BODY_WRITE,
      Scopes.FITNESS_BLOOD_PRESSURE_READ,
      Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
      Scopes.FITNESS_BLOOD_GLUCOSE_READ,
      Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
      Scopes.FITNESS_NUTRITION_WRITE,
      Scopes.FITNESS_SLEEP_READ,
    ],
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        console.log('User is logged in:', user.uid);
        setLoggedIn(true);
      } else {
        // User is logged out
        console.log('User is logged out');
        setLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  GoogleFit.checkIsAuthorized().then(() => {
    var authorized = GoogleFit.isAuthorized;
    console.log(authorized);
    if (authorized) {
      // if already authorized, fetch data
    } else {
      // Authentication if already not authorized for a particular device
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            console.log('AUTH_SUCCESS');

            // if successfully authorized, fetch data
          } else {
            console.log('AUTH_DENIED ' + authResult.message);
          }
        })
        .catch(() => {
          dispatch('AUTH_ERROR');
        });
    }
  });

  async function saveData(profileInfo) {
    console.log('Called function from Profile Page');

    try {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const userRef = ref(database, `userinfo/${userId}`);

        await update(userRef, profileInfo);
        console.log('User record updated successfully');
      } else {
        console.error('No user is currently logged in');
      }
    } catch (error) {
      console.error('Error updating user record:', error);
    }
  }

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener("OnSaveInfo", (eventData) =>
      saveData(eventData)
    );

    return () => {
      listener.remove();
    };
  }, []);

  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {loggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="MoodPage" component={MoodPage} />
            <Stack.Screen name="ScreenTimePage" component={ScreenTimePage} />
            <Stack.Screen name="StepCountPage" component={StepCountPage} />
            <Stack.Screen name="RecommendationPage" component={RecommendationPage} />
            <Stack.Screen name="ProfilePage" component={ProfilePage} />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {() => (
              <View style={styles.container}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <Button
                  title="Login"
                  onPress={handleLogin}
                  style={styles.button}
                />
              </View>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 8,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 8,
  },
});

export default App;
