import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Splash from './Splash';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import { useAuth } from '../contexts/Auth';
import Account from './Account';
import Preview from './Preview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Recipe from './Recipe';
import Store from './Store';
import RecipeList from './RecipeList';
import Bookmark from './Bookmark';

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
      <Stack.Screen name="RecipeListStack" component={RecipeList} />
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
              ? 'clipboard-text-search'
              : 'clipboard-text-search-outline';
          } else if (route.name === 'StoreTab') {
            iconName = focused ? 'store-search' : 'store-search-outline'
          } else if (route.name === 'AccountTab') {
            iconName = focused
              ? 'account-circle'
              : 'account-circle-outline';
          } else if (route.name === 'BookmarkTab') {
            iconName = focused
              ? 'bookmark-multiple'
              : 'bookmark-multiple-outline';
          }

          return <Icon name={iconName} size={20} color={color} />;
        }
      })}
    >
      <Tab.Screen name="HomeTab" options={{title: 'Cari Resep'}} component={Home} />
      <Tab.Screen name="StoreTab" options={{title: 'Cari Toko Terdekat'}} component={Store} />
      <Tab.Screen name="BookmarkTab" options={{title: 'Riwayat Resep'}} component={Bookmark} />
      <Tab.Screen name="AccountTab" options={{title: 'Akun'}} component={Account} />
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