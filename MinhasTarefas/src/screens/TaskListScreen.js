import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, 
  Keyboard, TouchableWithoutFeedback, Animated, Easing 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TaskListScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadTasksFromStorage();
    Animated.timing(fadeAnim, {
      toValue: 2,
      duration: 1400,
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
  }, []);

  const saveTasksToStorage = async (tasks) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  const loadTasksFromStorage = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const addTask = () => {
    if (taskInput.trim() === '') return;
    let updatedTasks;
    if (editingTask) {
      updatedTasks = tasks.map(task => (task.id === editingTask.id ? { ...task, text: taskInput } : task));
      setEditingTask(null);
    } else {
      updatedTasks = [...tasks, { id: Date.now().toString(), text: taskInput }];
    }
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    setTaskInput('');
  };

  const removeTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const clearAllTasks = async () => {
    await AsyncStorage.removeItem('@tasks');
    setTasks([]);
  };

  const editTask = (task) => {
    setTaskInput(task.text);
    setEditingTask(task);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        
        <View style={styles.header}>
          <Text style={styles.headerText}>Minhas Tarefas</Text>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={clearAllTasks}>
          <Text style={styles.clearButtonText}>🗑️ Limpar Tudo</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Adicionar uma nova tarefa..."
            value={taskInput}
            onChangeText={setTaskInput}
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Icon name={editingTask ? 'save' : 'add'} size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <View style={styles.taskIcon}>
                <Icon name="check-circle" size={24} color="#6200ee" />
              </View>
              <Text style={styles.taskText}>{item.text}</Text>
              <View style={styles.taskButtons}>
                <TouchableOpacity onPress={() => editTask(item)} style={styles.editButton}>
                  <Icon name="edit" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeTask(item.id)} style={styles.deleteButton}>
                  <Icon name="delete" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDC180',
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  header: {
    backgroundColor: '#004A8D',
    paddingVertical: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  clearButton: {
    backgroundColor: '#f7941d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 20,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#004A8D',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskIcon: {
    marginRight: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F7941D',
  },
  taskButtons: {
    flexDirection: 'row',
    gap: 7,
  },
  editButton: {
    backgroundColor: '#F7941D',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

