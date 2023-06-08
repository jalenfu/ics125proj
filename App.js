import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomePage from './HomePage';
import MoodPage from './MoodPage';
import ScreenTimePage from './ScreenTimePage';
import StepCountPage from './StepCountPage';
import RecommendationPage from './RecommendationPage';
import ProfilePage from './ProfilePage';

import {DeviceEventEmitter} from "react-native"

DeviceEventEmitter.addListener("OnSaveInfo", (eventData) => 
saveData(eventData));

const Stack = createStackNavigator();

async function saveData(profileinfo){
  console.log("Called function from Profile Page");
  const response = await fetch(
    `https://ics125-2195d-default-rtdb.firebaseio.com/userinfo.json`,
    {
      method: "POST", 
      body: JSON.stringify(
        {
          profileinfo
        }
      )
    }
  )
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="MoodPage" component={MoodPage} />
        <Stack.Screen name="ScreenTimePage" component={ScreenTimePage} />
        <Stack.Screen name="StepCountPage" component={StepCountPage} />
        <Stack.Screen name="RecommendationPage" component={RecommendationPage} />
        <Stack.Screen name="ProfilePage" component={ProfilePage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
