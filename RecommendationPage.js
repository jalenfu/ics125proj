import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const RecommendationPage = () => {
  const [userData, setUserData] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const recommendationScores = {};

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

          let goalSteps = 0;
          if (parseInt(data.Age) > 65) {
            goalSteps = 6000
          } else {
            goalSteps = 10000
          }

          if (avgStepCount > goalSteps - 1000) {
            recommendationScores['stepCount'] = 0.1;
          } else if (avgStepCount > goalSteps - 4000) {
            recommendationScores['stepCount'] = 0.2;
          } else {
            recommendationScores['stepCount'] = 0.3;
          }

          if (avgMood > 6) {
            recommendationScores['mood'] = 0.1;
          } else if (avgMood > 3 ) {
            recommendationScores['mood'] = 0.2;
          } else {
            recommendationScores['mood'] = 0.3;
          }

          if (avgScreenTime > 360) {
            recommendationScores['screenTime'] = 0.1;
          } else if (avgScreenTime > 120) {
            recommendationScores['screenTime'] = 0.2;
          } else {
            recommendationScores['screenTime'] = 0.3;
          }

          let highestScoringRecommendation = '';
          let highestScore = 0;
          for (const [recommendation, score] of Object.entries(recommendationScores)) {
            if (score > highestScore) {
              highestScoringRecommendation = recommendation;
              highestScore = score;
            }
          }

          if (highestScoringRecommendation == 'stepCount') {
            switch(highestScore) {
              case 0.3:
                setRecommendation('You should get more physical activity in. Try adding '
                + Math.round((goalSteps - avgStepCount - 4000) / 7) + ' more steps to your daily routine.');
                break;
              case 0.2:
                setRecommendation('Nice. Keep up the good work. Try fitting in '
                + Math.round((goalSteps - avgStepCount) / 7) + ' more steps to your daily routine.');
                break;
              default:
                setRecommendation("You're pretty healthy. Consider treating yourself!");
            }
          }

          if (highestScoringRecommendation == 'mood') {
            switch(highestScore) {
              case 0.3:
                setRecommendation("You've been down in the dumps lately. Try to give yourself some \
                free time and indulge in your favorite thing!");
                break;
              case 0.2:
                setRecommendation("Your mood's been OK lately. Try to work in some yoga or a few \
                quick meditation sessions to add some more balance to your life.");
                break;
              default:
                setRecommendation("You're pretty healthy. Consider treating yourself!");
            }
          }

          if (highestScoringRecommendation == 'screenTime') {
            switch(highestScore) {
              case 0.3:
                setRecommendation("Chill with the devices! Try some other activities to reduce your daily\
                 screen time down " + Math.round(avgScreenTime - 360) + 'minutes.');
                break;
              case 0.2:
                setRecommendation("Your screen time's not looking too bad. Maybe try a new hobby \
                to reduce your daily screen time by another " + Math.round(avgScreenTime - 120) + 'minutes.');
                break;
              default:
                setRecommendation("You're pretty healthy. Consider treating yourself!");
            }
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
          <Text style={styles.pageText}>Height: {userData.Height} cm</Text>
          <Text style={styles.pageText}>Weight: {userData.Weight} lbs</Text>
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