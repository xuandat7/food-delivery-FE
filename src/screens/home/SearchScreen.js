import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const SearchScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}>
          {/* Placeholder for back icon */}
          <View style={[styles.backIcon, { backgroundColor: '#e0e0e0' }]} />
        </TouchableOpacity>
        <Text style={styles.title}>Search</Text>
        <TouchableOpacity style={styles.cartButton}>
          <View style={styles.cartIconWrapper}>
            {/* Placeholder for shopping bag icon */}
            <View style={[styles.cartIcon, { backgroundColor: '#e0e0e0' }]} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchInputContainer}>
          <View style={[styles.searchIcon, { backgroundColor: '#e0e0e0', width: 20, height: 20, marginLeft: 10 }]} />
          <TextInput placeholder="Search" style={styles.searchInput} />
        </View>
      </View>

      {/* Recent Keywords */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Recent Keywords</Text>
        <View style={styles.keywordsWrapper}>
          {['Burger', 'Sandwich', 'Pizza', 'Sandwich'].map((keyword, index) => (
            <View key={index} style={styles.keywordTag}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Suggested Restaurants */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Suggested Restaurants</Text>
        {[{ name: 'Pansi Restaurant', rating: 4.7 }, { name: 'American Spicy Burger Shop', rating: 4.3 }, { name: 'Cafenio Coffee Club', rating: 4.0 }].map((restaurant, index) => (
          <View key={index} style={styles.restaurantItem}>
            <View style={[styles.restaurantImage, { backgroundColor: '#e0e0e0', borderRadius: 8 }]} />
            <View>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantRating}>{restaurant.rating} ★</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Popular Fast Food */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Popular Fast Food</Text>
        <View style={styles.popularWrapper}>
          {[{ name: 'Buffalo Pizza', place: 'Cafenio Coffee Club' }, { name: 'European Pizza', place: 'Uttora Coffee House' }].map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <View style={[styles.foodImage, { backgroundColor: '#e0e0e0', borderRadius: 8 }]} />
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodPlace}>{food.place}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartButton: {
    padding: 8,
  },
  cartIconWrapper: {
    position: 'relative',
  },
  cartIcon: {
    width: 24,
    height: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff7621',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  sectionWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  keywordsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordTag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    margin: 4,
  },
  keywordText: {
    fontSize: 14,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  restaurantRating: {
    fontSize: 12,
    color: '#646982',
  },
  popularWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodItem: {
    alignItems: 'center',
    width: '48%',
  },
  foodImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  foodPlace: {
    fontSize: 12,
    color: '#646982',
  },
});

export default SearchScreen;