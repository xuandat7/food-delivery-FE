import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation, useIsFocused, CommonActions  } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants/colors';


const IngredientItem = ({ name, icon, isAllergy }) => {
  return (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientCircle}>
        <View style={styles.iconWrapper}>
          {icon}
        </View>
      </View>
      <Text style={styles.ingredientName}>
        {name}
        {isAllergy && <Text style={styles.allergyText}>{"\n"}(Allergy)</Text>}
      </Text>
    </View>
  );
};

const ChefFoodDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  // Get the food item data passed from the previous screen
  const { foodItem } = route.params;
  const [activeTab, setActiveTab] = useState('menu');
  const isFocused = useIsFocused();

  useEffect(() => {
      if (isFocused) {
        setActiveTab('menu');
      }
    }, [isFocused]);
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  const handleEditPress = () => {
    // Navigate to edit screen with the food item data
    // This functionality can be implemented later
    console.log('Edit button pressed');
  };

  // Navigation handlers for bottom tab bar
  const navigateToDashboard = () => {
    navigation.navigate('SellerDashboard');
  };

  const navigateToFoodList = () => {
    navigation.navigate('MyFoodScreen');
  };

  const navigateToAddNewItem = () => {
    navigation.navigate('AddNewItemsScreen');
  };

  const navigateToRunningOrders = () => {
    navigation.navigate('RunningOrdersScreen');
  };

  const handleTabPress = (tabName) => {
      setActiveTab(tabName);
      if (tabName === 'home') {
        // Use navigate and reset to prevent adding new instances to the stack
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'SellerDashboard' }],
          })
        );
      } else if (tabName === 'add') {
        // Navigate to add new items screen
        navigation.dispatch(
          CommonActions.navigate({
            name: 'AddNewItemsScreen'
          })
        );
      }
      // Implement other tab navigations as needed
    };

  // Mock ingredients data (would come from API in a real app)
  const ingredients = [
    { id: '1', name: 'Salt', icon: <MaterialCommunityIcons name="shaker-outline" size={20} color={COLORS.primary} /> },
    { id: '2', name: 'Chicken', icon: <MaterialCommunityIcons name="food-drumstick-outline" size={20} color={COLORS.primary} /> },
    { id: '3', name: 'Onion', icon: <MaterialCommunityIcons name="food-apple-outline" size={20} color={COLORS.primary} />, isAllergy: true },
    { id: '4', name: 'Garlic', icon: <MaterialCommunityIcons name="food-variant" size={20} color={COLORS.primary} /> },
    { id: '5', name: 'Peppers', icon: <MaterialCommunityIcons name="chili-mild" size={20} color={COLORS.primary} />, isAllergy: true },
    { id: '6', name: 'Ginger', icon: <MaterialCommunityIcons name="food-apple" size={20} color={COLORS.primary} /> },
    { id: '7', name: 'Broccoli', icon: <MaterialCommunityIcons name="food-croissant" size={20} color={COLORS.primary} /> },
    { id: '8', name: 'Orange', icon: <MaterialCommunityIcons name="fruit-citrus" size={20} color={COLORS.primary} /> },
    { id: '9', name: 'Walnut', icon: <MaterialCommunityIcons name="food-nut" size={20} color={COLORS.primary} /> }
  ];

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
        <Text style={styles.pageTitle}>Food Details</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditPress}
        >
          <Text style={styles.editButtonText}>EDIT</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Food Image */}
        <View style={styles.foodImageContainer}>
          {/* Food image placeholder */}
          <View style={styles.foodImage} />
          
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Breakfast</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Delivery</Text>
            </View>
          </View>
          
          {/* Pagination indicator */}
          <View style={styles.pagination}>
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
            <View style={[styles.paginationDot, styles.activeDot]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
        </View>
        
        {/* Food Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.foodName}>{foodItem.name}</Text>
          <Text style={styles.foodPrice}>${foodItem.price}</Text>
          
          <View style={styles.detailsRow}>
            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={14} color="#AFAFAF" />
              <Text style={styles.locationText}>Kentucky 39495</Text>
            </View>
            
            <View style={styles.ratingsContainer}>
              <FontAwesome name="star" size={14} color={COLORS.primary} />
              <Text style={styles.ratingText}>{foodItem.rating}</Text>
              <Text style={styles.reviewText}>({foodItem.reviews} Reviews)</Text>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          {/* Ingredients */}
          <Text style={styles.sectionTitle}>INGREDIENTS</Text>
          <View style={styles.ingredientsContainer}>
            {ingredients.map((ingredient) => (
              <IngredientItem 
                key={ingredient.id}
                name={ingredient.name}
                icon={ingredient.icon}
                isAllergy={ingredient.isAllergy}
              />
            ))}
          </View>
          
          <View style={styles.separator} />
          
          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consetdur Maton adipiscing elit. Bibendum in vel, mattis et amet dui mauris turpis.
          </Text>
        </View>
      </ScrollView>
      
      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('home')}
        >
          <MaterialCommunityIcons 
            name="view-grid-outline" 
            size={24} 
            color={activeTab === 'home' ? '#FB6D3A' : '#32343E'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('menu')}
        >
          <Feather 
            name="menu" 
            size={24} 
            color={activeTab === 'menu' ? '#FB6D3A' : '#32343E'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleTabPress('add')}
        >
          <Feather name="plus" size={24} color="#FB6D3A" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('notifications')}
        >
          <Ionicons 
            name="notifications-outline" 
            size={24} 
            color={activeTab === 'notifications' ? '#FB6D3A' : '#32343E'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => handleTabPress('profile')}
        >
          <Feather 
            name="user" 
            size={24} 
            color={activeTab === 'profile' ? '#FB6D3A' : '#32343E'} 
          />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#ECF0F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontFamily: 'System',
    fontSize: 17,
    color: '#181C2E',
  },
  editButton: {
    padding: 5,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  foodImageContainer: {
    height: 210,
    marginHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#98A8B8', // Placeholder color
    position: 'relative',
  },
  foodImage: {
    flex: 1,
    borderRadius: 20,
  },
  badgeRow: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 61,
  },
  badgeText: {
    color: '#32343E',
    fontSize: 14,
  },
  pagination: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 21,
    borderRadius: 22,
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#32343E',
  },
  foodPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#32343E',
    position: 'absolute',
    right: 24,
    top: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    color: '#AFAFAF',
    fontSize: 13,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  reviewText: {
    marginLeft: 5,
    color: '#AFAFAF',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#32343E',
    marginBottom: 15,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -7,
  },
  ingredientItem: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  ingredientCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFEBE4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientName: {
    color: '#737782',
    fontSize: 12,
    textAlign: 'center',
  },
  allergyText: {
    fontSize: 8,
  },
  descriptionText: {
    color: '#737782',
    fontSize: 13,
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  tabItem: {
    alignItems: 'center',
  },
  addButton: {
    width: 57,
    height: 57,
    borderRadius: 28.5,
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 15,
  },
});

export default ChefFoodDetailsScreen;