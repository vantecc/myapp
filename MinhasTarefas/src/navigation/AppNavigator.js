import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TaskListScreen from '../screens/TaskListScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tasks" component={TaskListScreen} />
    </Stack.Navigator>
    </NavigationContainer>
);
}
