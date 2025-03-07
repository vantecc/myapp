import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, 
  Keyboard, TouchableWithoutFeedback, useColorScheme 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TaskListScreen() {
  const theme = useColorScheme();
  const isDarkMode = theme === 'dark';

  // Aplicando os estilos de acordo com o tema
  const styles = getStyles(isDarkMode);

  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingTask, setEditingTask] = useState(null);

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

  useEffect(() => {
    loadTasksFromStorage();
  }, []);

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
      <View style={styles.container}>
        <Text style={styles.title}>Minhas Tarefas 📝</Text>

        <TouchableOpacity style={styles.clearButton} onPress={clearAllTasks}>
          <Text style={styles.clearButtonText}>🗑️ Limpar Tudo</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Adicionar ou editar tarefa..."
            value={taskInput}
            onChangeText={setTaskInput}
            placeholderTextColor={isDarkMode ? '#bbb' : '#888'} // Corrige a cor do placeholder
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Icon name={editingTask ? 'save' : 'add'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item.text}</Text>
              <View style={styles.taskButtons}>
                <TouchableOpacity onPress={() => editTask(item)} style={styles.editButton}>
                  <Icon name="edit" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeTask(item.id)} style={styles.deleteButton}>
                  <Icon name="delete" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

// **Estilos adaptáveis ao modo escuro**
const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, 
    backgroundColor: isDarkMode ? '#121212' : '#f4f4f4',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: isDarkMode ? '#fff' : '#333',
  },
  clearButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: isDarkMode ? '#333' : '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, 
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 0,
    backgroundColor: isDarkMode ? '#444' : '#fff',
    paddingHorizontal: 10,
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#333',
  },
  addButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#333' : '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskText: {
    fontSize: 18,
    color: isDarkMode ? '#fff' : '#333',
  },
  taskButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#ffa500',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
