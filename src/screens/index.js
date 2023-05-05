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
import Recipe from './Recipe';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function ScreenStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="HomeStack" component={HomeTab} />
      <Stack.Screen name="RecipeStack" component={Recipe} />
      <Stack.Screen name="PreviewStack" component={Preview} />
    </Stack.Navigator>
  )
}

function HomeTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'AboutTab') {
            iconName = focused
              ? 'information'
              : 'information-outline';
          }

          return <Icon name={iconName} size={20} color={color} />;
        }
      })}
    >
      <Tab.Screen name="HomeTab" component={Home} />
      <Tab.Screen name="AboutTab" component={About} />
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
        {authData ? <ScreenStack /> : <AuthNav />}
      </NavigationContainer>
    );
  }
}