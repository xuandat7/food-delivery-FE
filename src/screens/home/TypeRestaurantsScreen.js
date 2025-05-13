import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { restaurantAPI } from '../../services';

const TypeRestaurantsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { type } = route.params;
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchRestaurantsByType();
  }, []);

  const fetchRestaurantsByType = async () => {
    if (!hasMore) return;
    
    try {
      setLoading(true);
      // Use the dedicated API endpoint for filtering by type
      console.log(`Fetching restaurants of type "${type}" - page ${page}`);
      const response = await restaurantAPI.getRestaurantsByType(type, page, 10);
      
      if (response.success) {
        console.log(`Fetched ${response.data.content.length} restaurants of type "${type}"`);
        
        if (page === 0) {
          setRestaurants(response.data.content);
        } else {
          setRestaurants(prev => [...prev, ...response.data.content]);
        }
        
        // Check if there are more pages to load
        setHasMore(page < response.data.totalPages - 1 && response.data.content.length > 0);
      } else {
        console.error('API response error:', response);
        setError('Không thể tải danh sách nhà hàng');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Đã xảy ra lỗi khi tải danh sách nhà hàng');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const loadMoreRestaurants = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchRestaurantsByType();
    }
  };

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantView', { id: restaurant.id });
  };

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item)}
    >
      <Image 
        source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} 
        style={styles.restaurantImage}
        defaultSource={require('../../../assets/icon.png')}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantType}>{item.type}</Text>
        <Text style={styles.restaurantAddress} numberOfLines={1}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{type}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FB6D3A" />
          <Text style={styles.loadingText}>Đang tải nhà hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{type}</Text>
        <View style={{ width: 40 }} />
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setPage(0);
              setError(null);
              setInitialLoading(true);
              fetchRestaurantsByType();
            }}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : restaurants.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsText}>Không tìm thấy nhà hàng loại {type}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { marginTop: 16 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={item => `restaurant-${item.id}`}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMoreRestaurants}
          onEndReachedThreshold={0.2}
          ListFooterComponent={loading && hasMore ? (
            <ActivityIndicator size="small" color="#FB6D3A" style={styles.loader} />
          ) : null}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FB6D3A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantType: {
    fontSize: 14,
    color: '#FB6D3A',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#8E8E93',
  },
  loader: {
    marginVertical: 16,
  }
});

export default TypeRestaurantsScreen; 