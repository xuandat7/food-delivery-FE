import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

const foodImg = require('../../../assets/icon.png');
const iconBack = require('../../../assets/icon-back.png');
const iconSearch = require('../../../assets/icon-search.png');
const iconFilter = require('../../../assets/icon-filter.png');
const iconDropdown = require('../../../assets/icon-dropdown.png');

const foods = [
  { name: "Burger Bistro", restaurant: "Rose Garden", price: 40 },
  { name: "Smokin' Burger", restaurant: "Cafenio Restaurant", price: 60 },
  { name: "Buffalo Burgers", restaurant: "Kaji Firm Kitchen", price: 75 },
  { name: "Bullseye Burgers", restaurant: "Kabab Restaurant", price: 94 },
];

const CARD_WIDTH = 159;
const CARD_HEIGHT = 180;
const CARD_GAP = 24;
const CARD_PADDING = 24;

const FoodSearchScreen = ({ navigation, route }) => {
  const { keyword } = route?.params || {};

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      {/* Nền phụ card */}
      <View style={styles.cardBgShadow} />
      <View style={styles.foodCard}>
        {/* Ảnh sản phẩm */}
        <Image source={foodImg} style={styles.foodImg} />
        {/* Tên món */}
        <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
        {/* Nhà hàng */}
        <Text style={styles.foodRestaurant} numberOfLines={1}>{item.restaurant}</Text>
        {/* Giá */}
        <Text style={styles.foodPrice}>${item.price}</Text>
        {/* Nút cộng */}
        <TouchableOpacity style={styles.foodAddBtn}>
          <Text style={styles.foodAddBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
            <Image source={iconBack} style={styles.topIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryBtn}>
            <Text style={styles.categoryText}>BURGER</Text>
            <Image source={iconDropdown} style={styles.dropdownIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn}>
            <Image source={iconSearch} style={styles.topIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBtn}>
            <Image source={iconFilter} style={styles.topIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.foodListTitle}>{keyword || 'Popular Burgers'}</Text>
        <FlatList
          data={foods}
          numColumns={2}
          keyExtractor={(item, idx) => item.name + idx}
          contentContainerStyle={{ paddingHorizontal: CARD_PADDING, paddingTop: 8, paddingBottom: 24 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: CARD_GAP }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  topIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e6eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  categoryText: {
    fontSize: 15,
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
    fontWeight: '700',
    marginRight: 6,
  },
  dropdownIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  foodListTitle: {
    fontSize: 20,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    marginBottom: 16,
    marginLeft: 4,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT + 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cardBgShadow: {
    position: 'absolute',
    left: 0,
    top: 24,
    width: CARD_WIDTH + 35,
    height: 190,
    backgroundColor: '#f6f6f6',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 0,
  },
  foodCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    overflow: 'visible',
  },
  foodImg: {
    position: 'absolute',
    top: 0,
    left: 29,
    width: 100,
    height: 84,
    borderRadius: 16,
    backgroundColor: '#bfc5d2',
    zIndex: 2,
  },
  foodName: {
    position: 'absolute',
    top: 90,
    left: 29,
    fontSize: 15,
    fontWeight: '700',
    color: '#31343d',
    fontFamily: 'Sen-Bold',
    letterSpacing: -0.33,
    zIndex: 2,
  },
  foodRestaurant: {
    position: 'absolute',
    top: 113,
    left: 29,
    fontSize: 13,
    color: '#646982',
    fontFamily: 'Sen-Regular',
    zIndex: 2,
  },
  foodPrice: {
    position: 'absolute',
    top: 138,
    left: 29,
    fontSize: 16,
    color: '#31343d',
    fontFamily: 'Sen-Bold',
    fontWeight: '700',
    letterSpacing: -0.33,
    zIndex: 2,
  },
  foodAddBtn: {
    position: 'absolute',
    top: 132,
    left: 128,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f58d1d',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f58d1d',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 3,
  },
  foodAddBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FoodSearchScreen; 