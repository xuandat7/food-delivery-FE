import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  const handleBack = () => {
    navigation.goBack();
  };

  const handleWithdraw = () => {
    Alert.alert('Withdraw', 'Withdrawal functionality coming soon');
  };

  const handlePersonalInfo = () => {
    Alert.alert('Personal Info', 'Personal Info screen will be available soon');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings screen will be available soon');
  };

  const handleUserReviews = () => {
    Alert.alert('User Reviews', 'User Reviews screen will be available soon');
  };

  const handleWithdrawalHistory = () => {
    Alert.alert('Withdrawal History', 'Withdrawal History screen will be available soon');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Navigate to Auth screen on logout
            navigation.navigate('Auth');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF7621" />
      
      {/* Header Section with Balance */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>$500.00</Text>

        <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
          <Text style={styles.withdrawText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
      
      {/* Personal Info Section */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handlePersonalInfo}>
          <View style={[styles.iconContainer, styles.userIcon]}>
            <AntDesign name="user" size={22} color="#FF7621" />
          </View>
          <Text style={styles.menuText}>Personal Info</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
          <View style={[styles.iconContainer, styles.settingsIcon]}>
            <Ionicons name="settings-outline" size={22} color="#4F46E5" />
          </View>
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
      
      {/* Withdrawal History Section */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleWithdrawalHistory}>
          <View style={[styles.iconContainer, styles.withdrawalIcon]}>
            <AntDesign name="creditcard" size={22} color="#FF7621" />
          </View>
          <Text style={styles.menuText}>Withdrawal History</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
        
        <View style={styles.menuItem}>
          <View style={[styles.iconContainer, styles.ordersIcon]}>
            <MaterialCommunityIcons name="note-text-outline" size={22} color="#38BDF8" />
          </View>
          <Text style={styles.menuText}>Number of Orders</Text>
          <Text style={styles.orderCount}>29K</Text>
        </View>
      </View>
      
      {/* User Reviews Section */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleUserReviews}>
          <View style={[styles.iconContainer, styles.reviewsIcon]}>
            <Ionicons name="grid-outline" size={22} color="#22D3EE" />
          </View>
          <Text style={styles.menuText}>User Reviews</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
      
      {/* Logout Section */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={[styles.iconContainer, styles.logoutIcon]}>
            <Feather name="log-out" size={22} color="#EF4444" />
          </View>
          <Text style={styles.menuText}>Log Out</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCCCCC" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  headerSection: {
    backgroundColor: '#FF7621',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 20,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    marginTop: 10,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    marginTop: 5,
  },
  withdrawButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  withdrawText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    backgroundColor: 'rgba(255, 118, 33, 0.1)',
  },
  settingsIcon: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  withdrawalIcon: {
    backgroundColor: 'rgba(255, 118, 33, 0.1)',
  },
  ordersIcon: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  reviewsIcon: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
  },
  logoutIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  arrowIcon: {
    opacity: 0.6,
  },
  orderCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9B9BA5',
  },
});

export default ProfileScreen;