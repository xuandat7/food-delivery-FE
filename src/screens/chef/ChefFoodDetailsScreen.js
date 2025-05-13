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
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../constants/colors';

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
    navigation.navigate('AddNewItemsScreen', { 
      isEditing: true, 
      foodItem: foodItem 
    });
  };

  // Navigation handlers for bottom tab bar
  const handleTabPress = (tabName) => {
    if (tabName === 'home') {
      navigation.navigate('SellerDashboard');
    } else if (tabName === 'menu') {
      navigation.navigate('MyFoodScreen');
    } else if (tabName === 'add') {
      navigation.navigate('AddNewItemsScreen');
    } else if (tabName === 'profile') {
      navigation.navigate('ProfileScreen');
    } else if (tabName === 'notifications') {
      navigation.navigate('NotificationScreen');
    }
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
        <Text style={styles.pageTitle}>Chi tiết món ăn</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditPress}
        >
          <Text style={styles.editButtonText}>SỬA</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Food Image */}
        <View style={styles.foodImageContainer}>
          {foodItem.thumbnail ? (
            <Image 
              source={{ uri: foodItem.thumbnail }}
              style={styles.foodImage}
              defaultSource={require('../../../assets/icon.png')}
            />
          ) : (
            <View style={styles.foodImage} />
          )}
        </View>
        
        {/* Food Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.foodName}>{foodItem.name}</Text>
          <Text style={styles.foodPrice}>
            {foodItem.price ? new Intl.NumberFormat('vi-VN').format(foodItem.price) + 'đ' : 'Chưa có giá'}
          </Text>
          
          <View style={styles.categoryContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{foodItem.category || 'Không phân loại'}</Text>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          {/* Description */}
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.descriptionText}>
            {foodItem.description || 'Không có mô tả cho món ăn này.'}
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
    backgroundColor: '#98A8B8',
    overflow: 'hidden',
  },
  foodImage: {
    flex: 1,
    borderRadius: 20,
  },
  detailsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#32343E',
    marginBottom: 8,
  },
  foodPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FB6D3A',
    marginBottom: 12,
  },
  categoryContainer: {
    marginVertical: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 118, 33, 0.2)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 13,
    color: '#FB6D3A',
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#32343E',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#737782',
    fontSize: 14,
    lineHeight: 22,
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