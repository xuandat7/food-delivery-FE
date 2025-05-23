import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Animated,
  FlatList,
  Image
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const flatListRef = useRef(null);
  
  const slides = [
    {
      id: '1',
      title: 'Tất cả món ăn yêu thích',
      description: 'Đặt tất cả các món ăn bạn yêu thích ở một nơi,\nbạn chỉ cần đặt hàng, chúng tôi sẽ lo phần còn lại',
      image: require('../../../assets/images/onboarding/food_favorites.png')
    },
    {
      id: '2',
      title: 'Ưu đãi giao hàng miễn phí',
      description: 'Giao hàng miễn phí cho khách hàng mới qua thẻ tín dụng',
      image: require('../../../assets/images/onboarding/free_delivery.png')
    },
    {
      id: '3',
      title: 'Giao hàng nhanh chóng',
      description: 'Nhận đồ ăn của bạn trong vòng chưa đầy 30 phút',
      image: require('../../../assets/images/onboarding/fast_delivery.png')
    },
    {
      id: '4',
      title: 'Thanh toán dễ dàng',
      description: 'Thanh toán đồ ăn bằng thẻ tín dụng, Apple Pay, hoặc tiền mặt',
      image: require('../../../assets/images/onboarding/easy_payment.png')
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
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    // Skip onboarding
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      // Đặt firstLaunch vào AsyncStorage khi người dùng hoàn thành onboarding
      await AsyncStorage.setItem('firstLaunch', 'false');
      console.log('Onboarding completed, firstLaunch set to false in storage');
      // Navigate to Auth stack instead of using onComplete callback
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error saving firstLaunch value:', error);
      navigation.navigate('Auth');
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slideContainer}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {typeof item.image === 'string' ? (
            <View style={styles.imagePlaceholder} />
          ) : (
            <Image 
              source={item.image} 
              style={styles.image}
              resizeMode="contain"
            />
          )}
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
          <Text style={styles.buttonText}>TIẾP THEO</Text>
        </View>
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.skipText}>Bỏ qua</Text>
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
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
    height: 280,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.buttonRadius,
  },
  imagePlaceholder: {
    width: 240,
    height: 240,
    backgroundColor: COLORS.placeholderImage,
    borderRadius: SIZES.buttonRadius,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.secondary,
    marginTop: 40,
    textAlign: 'center',
  },
  description: {
    fontSize: SIZES.large,
    lineHeight: 24,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
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