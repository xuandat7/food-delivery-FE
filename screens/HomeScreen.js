import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { COLORS, SIZES } from './styles';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food App</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Food App!</Text>
        <Text style={styles.subText}>
          This is a placeholder for your home screen. You'll be replacing this with your design from Figma.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 60,
    paddingHorizontal: SIZES.padding,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  welcomeText: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: SIZES.margin,
    textAlign: 'center',
  },
  subText: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HomeScreen; 