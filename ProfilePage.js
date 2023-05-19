import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ProfilePage = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');

  const handleSave = () => {
    // Needs save logic
    console.log('Height:', height);
    console.log('Weight:', weight);
    console.log('Age:', age);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Height:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter height"
        value={height}
        onChangeText={text => setHeight(text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Weight:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter weight"
        value={weight}
        onChangeText={text => setWeight(text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter age"
        value={age}
        onChangeText={text => setAge(text)}
        keyboardType="numeric"
      />

      <Button title="Save" onPress={handleSave} />
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
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ProfilePage;
