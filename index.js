/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

const Clarifai = require('clarifai');
 
const app = new Clarifai.App({
 apiKey: '594573956c5841468cfa9ab0fc99d9b6'
});

AppRegistry.registerComponent(appName, () => App);
