import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const iconBack = require('../../../assets/icon-back.png');

const FilterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={iconBack} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Filter</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Filter options go here...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    height: 45,
  },
  backBtn: {
    backgroundColor: '#ecf0f4',
    borderRadius: 22.5,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 18,
    color: '#bfc5d2',
  },
});

export default FilterScreen; 