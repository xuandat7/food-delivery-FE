import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';

const iconBack = require('../../../assets/icon-back.png');
const iconFilter = require('../../../assets/icon-filter.png');
const iconStar = require('../../../assets/icon_star.png');
const iconDelivery = require('../../../assets/icon.png'); // Thay bằng icon delivery nếu có
const iconTime = require('../../../assets/icon.png'); // Thay bằng icon time nếu có
const foodImg = require('../../../assets/icon.png'); // Thay bằng ảnh món ăn nếu có
const iconCancel = require('../../../assets/icon-cancel.png');

const categories = ['Burger', 'Sandwich', 'Pizza', 'Sanwich'];
const foods = [
  { name: "Burger Ferguson", restaurant: "Spicy Restaurant", price: 40 },
  { name: "Rockin' Burgers", restaurant: "Cafecafachino", price: 40 },
  { name: "Classic Burger", restaurant: "Spicy Restaurant", price: 45 },
  { name: "Cheese Burger", restaurant: "Cafecafachino", price: 42 },
  { name: "Veggie Burger", restaurant: "Spicy Restaurant", price: 38 },
  { name: "BBQ Burger", restaurant: "Cafecafachino", price: 44 },
  { name: "Fish Burger", restaurant: "Spicy Restaurant", price: 41 },
  { name: "Double Burger", restaurant: "Cafecafachino", price: 50 },
  { name: "Spicy Chicken Burger", restaurant: "Spicy Restaurant", price: 43 },
  { name: "Mushroom Burger", restaurant: "Cafecafachino", price: 46 },
];

const offerOptions = [
  'Delivery',
  'Pick Up',
  'Offer',
  'Online payment available',
];
const deliverTimeOptions = ['10-15 min', '20 min', '30 min'];
const pricingOptions = ['$', '$$', '$$$'];
const ratingOptions = [1, 2, 3, 4, 5];

