import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import { styles } from './SellerDashboardStyle';
import COLORS from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import RunningOrdersScreen from './RunningOrdersScreen';

// Custom Chart Component (simplified for this implementation)
const RevenueChart = () => {
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartPlaceholder}>
        {/* This would be replaced with an actual chart library component */}
        <View style={styles.tooltipBox}>
          <Text style={styles.tooltipText}>$500</Text>
        </View>

        {/* Simplified chart visual elements */}
        <View style={{
          position: 'absolute',
          left: '30%',
          top: '40%',
          width: 13,
          height: 13,
          borderRadius: 6.5,
          backgroundColor: 'white',
          borderWidth: 2.5,
          borderColor: '#FB6D3A'
        }} />
      </View>
      
      <View style={styles.timeLabels}>
        <Text style={styles.timeLabel}>10AM</Text>
        <Text style={styles.timeLabel}>11AM</Text>
        <Text style={styles.timeLabel}>12PM</Text>
        <Text style={styles.timeLabel}>01PM</Text>
        <Text style={styles.timeLabel}>02PM</Text>
        <Text style={styles.timeLabel}>03PM</Text>
        <Text style={styles.timeLabel}>04PM</Text>
      </View>
    </View>
  );
};

const SellerDashboard = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [showRunningOrders, setShowRunningOrders] = useState(false);
  const [showOrderRequests, setShowOrderRequests] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // Default active tab
  
  // Reset active tab when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      setActiveTab('home');
    }
  }, [isFocused]);
  
  const handleToggleRunningOrders = () => {
    setShowRunningOrders(!showRunningOrders);
  };
  
  const handleToggleOrderRequests = () => {
    // Implement order requests modal when created
    console.log('Toggle order requests');
  };
  
  const handleNavigateToMyFood = () => {
    setActiveTab('menu');
    navigation.navigate('MyFoodScreen');
  };
  
  const handleNavigateToAddNewItems = () => {
    setActiveTab('add');
    // Use CommonActions.navigate to prevent stack issues
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddNewItemsScreen'
      })
    );
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
    } else if (tabName === 'menu') {
      navigation.navigate('MyFoodScreen');
    } else if (tabName === 'profile') {
      navigation.navigate('ProfileScreen');
    } else if (tabName === 'notifications') {
      navigation.navigate('NotificationScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7F8" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="menu" size={18} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>LOCATION</Text>
          <View style={styles.locationWrapper}>
            <Text style={styles.locationText}>Halal Lab office</Text>
            <Ionicons name="chevron-down-sharp" size={8} color="#676767" style={{marginLeft: 8, marginTop: 5}} />
          </View>
        </View>
        
        <View style={styles.profileImage} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Running Orders and Order Requests */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statsCard}
            onPress={handleToggleRunningOrders}
          >
            <Text style={styles.statsNumber}>20</Text>
            <Text style={styles.statsLabel}>RUNNING ORDERS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statsCard}
            onPress={handleToggleOrderRequests}
          >
            <Text style={styles.statsNumber}>05</Text>
            <Text style={styles.statsLabel}>ORDER REQUEST</Text>
          </TouchableOpacity>
        </View>
        
        {/* Revenue Card */}
        <View style={styles.revenueCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Total Revenue</Text>
              <Text style={styles.revenueAmount}>$2,241</Text>
            </View>
            
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.periodSelector}>
                <Text style={styles.periodText}>Daily</Text>
                <Ionicons name="chevron-down" size={14} color="#9B9BA5" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.seeDetails}>See Details</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <RevenueChart />
        </View>
        
        {/* Reviews Card */}
        <View style={styles.reviewsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All Reviews</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewStats}>
            <View style={styles.ratingContainer}>
              <View style={{
                width: 26,
                height: 26,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <FontAwesome name="star" size={18} color="#FB6D3A" />
              </View>
              <Text style={styles.ratingText}>4.9</Text>
            </View>
            <Text style={styles.totalReviews}>Total 20 Reviews</Text>
          </View>
        </View>
        
        {/* Popular Items Card */}
        <View style={styles.popularItemsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Populer Items This Weeks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.itemsContainer}>
            <View style={styles.itemImage} />
            <View style={styles.itemImage} />
          </View>
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
      
      {/* Running Orders Modal */}
      <RunningOrdersScreen 
        visible={showRunningOrders} 
        onClose={() => setShowRunningOrders(false)} 
      />
    </SafeAreaView>
  );
};

export default SellerDashboard;