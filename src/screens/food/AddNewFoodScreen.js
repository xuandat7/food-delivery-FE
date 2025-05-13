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
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  FlatList
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../../services/api';

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

const AddNewItemsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isEditing = route.params?.isEditing || false;
  const editingFood = route.params?.foodItem || null;
  
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [details, setDetails] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [pickupSelected, setPickupSelected] = useState(true);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Populate form with data when editing
  useEffect(() => {
    if (isEditing && editingFood) {
      setItemName(editingFood.name || '');
      setPrice(editingFood.price ? editingFood.price.toString() : '');
      setDetails(editingFood.description || '');
      setSelectedCategory(editingFood.category || '');
      
      // Set image if thumbnail exists
      if (editingFood.thumbnail) {
        setImage({ uri: editingFood.thumbnail });
      }
    }
  }, [isEditing, editingFood]);
  
  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Xin quyền truy cập thư viện ảnh khi component được mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Thông báo', 'Cần quyền truy cập thư viện ảnh để chọn ảnh món ăn.');
        }
      }
    })();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      
      // Phương pháp 1: Lấy categories từ profile nhà hàng
      const profileResponse = await api.restaurant.getProfile();
      
      if (profileResponse.success && profileResponse.data) {
        // Tạo danh sách categories từ dishes trong profile
        const uniqueCategories = new Set();
        
        // 1. Lấy danh sách categories từ dishes
        if (profileResponse.data.dishes && profileResponse.data.dishes.length > 0) {
          profileResponse.data.dishes.forEach(dish => {
            if (dish.category) {
              uniqueCategories.add(dish.category);
            }
          });
        }
        
        // Nếu lấy được categories từ dishes
        if (uniqueCategories.size > 0) {
          const categoryArray = Array.from(uniqueCategories);
          setCategories(categoryArray);
          
          if (!selectedCategory) {
            setSelectedCategory(categoryArray[0]);
          }
          
          console.log('Danh sách danh mục từ profile:', categoryArray);
          setLoadingCategories(false);
          return;
        }
        
        // Phương pháp 2: Nếu không có categories từ dishes, thử lấy từ API categories
        try {
          if (profileResponse.data.id) {
            console.log('Thử lấy danh mục từ API categories với ID:', profileResponse.data.id);
            const categoryResponse = await api.category.getCategoriesByRestaurant(profileResponse.data.id);
            
            if (categoryResponse.success && categoryResponse.data && categoryResponse.data.length > 0) {
              // Transform category objects to strings containing just the name
              const categoryNames = categoryResponse.data.map(cat => cat.name);
              setCategories(categoryNames);
              
              if (!selectedCategory && categoryNames.length > 0) {
                setSelectedCategory(categoryNames[0]);
              }
              
              console.log('Danh sách danh mục từ API categories:', categoryNames);
              setLoadingCategories(false);
              return;
            }
          }
        } catch (categoryError) {
          console.error('Error fetching categories from API:', categoryError);
        }
      }
      
      // Phương pháp 3: Sử dụng danh mục mặc định nếu không lấy được từ cả hai nguồn
      const defaultCategories = [
        'Món chính',
        'Món phụ',
        'Món tráng miệng',
        'Đồ uống',
        'Đặc sản'
      ];
      
      console.log('Sử dụng danh mục mặc định');
      setCategories(defaultCategories);
      if (!selectedCategory) {
        setSelectedCategory(defaultCategories[0]);
      }
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Sử dụng danh mục mặc định trong trường hợp lỗi
      const defaultCategories = [
        'Món chính',
        'Món phụ',
        'Món tráng miệng',
        'Đồ uống',
        'Đặc sản'
      ];
      
      setCategories(defaultCategories);
      if (!selectedCategory) {
        setSelectedCategory(defaultCategories[0]);
      }
    } finally {
      setLoadingCategories(false);
    }
  };

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
    if (itemName || price || details || images.length > 0) {
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
      // Here you would typically upload images and save the item data
      // For now, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Item has been saved successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.dispatch(CommonActions.goBack()),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    Alert.alert(
      'Reset Form',
      'Are you sure you want to reset all fields?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setItemName('');
            setPrice('');
            setDetails('');
            setSelectedBasicIngredients([]);
            setSelectedFruits([]);
            setImages([]);
            setErrors({});
            setPickupSelected(true);
            setDeliverySelected(false);
          },
        },
      ]
    );
  };
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => {
        setSelectedCategory(item);
        setCategoryModalVisible(false);
      }}
    >
      <Text style={styles.categoryItemText}>{item}</Text>
    </TouchableOpacity>
  );
  
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
        <Text style={styles.pageTitle}>
          {isEditing ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
        </Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetButton}>RESET</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Item Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TÊN MÓN ĂN</Text>
          <TextInput 
            style={[styles.textInput, errors.itemName && styles.inputError]}
            value={itemName}
            onChangeText={(text) => {
              setItemName(text);
              if (errors.itemName) {
                setErrors({...errors, itemName: null});
              }
            }}
            placeholder="Nhập tên món ăn"
            placeholderTextColor="#A0A0A0"
          />
          {errors.itemName && <Text style={styles.errorText}>{errors.itemName}</Text>}
        </View>
        
        {/* Category Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DANH MỤC</Text>
          {loadingCategories ? (
            <ActivityIndicator size="small" color="#3498db" />
          ) : (
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => {
                if (categories.length > 0) {
                  setCategoryModalVisible(true);
                } else {
                  Alert.alert('Thông báo', 'Không có danh mục nào. Vui lòng nhập thủ công.');
                }
              }}
            >
              <Text style={selectedCategory ? styles.selectedCategoryText : styles.placeholderText}>
                {selectedCategory || 'Chọn danh mục'}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          )}
          
          {/* Category manual input when no categories */}
          {categories.length === 0 && (
            <TextInput 
              style={[styles.textInput, { marginTop: 8 }]}
              value={selectedCategory}
              onChangeText={setSelectedCategory}
              placeholder="Nhập tên danh mục mới"
              placeholderTextColor="#A0A0A0"
            />
          )}
          
          {/* Category Selection Modal */}
          <Modal
            transparent={true}
            visible={categoryModalVisible}
            onRequestClose={() => setCategoryModalVisible(false)}
            animationType="fade"
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setCategoryModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Chọn danh mục</Text>
                <FlatList
                  data={categories}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.categoriesList}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        
        {/* Upload Photo/Video */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TẢI LÊN HÌNH ẢNH</Text>
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
                <Text style={styles.uploadText}>Thêm ảnh</Text>
              </TouchableOpacity>
            )}
          </View>
          {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
        </View>
        
        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GIÁ</Text>
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
                placeholder="0"
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
          <Text style={styles.sectionTitle}>MÔ TẢ</Text>
          <TextInput 
            style={[styles.detailsInput, errors.details && styles.inputError]}
            value={details}
            onChangeText={(text) => {
              setDetails(text);
              if (errors.details) {
                setErrors({...errors, details: null});
              }
            }}
            placeholder="Nhập mô tả món ăn"
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
  categorySelector: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCategoryText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoriesList: {
    maxHeight: 300,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AddNewItemsScreen;