const RestaurantViewScreen = ({ navigation }) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [selectedTime, setSelectedTime] = useState('10-15 min');
  const [selectedPricing, setSelectedPricing] = useState('$$');
  const [selectedRating, setSelectedRating] = useState(4);

  const toggleOffer = (offer) => {
    setSelectedOffers((prev) =>
      prev.includes(offer)
        ? prev.filter((o) => o !== offer)
        : [...prev, offer]
    );
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 24}}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image source={iconBack} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Restaurant View</Text>
          <TouchableOpacity style={styles.moreBtn} onPress={() => setFilterVisible(true)}>
            <Image source={iconFilter} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
        {/* Restaurant Image */}
        <View style={styles.restaurantImgWrapper}>
          <View style={styles.restaurantImg} />
        </View>
        {/* Restaurant Info */}
        <View style={styles.infoWrapper}>
          <Text style={styles.restaurantName}>Spicy Restaurant</Text>
          <Text style={styles.restaurantDesc}>
            Maecenas sed diam eget risus varius blandit sit amet non magna. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
          </Text>
          <View style={styles.infoRow}>
            <Image source={iconStar} style={styles.infoIcon} />
            <Text style={styles.infoText}>4.7</Text>
            <Image source={iconDelivery} style={styles.infoIcon} />
            <Text style={styles.infoText}>Free</Text>
            <Image source={iconTime} style={styles.infoIcon} />
            <Text style={styles.infoText}>20 min</Text>
          </View>
          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
            {categories.map((cat, idx) => (
              <View key={cat+idx} style={[styles.categoryBtn, idx === 0 && styles.categoryBtnActive]}>
                <Text style={[styles.categoryText, idx === 0 && styles.categoryTextActive]}>{cat}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Food List */}
        <Text style={styles.foodListTitle}>Burger (10)</Text>
        <View style={styles.foodList}>
          {foods.map((food, idx) => (
            <TouchableOpacity key={food.name+idx} style={styles.foodCard} onPress={() => onFoodPress?.(food)}>
              <View style={{flex: 1, justifyContent: 'flex-start'}}>
                <Image source={foodImg} style={styles.foodImg} />
                <Text style={styles.foodName} numberOfLines={2}>{food.name}</Text>
                <Text style={styles.foodRestaurant} numberOfLines={1}>{food.restaurant}</Text>
              </View>
              <View style={styles.foodBottomRow}>
                <Text style={styles.foodPrice}>${food.price || ''}</Text>
                <TouchableOpacity style={styles.foodAddBtn}>
                  <Text style={styles.foodAddBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter your search</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setFilterVisible(false)}>
                <Image source={iconCancel} style={styles.modalCloseIcon} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Offers */}
              <Text style={styles.filterLabel}>OFFERS</Text>
              <View style={styles.filterRowWrap}>
                {offerOptions.map((offer) => (
                  <TouchableOpacity
                    key={offer}
                    style={[styles.filterTag, selectedOffers.includes(offer) && styles.filterTagActive]}
                    onPress={() => toggleOffer(offer)}
                  >
                    <Text style={[styles.filterTagText, selectedOffers.includes(offer) && styles.filterTagTextActive]}>{offer}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Deliver Time */}
              <Text style={styles.filterLabel}>DELIVER TIME</Text>
              <View style={styles.filterRow}>
                {deliverTimeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.filterTag, selectedTime === time && styles.filterTagActive]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.filterTagText, selectedTime === time && styles.filterTagTextActive]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Pricing */}
              <Text style={styles.filterLabel}>PRICING</Text>
              <View style={styles.filterRow}>
                {pricingOptions.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.filterCircle, selectedPricing === p && styles.filterCircleActive]}
                    onPress={() => setSelectedPricing(p)}
                  >
                    <Text style={[styles.filterCircleText, selectedPricing === p && styles.filterCircleTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Rating */}
              <Text style={styles.filterLabel}>RATING</Text>
              <View style={styles.filterRow}>
                {ratingOptions.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={styles.ratingStarBtn}
                    onPress={() => setSelectedRating(r)}
                  >
                    <Image
                      source={iconStar}
                      style={[styles.ratingStar, selectedRating >= r ? styles.ratingStarActive : styles.ratingStarInactive]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {/* Filter Button */}
              <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(false)}>
                <Text style={styles.filterBtnText}>FILTER</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
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
    height: 45,
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
  moreBtn: {
    backgroundColor: '#ecf0f4',
    borderRadius: 22.5,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  restaurantImgWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  restaurantImg: {
    width: 327,
    height: 160,
    borderRadius: 32,
    backgroundColor: '#bfc5d2',
  },
  infoWrapper: {
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
    marginBottom: 8,
  },
  restaurantDesc: {
    fontSize: 15,
    color: '#bfc5d2',
    fontFamily: 'Sen-Regular',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 18,
    height: 18,
    marginRight: 4,
    resizeMode: 'contain',
  },
  infoText: {
    fontSize: 16,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    marginRight: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryBtn: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e6eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
  },
  categoryBtnActive: {
    backgroundColor: '#ff7621',
    borderColor: '#ff7621',
  },
  categoryText: {
    fontSize: 16,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
  },
  categoryTextActive: {
    color: '#fff',
  },
  foodListTitle: {
    fontSize: 20,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    marginBottom: 16,
  },
  foodList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  foodCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    height: 230,
    justifyContent: 'space-between',
  },
  foodImg: {
    width: 100,
    height: 84,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#bfc5d2',
    alignSelf: 'center',
  },
  foodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#31343d',
    fontFamily: 'Sen-Bold',
    marginBottom: 2,
    textAlign: 'center',
    lineHeight: 18,
  },
  foodRestaurant: {
    fontSize: 13,
    color: '#646982',
    fontFamily: 'Sen-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
  foodBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  foodPrice: {
    fontSize: 16,
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
  },
  foodAddBtn: {
    backgroundColor: '#ff7621',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodAddBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(38, 62, 85, 0.67)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
    fontWeight: '700',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#ecf0f4',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  filterLabel: {
    fontSize: 13,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filterTag: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e6eb',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  filterTagActive: {
    backgroundColor: '#ff7621',
    borderColor: '#ff7621',
  },
  filterTagText: {
    fontSize: 13,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
  },
  filterTagTextActive: {
    color: '#fff',
  },
  filterCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e6eb',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  filterCircleActive: {
    backgroundColor: '#ff7621',
    borderColor: '#ff7621',
  },
  filterCircleText: {
    fontSize: 20,
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
  },
  filterCircleTextActive: {
    color: '#fff',
  },
  ratingStarBtn: {
    marginRight: 8,
  },
  ratingStar: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  ratingStarActive: {
    tintColor: '#ff7621',
  },
  ratingStarInactive: {
    tintColor: '#e5e6eb',
  },
  filterBtn: {
    backgroundColor: '#ff7621',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  filterBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Sen-Bold',
  },
});

export default RestaurantViewScreen; 