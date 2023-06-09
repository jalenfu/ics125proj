import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const RecommendationPage = () => {
  const [userData, setUserData] = useState(null);
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const database = getDatabase();
      const userRef = ref(database, `userinfo/${userId}`);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const avgMood = data.Moods ? data.Moods.reduce((acc, val) => acc + val) / data.Moods.length : 0;
          const avgScreenTime = data.ScreenTime ? data.ScreenTime.reduce((acc, val) => acc + val) / data.ScreenTime.length : 0;
          const avgStepCount = data.StepCount ? data.StepCount.reduce((acc, val) => acc + val) / data.StepCount.length : 0;

          const moodStatus = avgMood > 7 ? 'very healthy' : avgMood > 5 ? 'normal' : 'unhealthy';
          const screenTimeStatus = avgScreenTime > 360 ? 'unhealthy' : avgScreenTime > 120 ? 'normal' : 'very healthy';
          const stepCountStatus = avgStepCount > 6000 ? 'very healthy' : avgStepCount > 3000 ? 'normal' : 'unhealthy';

          const recommendation = `${moodStatus}_${screenTimeStatus}_${stepCountStatus}`;

          switch (recommendation) {
            case 'very healthy_very healthy_very healthy':
              setRecommendation('You are doing an excellent job maintaining your health!');
              break;
            case 'very healthy_very healthy_normal':
              setRecommendation('Keep up the good work. Just increase your step count a bit more. Try to add '
              + Math.round(6000-avgStepCount) + ' more steps to your daily routine.');
              break;
            case 'very healthy_very healthy_unhealthy':
              setRecommendation('Your mood and screen time are great, but you need to move more. Try to add '
              + Math.round(3000-avgStepCount) + ' more steps to your daily routine.');
              break;
            case 'very healthy_normal_very healthy':
              setRecommendation('Try to spend ' + Math.round(avgScreenTime-120) + ' less minutes a day on screens for better health.');
              break;
            case 'very healthy_normal_normal':
              setRecommendation('Try to reduce screen time by ' + Math.round(avgScreenTime-120) + 
              ' minutes and increase activity by ' + Math.round(6000-avgStepCount) + 
              ' more steps a day.');
              break;
            case 'very healthy_normal_unhealthy':
              setRecommendation('Your mood is great, but decrease screen time by ' + Math.round(avgScreenTime-120) + 
              ' minutes and increase steps by ' + Math.round(3000-avgStepCount) + ' a day.');
              break;
            case 'very healthy_unhealthy_very healthy':
              setRecommendation('Reduce screen time drastically by ' + Math.round(avgScreenTime-360) + ' minutes a day but good job on the mood and steps!');
              break;
            case 'very healthy_unhealthy_normal':
              setRecommendation('You need to drastically cut down your screen time by ' 
              + Math.round(avgScreenTime-360) + ' minutes and increase steps by ' + 6000-avgStepCount+' steps a day.');
              break;
            case 'very healthy_unhealthy_unhealthy':
              setRecommendation('Reduce screen time drastically by ' + Math.round(avgScreenTime-360) 
              + ' minutes and you need to increase activity by '+Math.round(3000-avgStepCount) + ' steps a day.');
              break;
            case 'normal_very healthy_very healthy':
              setRecommendation('Great screen time and steps, but try to improve your daily mood by socializing and trying out new hobbies.');
              break;
            case 'normal_very healthy_normal':
              setRecommendation('Your screen time and steps are good, but you need to work on your mood and move a bit more. Try decreasing screen time by '
              + Math.round(avgScreenTime-120) + ' minutes and increasing step count by '+ Math.round(6000-avgStepCount) + ' steps a day.');
              break;
            case 'normal_very healthy_unhealthy':
              setRecommendation('Improve your mood by socializing and trying new hobbies and increase your steps by ' + Math.round(3000-avgStepCount) + ' steps a day.');
              break;
            case 'normal_normal_very healthy':
              setRecommendation('Try to spend less time on screens by ' + Math.round(avgScreenTime-120) 
              + ' minutes and improve your mood by socializing and trying out new hobbies.');
              break;
            case 'normal_normal_normal':
              setRecommendation('Everything is average. Aim for improvement in all areas. Try increasing step count by '
              + Math.round(6000-avgStepCount) + ' steps and spend less time on screens by ' + Math.round(avgScreenTime-120) + ' minutes a day.');
              break;
            case 'normal_normal_unhealthy':
              setRecommendation('Your mood and screen time are decent. Try to put down the phone and increase step count by ' +
              Math.round(3000-avgStepCount) + ' steps a day which may increase your mood.');
              break;
            case 'normal_unhealthy_very healthy':
              setRecommendation('Great on steps, but cut down screen time by ' + Math.round(avgScreenTime-120) + ' minutes a day which may improve your mood.');
              break;
            case 'normal_unhealthy_normal':
              setRecommendation('Reduce your screen time by ' + Math.round(avgScreenTime-120) + ' minutes a day which may improve your mood.');
              break;
            case 'normal_unhealthy_unhealthy':
              setRecommendation('You need to cut down on screen time by ' + Math.round(avgScreenTime-120) 
              + ' minutes a day and increase steps by ' + Math.round(3000-avgStepCount) + ' steps a day and you may see a significant increase in your mood.');
              break;
            case 'unhealthy_very healthy_very healthy':
              setRecommendation('Great screen time and steps but your mood needs improvement. Maybe try socializing with new people or trying out new hobbies. We suggest seeing a licensed therapist for more info.');
              break;
            case 'unhealthy_very healthy_normal':
              setRecommendation('Good on screen time but try to increase steps by ' + Math.round(6000-avgStepCount) + ' steps a day which might improve your mood.');
              break;
            case 'unhealthy_very healthy_unhealthy':
              setRecommendation('Screen time is great but try increasing steps by ' + Math.round(3000-avgStepCount) + 
              ' steps a day. Walking extra steps has been shown to significantly improve mood and standard of life');
              break;
            case 'unhealthy_normal_very healthy':
              setRecommendation('Good on steps but try decreasing screen time by ' + Math.round(avgScreenTime-120) 
              + ' minutes a day. Studies show that too much screen time is detrimental to your mood.');
              break;
            case 'unhealthy_normal_normal':
              setRecommendation('Everything is average except your mood. Work on improving your mood by increasing steps by ' 
              + Math.round(6000-avgStepCount) + 'steps and decrease screen time by ' + Math.round(avgScreenTime-120) + ' minutes a day.');
              break;
            case 'unhealthy_normal_unhealthy':
              setRecommendation('You need to work on your mood by increasing steps by ' + Math.round(3000-avgStepCount) + 
              ' steps a day. Walking extra steps has been shown to significantly improve mood and standard of life');
              break;
            case 'unhealthy_unhealthy_very healthy':
              setRecommendation('Great on steps but your mood and screen time are unhealthy. Try decreasing screen time by ' + 
              avgScreenTime-120 + ' minutes a day.');
              break;
            case 'unhealthy_unhealthy_normal':
              setRecommendation('Good job on the steps but you need to work on your mood and cut down screen time by ' + 
              avgScreenTime-120 + ' minutes a day.');
              break;
            case 'unhealthy_unhealthy_unhealthy':
              setRecommendation('Your health status is alarming. Please contact a health professional.');
              break;
            default:
              setRecommendation('Unable to provide recommendations at this time.');
          }
        }

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
          <Text style={styles.pageText}>Recommendation: {recommendation}</Text>
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