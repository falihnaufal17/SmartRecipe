import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Splash from './Splash';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import { useAuth } from '../contexts/Auth';
import About from './About';
import Preview from './Preview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="HomeStack" component={Home} />
      <Stack.Screen name="PreviewStack" component={Preview} />
    </Stack.Navigator>
  )
}

function TabNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'About') {
            iconName = focused
              ? 'information'
              : 'information-outline';
          }

          return <Icon name={iconName} size={20} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="About" component={About} />
    </Tab.Navigator>
  )
}

function AuthNav() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  )
}

export default function Screen() {

  const { authData, loading } = useAuth()

  if (loading) {
    return <Splash />
  } else {
    return (
      <NavigationContainer>
        {authData ? <TabNav /> : <AuthNav />}
      </NavigationContainer>
    );
  }
}