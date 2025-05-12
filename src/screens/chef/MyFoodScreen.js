import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  Image,
  StyleSheet,
  StatusBar
} from 'react-native';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const FoodItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.foodItem} onPress={() => onPress(item)}>
      <View style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <View style={styles.foodHeader}>
          <Text style={styles.foodName}>{item.name}</Text>
          <TouchableOpacity style={styles.moreIcon}>
            <Feather name="more-vertical" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price}</Text>
        </View>
        
        <View style={styles.reviewRow}>
          <FontAwesome name="star" size={14} color="#FB6D3A" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviews} Review)</Text>
          <Text style={styles.pickupText}>Pick UP</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MyFoodScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];
  
  const foodItems = [
    {
      id: '1',
      name: 'Chicken Thai Biriyani',
      category: 'Breakfast',
      price: '60',
      rating: '4.9',
      reviews: '10'
    },
    {
      id: '2',
      name: 'Chicken Bhuna',
      category: 'Breakfast',
      price: '30',
      rating: '4.9',
      reviews: '10'
    },
    {
      id: '3',
      name: 'Mazalichiken Halim',
      category: 'Breakfast',
      price: '25',
      rating: '4.9',
      reviews: '10'
    }
  ];
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFoodItemPress = (foodItem) => {
    navigation.navigate('ChefFoodDetails', { foodItem });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>My Food List</Text>
      </View>
      
      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity 
            key={category}
            onPress={() => handleCategorySelect(category)}
            style={styles.categoryTab}
          >
            <Text 
              style={[
                styles.categoryTitle,
                selectedCategory === category && styles.selectedCategoryTitle
              ]}
            >
              {category}
            </Text>
            {selectedCategory === category && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Item Count */}
      <Text style={styles.itemCount}>Total 03 items</Text>
      
      {/* Food List */}
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FoodItem item={item} onPress={handleFoodItemPress} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 50,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#ECF0F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 17,
    color: '#181C2E',
    marginLeft: 16,
    fontWeight: '400',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F8FA',
    position: 'relative',
  },
  categoryTab: {
    marginRight: 40,
    paddingBottom: 10,
    position: 'relative',
  },
  categoryTitle: {
    fontSize: 14,
    color: '#32343E',
    fontWeight: '400',
  },
  selectedCategoryTitle: {
    color: '#FB6D3A',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FB6D3A',
    width: 47,
    marginLeft: -10,
  },
  itemCount: {
    fontSize: 14,
    color: '#9B9BA5',
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 12,
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingBottom: 120, // Extra space for bottom tab
  },
  foodItem: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 102,
  },
  foodImage: {
    width: 102,
    height: 102,
    borderRadius: 20,
    backgroundColor: '#98A8B8',
  },
  foodInfo: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#32343E',
  },
  moreIcon: {
    padding: 4,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 118, 33, 0.2)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#FF7621',
    fontSize: 13.7,
  },
  priceRow: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  price: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#32343E',
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13.7,
    fontWeight: '700',
    color: '#FB6D3A',
    marginLeft: 4,
    marginRight: 10,
  },
  reviewCount: {
    fontSize: 13.7,
    color: '#AFAFAF',
    flex: 1,
  },
  pickupText: {
    fontSize: 13.6,
    color: '#AFAFAF',
    textAlign: 'right',
  },
});

export default MyFoodScreen;