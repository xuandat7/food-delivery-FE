import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Search from '../../components/common/Search';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = (props) => {
  const navigation = useNavigation();
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantView', { id: restaurant.id });
  };
  
  const handleFoodPress = (food) => {
    navigation.navigate('FoodDetails', { food });
  };
  
  const handleKeywordPress = (keyword) => {
    navigation.navigate('FoodSearch', { keyword });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Search 
        {...props} 
        onBack={handleBack}
        onRestaurantPress={handleRestaurantPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SearchScreen;
