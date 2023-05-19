import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomePage from './HomePage';
import MoodPage from './MoodPage';
import ScreenTimePage from './ScreenTimePage';
import StepCountPage from './StepCountPage';
import RecommendationPage from './RecommendationPage';
import ProfilePage from './ProfilePage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="MoodPage" component={MoodPage} />
        <Stack.Screen name="ScreenTimePage" component={ScreenTimePage} />
        <Stack.Screen name="StepCountPage" component={StepCountPage} />
        <Stack.Screen name="RecommendationPage" component={RecommendationPage} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
