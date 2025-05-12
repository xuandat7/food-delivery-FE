import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Dummy images/icons, replace with your assets or pass as props
const dummyIcon = require('../../../assets/icon.png');
const dummySearch = require('../../../assets/icon-search.png');
const dummyBack = require('../../../assets/icon-back.png');
const dummyCancel = require('../../../assets/icon-cancel.png');
const dummyStar = require('../../../assets/icon_star.png');
const dummyFood = require('../../../assets/icon.png');

const Search = ({
  recentKeywords = ['Burger', 'Sandwich', 'Pizza', 'Sanwich'],
  suggestedRestaurants = [
    { name: 'Pansi Restaurant', rating: 4.7 },
    { name: 'American Spicy Burger Shop', rating: 4.3 },
    { name: 'Cafenio Coffee Club', rating: 4.0 },
  ],
  popularFastFood = [
    { name: 'European Pizza', place: 'Uttora Coffe House' },
    { name: 'Buffalo Pizza.', place: 'Cafenio Coffee Club' },
    { name: 'Chicken Burger', place: 'Burger House' },
    { name: 'Spicy Sandwich', place: 'Sandwich Bar' },
    { name: 'Veggie Pizza', place: 'Green Eatery' },
    { name: 'BBQ Burger', place: 'BBQ Corner' },
    { name: 'Cheese Pizza', place: 'Pizza Mania' },
    { name: 'Fish Burger', place: 'Seafood Deli' },
    { name: 'Classic Pizza', place: 'Classic House' },
    { name: 'Double Burger', place: 'Burger King' },
  ],
  cartCount = 2,
  onBack,
  onKeywordPress,
  onRestaurantPress,
  onFoodPress,
}) => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 24}}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Image source={dummyBack} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Search</Text>
        <View style={styles.cartWrapper}>
          <View style={styles.cartIconBg}>
            <Image source={dummyIcon} style={styles.cartIcon} />
          </View>
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
        </View>
      </View>
      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <Image source={dummySearch} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pizza"
          placeholderTextColor="#979797"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.clearBtn} onPress={() => setSearchText('')}>
          <Image source={dummyCancel} style={styles.clearIcon} />
        </TouchableOpacity>
      </View>
      {/* Recent Keywords */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Keywords</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.keywordsRow}>
          {recentKeywords.map((kw, idx) => (
            <TouchableOpacity key={kw+idx} style={styles.keywordBtn} onPress={() => navigation.navigate('FoodSearch', { keyword: kw })}>
              <Text style={styles.keywordText}>{kw}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* Suggested Restaurants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested Restaurants</Text>
        {suggestedRestaurants.map((r, idx) => (
          <TouchableOpacity key={r.name+idx} style={styles.restaurantRow} onPress={() => onRestaurantPress?.(r)}>
            <Image source={dummyFood} style={styles.restaurantImg} />
            <View style={{flex:1}}>
              <Text style={styles.restaurantName}>{r.name}</Text>
              <View style={styles.ratingRow}>
                <Image source={dummyStar} style={styles.starIcon} />
                <Text style={styles.ratingText}>{r.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {/* Popular Fast Food */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Fast Food</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fastFoodRow}>
          {popularFastFood.map((f, idx) => (
            <TouchableOpacity key={f.name+idx} style={styles.fastFoodCard} onPress={() => onFoodPress?.(f)}>
              <Image source={dummyFood} style={styles.fastFoodImg} />
              <Text style={styles.fastFoodName}>{f.name}</Text>
              <Text style={styles.fastFoodPlace}>{f.place}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 50,
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
  cartWrapper: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIconBg: {
    backgroundColor: '#181c2e',
    borderRadius: 22.5,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#ff7621',
    borderRadius: 12.5,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Sen-Bold',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 16,
    height: 62,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchIcon: {
    width: 17,
    height: 17,
    marginRight: 8,
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
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
  keywordsRow: {
    flexDirection: 'row',
  },
  keywordBtn: {
    backgroundColor: '#f5f6fa',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
  },
  keywordText: {
    fontSize: 16,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
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
    width: 50,
    height: 50,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starIcon: {
    width: 15,
    height: 15,
    marginRight: 4,
    resizeMode: 'contain',
  },
  ratingText: {
    fontSize: 16,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
  },
  fastFoodRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  fastFoodCard: {
    width: 150,
    backgroundColor: '#f5f6fa',
    borderRadius: 16,
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
  },
  fastFoodImg: {
    width: 100,
    height: 84,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  fastFoodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#31343d',
    fontFamily: 'Sen-Bold',
    marginBottom: 2,
  },
  fastFoodPlace: {
    fontSize: 13,
    color: '#646982',
    fontFamily: 'Sen-Regular',
  },
});

export default Search; 