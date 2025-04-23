import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Animated,
  FlatList
} from 'react-native';
import { COLORS, SIZES } from './styles';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const flatListRef = useRef(null);
  
  const slides = [
    {
      id: '1',
      title: 'All your favorites',
      description: 'Get all your loved foods in one once place,\nyou just place the orer we do the rest',
      image: 'placeholder'
    },
    {
      id: '2',
      title: 'Free delivery offers',
      description: 'Free delivery for new customers via credit cards',
      image: 'placeholder'
    },
    {
      id: '3',
      title: 'Quick Delivery',
      description: 'Get your food delivered in less than 30 minutes',
      image: 'placeholder'
    },
    {
      id: '4',
      title: 'Easy Payment',
      description: 'Pay for your food with credit card, Apple Pay, or cash',
      image: 'placeholder'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentSlide + 1,
        animated: true
      });
    } else {
      // We've reached the end of the slides
      onComplete();
    }
  };

  const handleSkip = () => {
    // Skip onboarding
    onComplete();
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slideContainer}>
        {/* Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.image} />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {item.title}
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          {item.description}
        </Text>
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index !== currentSlide) {
      setCurrentSlide(index);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScroll}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: index === currentSlide ? COLORS.dotActive : COLORS.dotInactive }
            ]}
            onPress={() => {
              flatListRef.current.scrollToIndex({
                index,
                animated: true
              });
            }}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>NEXT</Text>
        </View>
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  slideContainer: {
    width,
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 114,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 240,
    height: 292,
    backgroundColor: COLORS.placeholderImage,
    borderRadius: SIZES.buttonRadius,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.secondary,
    marginTop: 62,
    textAlign: 'center',
  },
  description: {
    fontSize: SIZES.large,
    lineHeight: 24,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 23,
    paddingHorizontal: 25,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  button: {
    marginTop: 40,
    width: 327,
    height: 62,
    borderRadius: SIZES.buttonRadius,
    backgroundColor: COLORS.primaryButton,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  skipText: {
    fontSize: SIZES.large,
    color: COLORS.textSecondary,
    marginTop: 15,
  },
});

export default OnboardingScreen; 