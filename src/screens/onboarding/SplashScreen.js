import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const SplashScreen = ({ navigation }) => {
  // Animation values
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.5);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to next screen after 2 seconds
    const timer = setTimeout(() => {
      // You would replace 'Home' with your actual next screen
      // navigation.navigate('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          {/* Logo Text Part */}
          <View style={styles.textContainer}>
            <Text style={styles.logoF}>F</Text>
            
            {/* First 'o' */}
            <View style={styles.oContainer}>
              <View style={styles.o1}></View>
            </View>
            
            {/* Second 'o' */}
            <View style={styles.oContainer}>
              <View style={styles.o2}></View>
            </View>
            
            <Text style={styles.logoD}>d</Text>
          </View>
          
          {/* Orange dome/dish cover */}
          <View style={styles.domeCover}>
            <View style={styles.domeHandle}></View>
          </View>
          
          {/* Bottom lines */}
          <View style={styles.bottomLine1}></View>
          <View style={styles.bottomLine2}></View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
  },
  logoF: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginRight: 2,
  },
  oContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  o1: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: COLORS.secondary,
  },
  o2: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: COLORS.secondary,
  },
  logoD: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginLeft: 2,
  },
  domeCover: {
    position: 'absolute',
    top: -10,
    left: 35,
    width: 50,
    height: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: COLORS.primary,
    zIndex: -1,
  },
  domeHandle: {
    position: 'absolute',
    top: -5,
    left: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  bottomLine1: {
    position: 'absolute',
    bottom: 0,
    left: 30,
    width: 20,
    height: 2,
    backgroundColor: COLORS.lightGray,
  },
  bottomLine2: {
    position: 'absolute',
    bottom: 0,
    left: 60,
    width: 20,
    height: 2,
    backgroundColor: COLORS.lightGray,
  },
});

export default SplashScreen; 