import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text,
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  PanResponder,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import COLORS from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const OrderItem = ({ order }) => {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderImageContainer}>
        {order.image ? (
          <Image source={order.image} style={styles.orderImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderCategory}>#{order.category}</Text>
        <Text style={styles.orderName}>{order.name}</Text>
        <Text style={styles.orderId}>ID: {order.id}</Text>
        <View style={styles.priceActionContainer}>
          <Text style={styles.orderPrice}>${order.price}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const RunningOrdersScreen = ({ visible, onClose }) => {
  const navigation = useNavigation();
  
  // Setup animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isClosingRef = useRef(false);
  
  // Update animations when visibility changes
  useEffect(() => {
    if (visible) {
      isClosingRef.current = false;
      // Reset position
      slideAnim.setValue(0);
      // Fade in background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  }, [visible, slideAnim, fadeAnim]);
  
  // Sample data for running orders
  const runningOrders = [
    { id: '32053', name: 'Chicken Thai Biriyani', price: '60', category: 'Breakfast' },
    { id: '15253', name: 'Chicken Bhuna', price: '30', category: 'Breakfast' },
    { id: '21200', name: 'Vegetarian Poutine', price: '35', category: 'Breakfast' },
    { id: '53241', name: 'Turkey Bacon Strips', price: '45', category: 'Breakfast' },
    { id: '58464', name: 'Veggie Burrito', price: '25', category: 'Breakfast' },
  ];
  
  // Create a pan responder to handle swipe down gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0 && !isClosingRef.current) { // Only allow dragging down
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50 && !isClosingRef.current) { // If dragged far enough, close the modal
          handleClose();
        } else if (!isClosingRef.current) {
          // Otherwise, snap back to original position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 10
          }).start();
        }
      }
    })
  ).current;
  
  const handleClose = () => {
    if (onClose && !isClosingRef.current) {
      isClosingRef.current = true;
      
      // Run animations in parallel
      Animated.parallel([
        // Slide down
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true
        }),
        // Fade out background
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        })
      ]).start(() => {
        // Call onClose after animations complete
        onClose();
        // Reset animations for next time
        slideAnim.setValue(0);
      });
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="rgba(38, 62, 85, 0.7)" />
      
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View 
          style={[
            styles.modalOverlay,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View 
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              {/* Draggable handle at top of modal */}
              <View 
                {...panResponder.panHandlers} 
                style={styles.dragHandleContainer}
              >
                <View style={styles.modalHandle} />
              </View>
              
              {/* Title */}
              <Text style={styles.title}>20 Running Orders</Text>
              
              {/* Orders List */}
              <FlatList
                data={runningOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderItem order={item} />}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(38, 62, 85, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    maxHeight: height * 0.85,
  },
  dragHandleContainer: {
    width: '100%', 
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32343E',
    textAlign: 'center',
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  orderImageContainer: {
    width: 75,
    height: 75,
    backgroundColor: '#C4C4C4',
    borderRadius: 12,
    marginRight: 14,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  orderCategory: {
    color: '#FF7A00',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  orderName: {
    color: '#32343E',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  orderId: {
    color: '#9B9BA5',
    fontSize: 13,
    marginBottom: 8,
  },
  priceActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#32343E',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  doneButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
  },
  doneText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RunningOrdersScreen;