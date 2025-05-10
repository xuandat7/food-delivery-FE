import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Search from '../../components/common/Search';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = (props) => {
  const navigation = useNavigation();
  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantView', { restaurant });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Search {...props} onRestaurantPress={handleRestaurantPress} />
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