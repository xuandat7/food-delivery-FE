import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { restaurantAPI } from '../../services';

// Dummy images/icons, replace with your assets or pass as props
const dummyIcon = require('../../../assets/icon.png');
const dummySearch = require('../../../assets/icon-search.png');
const dummyBack = require('../../../assets/icon-back.png');
const dummyCancel = require('../../../assets/icon-cancel.png');
const dummyFood = require('../../../assets/icon.png');

const Search = ({
  onBack,
  onRestaurantPress,
}) => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const navigation = useNavigation();

  // Lấy danh sách nhà hàng nổi bật khi component được mount
  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        setLoadingFeatured(true);
        const response = await restaurantAPI.getAllRestaurants(0, 5);
        if (response.success && response.data?.content) {
          setFeaturedRestaurants(response.data.content);
        } else {
          setFeaturedRestaurants([]);
        }
      } catch (error) {
        console.error('Error fetching featured restaurants:', error);
        setFeaturedRestaurants([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  // Xử lý sự kiện tìm kiếm khi nhấn nút tìm kiếm trên bàn phím
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    Keyboard.dismiss(); // Ẩn bàn phím
    setIsSearching(true);
    setLoading(true);
    
    try {
      const response = await restaurantAPI.searchRestaurants(searchText.trim());
      if (response.success) {
        setSearchResults(response.data.content);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 24}}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Image source={dummyBack} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Khám phá món ăn và nhà hàng</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <Image source={dummySearch} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm món ăn"
          placeholderTextColor="#979797"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {searchText ? (
          <TouchableOpacity style={styles.clearBtn} onPress={() => {
            setSearchText('');
            setIsSearching(false);
          }}>
            <Image source={dummyCancel} style={styles.clearIcon} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Hiển thị kết quả tìm kiếm nếu đang tìm kiếm */}
      {isSearching ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#FB6D3A" style={styles.loader} />
          ) : searchResults.length > 0 ? (
            searchResults.map((restaurant, idx) => (
              <TouchableOpacity 
                key={restaurant.id || idx} 
                style={styles.restaurantRow} 
                onPress={() => restaurant.id ? onRestaurantPress?.(restaurant) : null}
              >
                <Image 
                  source={{ uri: restaurant.image_url}} 
                  style={styles.restaurantImg} 
                  defaultSource={dummyFood}
                />
                <View style={{flex: 1}}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  {restaurant.type && (
                    <Text style={styles.restaurantType}>{restaurant.type}</Text>
                  )}
                  {restaurant.address && (
                    <Text style={styles.restaurantAddress} numberOfLines={1}>
                      {restaurant.address}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResultsText}>Không tìm thấy kết quả nào cho "{searchText}"</Text>
          )}
        </View>
      ) : (
        <>
          {/* Suggested Restaurants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nhà hàng nổi bật</Text>
            {loadingFeatured ? (
              <ActivityIndicator size="small" color="#FB6D3A" style={styles.loader} />
            ) : featuredRestaurants.length > 0 ? (
              featuredRestaurants.map((restaurant, idx) => (
                <TouchableOpacity 
                  key={restaurant.id || idx} 
                  style={styles.restaurantRow} 
                  onPress={() => restaurant.id ? onRestaurantPress?.(restaurant) : null}
                >
                  <Image 
                    source={{ uri: restaurant.image_url || 'https://via.placeholder.com/150' }} 
                    style={styles.restaurantImg} 
                    defaultSource={dummyFood}
                  />
                  <View style={{flex:1}}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    {restaurant.address && (
                      <Text style={styles.restaurantAddress} numberOfLines={1}>
                        {restaurant.address}
                      </Text>
                    )}
                    {restaurant.type && (
                      <Text style={styles.restaurantType}>{restaurant.type}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResultsText}>Không thể tải nhà hàng</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 11,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: '#ecf0f4',
    borderRadius: 22.5,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    fontWeight: '400',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    height: 40,
  },
  clearBtn: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccdcf',
    borderRadius: 10,
  },
  clearIcon: {
    width: 8,
    height: 8,
    resizeMode: 'contain',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#31343d',
    fontFamily: 'Sen-Regular',
    marginBottom: 8,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  restaurantImg: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  restaurantName: {
    fontSize: 16,
    color: '#31343d',
    fontFamily: 'Sen-Regular',
    fontWeight: '400',
  },
  restaurantType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  loader: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Search; 