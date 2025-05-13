import React, { useState, useEffect } from 'react';
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
  Switch,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';

// Ingredient component for display of selectable ingredients
const IngredientOption = ({ name, icon, selected, onSelect }) => {
  return (
    <TouchableOpacity 
      style={[styles.ingredientOption, selected && styles.selectedIngredientOption]} 
      onPress={onSelect}
    >
      <View style={[styles.ingredientIcon, selected && styles.selectedIngredientIcon]}>
        {icon}
      </View>
      <Text style={[styles.ingredientName, selected && styles.selectedIngredientName]}>{name}</Text>
    </TouchableOpacity>
  );
};

const EditItemScreen = ({ route }) => {
  const navigation = useNavigation();
  const { item } = route.params; // Get the item data passed from previous screen
  
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState(item.name || '');
  const [price, setPrice] = useState(item.price ? item.price.toString() : '');
  const [details, setDetails] = useState(item.description || '');
  const [pickupSelected, setPickupSelected] = useState(item.pickupAvailable ?? true);
  const [deliverySelected, setDeliverySelected] = useState(item.deliveryAvailable ?? false);
  const [images, setImages] = useState(item.images || []);
  const [errors, setErrors] = useState({});
  
  // For tracking selected ingredients
  const [selectedBasicIngredients, setSelectedBasicIngredients] = useState(item.basicIngredients || []);
  const [selectedFruits, setSelectedFruits] = useState(item.fruits || []);
  
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

  const validateForm = () => {
    const newErrors = {};
    if (!itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!details.trim()) {
      newErrors.details = 'Details are required';
    }
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    if (selectedBasicIngredients.length === 0) {
      newErrors.ingredients = 'Please select at least one ingredient';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
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

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert('Error', 'Error picking image');
      } else {
        const newImage = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        };
        setImages([...images, newImage]);
      }
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleBackPress = () => {
    const hasChanges = 
      itemName !== item.name ||
      price !== item.price.toString() ||
      details !== item.description ||
      pickupSelected !== item.pickupAvailable ||
      deliverySelected !== item.deliveryAvailable ||
      JSON.stringify(selectedBasicIngredients) !== JSON.stringify(item.basicIngredients) ||
      JSON.stringify(selectedFruits) !== JSON.stringify(item.fruits) ||
      images.length !== item.images.length;

    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Do you want to discard them?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(CommonActions.goBack()),
          },
        ]
      );
    } else {
      navigation.dispatch(CommonActions.goBack());
    }
  };
  
  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Here you would typically upload new images and update the item data
      // For now, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedItem = {
        ...item,
        name: itemName,
        price: parseFloat(price),
        description: details,
        pickupAvailable: pickupSelected,
        deliveryAvailable: deliverySelected,
        basicIngredients: selectedBasicIngredients,
        fruits: selectedFruits,
        images: images,
      };
      
      Alert.alert(
        'Success',
        'Item has been updated successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              // Pass the updated item back to the previous screen
              navigation.navigate('MyFood', { updatedItem });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    Alert.alert(
      'Reset Form',
      'Are you sure you want to reset all fields to their original values?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setItemName(item.name || '');
            setPrice(item.price ? item.price.toString() : '');
            setDetails(item.description || '');
            setSelectedBasicIngredients(item.basicIngredients || []);
            setSelectedFruits(item.fruits || []);
            setImages(item.images || []);
            setErrors({});
            setPickupSelected(item.pickupAvailable ?? true);
            setDeliverySelected(item.deliveryAvailable ?? false);
          },
        },
      ]
    );
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
        <Text style={styles.pageTitle}>Edit Item</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetButton}>RESET</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Item Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ITEM NAME</Text>
          <TextInput 
            style={[styles.textInput, errors.itemName && styles.inputError]}
            value={itemName}
            onChangeText={(text) => {
              setItemName(text);
              if (errors.itemName) {
                setErrors({...errors, itemName: null});
              }
            }}
            placeholder="Enter item name"
            placeholderTextColor="#A0A0A0"
          />
          {errors.itemName && <Text style={styles.errorText}>{errors.itemName}</Text>}
        </View>
        
        {/* Upload Photo/Video */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UPLOAD PHOTO/VIDEO</Text>
          <View style={styles.uploadContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 3 && (
              <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
                <Ionicons name="cloud-upload-outline" size={24} color="#6B63F6" />
                <Text style={styles.uploadText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
          {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
        </View>
        
        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRICE</Text>
          <View style={styles.priceSection}>
            <View style={{ flex: 1 }}>
              <TextInput 
                style={[styles.priceInput, errors.price && styles.inputError]}
                value={price}
                onChangeText={(text) => {
                  setPrice(text);
                  if (errors.price) {
                    setErrors({...errors, price: null});
                  }
                }}
                placeholder="$0"
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>
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
          {errors.ingredients && <Text style={styles.errorText}>{errors.ingredients}</Text>}
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
            style={[styles.detailsInput, errors.details && styles.inputError]}
            value={details}
            onChangeText={(text) => {
              setDetails(text);
              if (errors.details) {
                setErrors({...errors, details: null});
              }
            }}
            placeholder="Enter item details"
            placeholderTextColor="#A0A0A0"
            multiline
            textAlignVertical="top"
          />
          {errors.details && <Text style={styles.errorText}>{errors.details}</Text>}
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSaveChanges}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
          )}
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
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40,
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
  inputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 4,
  },
  uploadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
    marginBottom: 16,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    marginBottom: 16,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B63F6',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  priceInput: {
    width: '100%',
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
    marginLeft: 16,
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
  selectedIngredientIcon: {
    backgroundColor: '#FB6D3A',
  },
  ingredientName: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
  },
  selectedIngredientName: {
    color: '#FB6D3A',
    fontWeight: '500',
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default EditItemScreen; 