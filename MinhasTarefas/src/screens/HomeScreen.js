import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Senac 2025! 🚀</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tasks')}>
        <Text style={styles.buttonText}>Ver Minhas Tarefas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#F7941D'
  },
  button: {
    backgroundColor: '#004A8D',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
