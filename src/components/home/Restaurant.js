import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { restaurantAPI } from "../../services";

export const Restaurant = () => {
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurants();
    }, [])
  );

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getAllRestaurants(0, 10);
      
      if (response.success && response.data.content?.length > 0) {
        console.log('Fetched restaurants:', response.data.content.length);
        
        const shuffledRestaurants = [...response.data.content];
        for (let i = shuffledRestaurants.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledRestaurants[i], shuffledRestaurants[j]] = [shuffledRestaurants[j], shuffledRestaurants[i]];
        }
        
        setRestaurants(shuffledRestaurants.slice(0, 5));
      } else {
        console.error('Failed to fetch restaurants:', response.message);
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantView', { id: restaurant.id });
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#FB6D3A" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {restaurants.map((restaurant) => (
        <TouchableOpacity 
          key={restaurant.id}
          style={styles.restaurantCard}
          onPress={() => handleRestaurantPress(restaurant)}
        >
          <Image 
            source={{ uri: restaurant.image_url || 'https://via.placeholder.com/400x200' }} 
            style={styles.restaurantImage}
            defaultSource={require('../../../assets/icon.png')}
          />
          <View style={styles.overlay} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color="#fff" />
              <Text style={styles.locationText}>{restaurant.address || 'Không có địa chỉ'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginVertical: 20,
  },
  restaurantCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 160,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  restaurantInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 