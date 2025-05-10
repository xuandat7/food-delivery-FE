import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const iconBack = require('../../../assets/icon-back.png');
const iconStar = require('../../../assets/icon_star.png');
const iconDelivery = require('../../../assets/icon.png');
const iconClock = require('../../../assets/icon.png');
const iconSave = require('../../../assets/icon-cancel.png');
const iconUser = require('../../../assets/icon.png');
const iconIngredient = require('../../../assets/icon.png');

const sizes = ['10"', '14"', '16"'];
const ingredients = [iconIngredient, iconIngredient, iconIngredient, iconIngredient, iconIngredient];

const FoodDetailsScreen = ({ navigation, route }) => {
  const food = route?.params?.food || {
    name: 'Pizza Calzone European',
    restaurant: 'Uttora Coffe House',
    price: 32,
    desc: 'Prosciutto e funghi is a pizza variety that is topped with tomato sauce.',
    rating: 4.7,
    delivery: 'Free',
    time: '20 min',
    img: iconUser,
  };
  const [selectedSize, setSelectedSize] = useState('14"');
  const [quantity, setQuantity] = useState(2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 24}}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={iconBack} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Details</Text>
      </View>
      {/* Food Image */}
      <View style={styles.foodImgWrapper}>
        <Image source={food.img} style={styles.foodImg} />
        <TouchableOpacity style={styles.saveBtn}>
          <View style={styles.saveBtnBg} />
          <Image source={iconSave} style={styles.saveIcon} />
        </TouchableOpacity>
      </View>
      {/* Restaurant */}
      <View style={styles.restaurantBtn}>
        <Image source={iconUser} style={styles.restaurantIcon} />
        <Text style={styles.restaurantText}>{food.restaurant}</Text>
      </View>
      {/* Food Name & Desc */}
      <Text style={styles.foodName}>{food.name}</Text>
      <Text style={styles.foodDesc}>{food.desc}</Text>
      {/* Info Row */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Image source={iconStar} style={styles.infoIcon} />
          <Text style={styles.infoText}>{food.rating}</Text>
        </View>
        <View style={styles.infoItem}>
          <Image source={iconDelivery} style={styles.infoIcon} />
          <Text style={styles.infoText}>{food.delivery}</Text>
        </View>
        <View style={styles.infoItem}>
          <Image source={iconClock} style={styles.infoIcon} />
          <Text style={styles.infoText}>{food.time}</Text>
        </View>
      </View>
      {/* Size */}
      <Text style={styles.label}>SIZE:</Text>
      <View style={styles.sizeRow}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
            onPress={() => setSelectedSize(size)}
          >
            <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Ingredients */}
      <Text style={styles.label}>INGREDIENTS</Text>
      <View style={styles.ingredientRow}>
        {ingredients.map((icon, idx) => (
          <View key={idx} style={styles.ingredientBtn}>
            <Image source={icon} style={styles.ingredientIcon} />
          </View>
        ))}
      </View>
      {/* Add to Cart */}
      <View style={styles.cartBar}>
        <Text style={styles.price}>${food.price}</Text>
        <View style={styles.qtyBox}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity-1))}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity+1)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.addCartBtn}>
        <Text style={styles.addCartText}>ADD TO CART</Text>
      </TouchableOpacity>
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
    width: 12,
    height: 12,
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
  foodImgWrapper: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  foodImg: {
    width: 327,
    height: 184,
    borderRadius: 32,
    backgroundColor: '#bfc5d2',
  },
  saveBtn: {
    position: 'absolute',
    right: 24,
    bottom: 16,
    width: 37,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnBg: {
    backgroundColor: '#fff',
    opacity: 0.2,
    borderRadius: 18.5,
    width: 37,
    height: 37,
    position: 'absolute',
  },
  saveIcon: {
    width: 17,
    height: 15,
    resizeMode: 'contain',
    position: 'absolute',
    left: 10,
    top: 11,
  },
  restaurantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e6eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  restaurantIcon: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  restaurantText: {
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    fontWeight: '400',
  },
  foodName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
    marginBottom: 4,
  },
  foodDesc: {
    color: '#a0a5ba',
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    resizeMode: 'contain',
  },
  infoText: {
    fontSize: 13,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    fontWeight: '500',
    marginRight: 0,
  },
  label: {
    fontSize: 13,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
    fontWeight: '700',
    marginBottom: 8,
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sizeBtn: {
    backgroundColor: '#f5f6fa',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
  },
  sizeBtnActive: {
    backgroundColor: '#ff7621',
  },
  sizeText: {
    fontSize: 16,
    color: '#181c2e',
    fontFamily: 'Sen-Regular',
  },
  sizeTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ingredientBtn: {
    backgroundColor: '#ffe5d0',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  ingredientIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 28,
    color: '#181c2e',
    fontFamily: 'Sen-Bold',
    fontWeight: '700',
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181c2e',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  qtyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  addCartBtn: {
    backgroundColor: '#ff7621',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Sen-Bold',
  },
});

export default FoodDetailsScreen; 