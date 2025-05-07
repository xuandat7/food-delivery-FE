import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import COLORS from '../../constants/colors';

const OrderItem = ({ order, onAccept, onCancel }) => {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderImageContainer}>
        <Image
          source={order.image || require('../../../assets/favicon.png')} 
          style={styles.orderImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.orderContent}>
        <Text style={styles.orderTitle}>{order.name}</Text>
        <Text style={styles.orderPrice}>${order.price}</Text>
      </View>
      <View style={styles.orderActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => onAccept(order.id)}
        >
          <Text style={styles.actionButtonText}>Accept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => onCancel(order.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RunningOrdersScreen = () => {
  const navigation = useNavigation();
  
  // Sample data based on the image provided
  const runningOrders = [
    { id: '1', name: 'Chicken Burger', price: '20', image: null },
    { id: '2', name: 'Chicken Wrap', price: '20', image: null },
    { id: '3', name: 'Vegetarian Nachos', price: '15', image: null },
    { id: '4', name: 'Tender Chicken Strips', price: '25', image: null },
    { id: '5', name: 'Veggie Burrito', price: '15', image: null },
  ];
  
  const handleAccept = (orderId) => {
    // Implement order acceptance logic here
    console.log(`Order ${orderId} accepted`);
  };
  
  const handleCancel = (orderId) => {
    // Implement order cancellation logic here
    console.log(`Order ${orderId} cancelled`);
  };
  
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#263E55" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>20 Running Orders</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Orders List */}
      <FlatList
        data={runningOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderItem 
            order={item} 
            onAccept={handleAccept}
            onCancel={handleCancel}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Bottom Tab */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome name="th-large" size={24} color="#32343E" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Feather name="menu" size={24} color="#32343E" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addButton}>
          <Feather name="plus" size={24} color="#FB6D3A" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="notifications-outline" size={24} color="#32343E" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Feather name="user" size={24} color="#32343E" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  header: {
    backgroundColor: '#263E55',
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderImageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  orderImage: {
    width: '100%',
    height: '100%',
  },
  orderContent: {
    flex: 1,
    marginLeft: 15,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#32343E',
  },
  orderPrice: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32343E',
  },
  orderActions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#FF7A00',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#32343E',
    fontSize: 14,
    fontWeight: '500',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 89,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: 20, // For home indicator area on newer iPhones
  },
  tabItem: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 57,
    height: 57,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#FF7621',
    borderRadius: 28.5,
    marginBottom: 20,
  },
});

export default RunningOrdersScreen;