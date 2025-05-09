import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  StatusBar,
  Switch
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Ingredient component for display of selectable ingredients
const IngredientOption = ({ name, icon, selected, onSelect }) => {
  return (
    <TouchableOpacity 
      style={[styles.ingredientOption, selected && styles.selectedIngredientOption]} 
      onPress={onSelect}
    >
      <View style={styles.ingredientIcon}>
        {icon}
      </View>
      <Text style={styles.ingredientName}>{name}</Text>
    </TouchableOpacity>
  );
};

const AddNewItemsScreen = () => {
  const navigation = useNavigation();
  const [itemName, setItemName] = useState('Mazalichiken Halim');
  const [price, setPrice] = useState('50');
  const [details, setDetails] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum in vel, mattis et amet dui mauris turpis.');
  const [pickupSelected, setPickupSelected] = useState(true);
  const [deliverySelected, setDeliverySelected] = useState(false);
  
  // For tracking selected ingredients
  const [selectedBasicIngredients, setSelectedBasicIngredients] = useState(['Salt', 'Chicken', 'Onion']);
  const [selectedFruits, setSelectedFruits] = useState([]);
  
  const basicIngredients = [
    { name: 'Salt', icon: <MaterialCommunityIcons name="shaker-outline" size={16} color="#FB6D3A" /> },
    { name: 'Chicken', icon: <MaterialIcons name="fastfood" size={16} color="#FB6D3A" /> },
    { name: 'Onion', icon: <MaterialIcons name="local-dining" size={16} color="#FB6D3A" /> },
    { name: 'Garlic', icon: <MaterialIcons name="local-pizza" size={16} color="#FB6D3A" /> },
    { name: 'Peppers', icon: <MaterialIcons name="spa" size={16} color="#FB6D3A" /> },
    { name: 'Ginger', icon: <MaterialIcons name="grass" size={16} color="#FB6D3A" /> },
  ];
  
  const fruits = [
    { name: 'Avocado', icon: <MaterialIcons name="agriculture" size={16} color="#777" /> },
    { name: 'Apple', icon: <MaterialIcons name="eco" size={16} color="#777" /> },
    { name: 'Blueberry', icon: <MaterialIcons name="grain" size={16} color="#777" /> },
    { name: 'Broccoli', icon: <MaterialIcons name="emoji-nature" size={16} color="#777" /> },
    { name: 'Orange', icon: <MaterialIcons name="grass" size={16} color="#777" /> },
    { name: 'Walnut', icon: <MaterialIcons name="spa" size={16} color="#777" /> },
  ];
  
  const toggleBasicIngredient = (name) => {
    if (selectedBasicIngredients.includes(name)) {
      setSelectedBasicIngredients(selectedBasicIngredients.filter(item => item !== name));
    } else {
      setSelectedBasicIngredients([...selectedBasicIngredients, name]);
    }
  };
  
  const toggleFruit = (name) => {
    if (selectedFruits.includes(name)) {
      setSelectedFruits(selectedFruits.filter(item => item !== name));
    } else {
      setSelectedFruits([...selectedFruits, name]);
    }
  };

  const handleBackPress = () => {
    // Use CommonActions to ensure correct back navigation
    navigation.dispatch(CommonActions.goBack());
  };
  
  const handleSaveChanges = () => {
    // Here you would typically save the changes to a backend
    // For now, just navigate back to the dashboard
    navigation.dispatch(CommonActions.goBack());
  };
  
  const handleReset = () => {
    setItemName('');
    setPrice('');
    setDetails('');
    setSelectedBasicIngredients([]);
    setSelectedFruits([]);
    setPickupSelected(true);
    setDeliverySelected(false);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Add New Items</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetButton}>RESET</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Item Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ITEM NAME</Text>
          <TextInput 
            style={styles.textInput}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            placeholderTextColor="#A0A0A0"
          />
        </View>
        
        {/* Upload Photo/Video */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UPLOAD PHOTO/VIDEO</Text>
          <View style={styles.uploadContainer}>
            <View style={styles.uploadedImage} />
            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="cloud-upload-outline" size={24} color="#6B63F6" />
              <Text style={styles.uploadText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="cloud-upload-outline" size={24} color="#6B63F6" />
              <Text style={styles.uploadText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRICE</Text>
          <View style={styles.priceSection}>
            <TextInput 
              style={styles.priceInput}
              value={price}
              onChangeText={setPrice}
              placeholder="$0"
              keyboardType="numeric"
              placeholderTextColor="#A0A0A0"
            />
            <View style={styles.deliveryOptions}>
              <View style={styles.checkboxOption}>
                <TouchableOpacity 
                  style={[styles.checkbox, pickupSelected && styles.checkboxSelected]}
                  onPress={() => setPickupSelected(!pickupSelected)}
                >
                  {pickupSelected && <Feather name="check" size={14} color="#FB6D3A" />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Pick up</Text>
              </View>
              
              <View style={styles.checkboxOption}>
                <TouchableOpacity 
                  style={[styles.checkbox, deliverySelected && styles.checkboxSelected]}
                  onPress={() => setDeliverySelected(!deliverySelected)}
                >
                  {deliverySelected && <Feather name="check" size={14} color="#FB6D3A" />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Delivery</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INGRIDENTS</Text>
          <View style={styles.sectionHeader}>
            <Text style={styles.seeAllText}>Basic</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All <Ionicons name="chevron-down" size={12} color="#A0A0A0" /></Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ingredientsContainer}>
            {basicIngredients.map((ingredient, index) => (
              <IngredientOption 
                key={index}
                name={ingredient.name} 
                icon={ingredient.icon}
                selected={selectedBasicIngredients.includes(ingredient.name)}
                onSelect={() => toggleBasicIngredient(ingredient.name)}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.seeAllText}>Fruit</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All <Ionicons name="chevron-down" size={12} color="#A0A0A0" /></Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ingredientsContainer}>
            {fruits.map((fruit, index) => (
              <IngredientOption 
                key={index}
                name={fruit.name} 
                icon={fruit.icon}
                selected={selectedFruits.includes(fruit.name)}
                onSelect={() => toggleFruit(fruit.name)}
              />
            ))}
          </View>
        </View>
        
        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETAILS</Text>
          <TextInput 
            style={styles.detailsInput}
            value={details}
            onChangeText={setDetails}
            placeholder="Enter item details"
            placeholderTextColor="#A0A0A0"
            multiline
            textAlignVertical="top"
          />
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveChanges}
        >
          <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
        </TouchableOpacity>
        
        {/* Extra space to ensure all content is visible */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10, // Thêm margin-top âm để đẩy nút lên cao hơn
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40, // Offset for the back button to center title
  },
  resetButton: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FB6D3A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 'auto',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  uploadContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    backgroundColor: '#A0B6C7',
    borderRadius: 10,
    marginRight: 16,
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B63F6',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceInput: {
    width: '30%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  deliveryOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FFF1F1',
    borderColor: '#FB6D3A',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  ingredientOption: {
    width: '16%',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedIngredientOption: {
    opacity: 1,
  },
  ingredientIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF1F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  ingredientName: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
  },
  detailsInput: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    height: 62,
    backgroundColor: '#FB6D3A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default AddNewItemsScreen;