/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import styles from './src/styles';

export default class tutorial extends Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.box}></View>
        </View>
    );
  }
}

AppRegistry.registerComponent('tutorial', () => tutorial);
