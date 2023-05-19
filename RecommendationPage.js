import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecommendationPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.pageText}>Recommendation Page Placeholder</Text>
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
