import React, { useState, useEffect, useRef } from 'react';
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
  FlatList,
  Keyboard,
  Dimensions,
  UIManager,
  findNodeHandle
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { restaurantAPI, categoryAPI, dishAPI } from '../../services';

const AddNewFoodScreen = () => {
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
  const [restaurantId, setRestaurantId] = useState(null);
  
  // Keyboard states
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Input refs
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const detailsRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  // Keyboard listeners to adjust scroll
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  // Handle focused input to ensure it's visible
  const handleInputFocus = (fieldRef) => {
    if (!fieldRef?.current) return;
    
    // Đảm bảo mã này chỉ chạy sau khi component đã render
    setTimeout(() => {
      const nodeHandle = findNodeHandle(fieldRef.current);
      if (!nodeHandle) return;
      
      // Tính toán vị trí của ô nhập
      UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
        // Tính toán vị trí của đáy ô nhập
        const inputBottom = pageY + height;
        
        // Tính toán vị trí đỉnh của bàn phím
        const screenHeight = Dimensions.get('window').height;
        const keyboardTop = screenHeight - keyboardHeight;
        
        // Thêm khoảng cách để dễ nhìn
        const paddingForVisibility = 20;
        
        // Chỉ cuộn nếu ô nhập bị che bởi bàn phím
        if (inputBottom + paddingForVisibility > keyboardTop) {
          // Cuộn chính xác đến vị trí của ô nhập liệu
          scrollViewRef.current?.scrollTo({ 
            y: pageY - 100, // Cuộn ô nhập lên vị trí cách đỉnh màn hình 100px
            animated: true 
          });
        }
      });
    }, 100);
  };
  
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
      const profileResponse = await restaurantAPI.getProfile();
      
      if (profileResponse.success && profileResponse.data) {
        // Lấy restaurant ID từ profile và lưu lại
        if (profileResponse.data.id) {
          setRestaurantId(profileResponse.data.id);
          console.log('Restaurant ID:', profileResponse.data.id);
        }
        
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
            const categoryResponse = await categoryAPI.getCategoriesByRestaurant(profileResponse.data.id);
            
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

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      // Ghi log cấu trúc dữ liệu trả về từ image picker để debug
      console.log('ImagePicker result structure:', JSON.stringify(result));

      if (!result.canceled) {
        console.log('Selected asset:', JSON.stringify(result.assets[0]));
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const handleBackPress = () => {
    navigation.dispatch(CommonActions.goBack());
  };
  
  const handleSaveChanges = async () => {
    // Validate inputs
    if (!itemName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn');
      return;
    }
    
    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá hợp lệ');
      return;
    }
    
    if (!selectedCategory) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục');
      return;
    }
    
    if (!restaurantId) {
      Alert.alert('Lỗi', 'Không thể xác định nhà hàng của bạn. Vui lòng thử lại sau.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare dish data
      const dishData = {
        name: itemName,
        price: parseFloat(price),
        description: details,
        category: selectedCategory,
        image: image,
        restaurantId: restaurantId // Thêm restaurantId vào dữ liệu gửi lên
      };
      
      console.log('Sending dish data with restaurantId:', restaurantId);
      
      // If editing, add ID to request
      if (isEditing && editingFood) {
        dishData.id = editingFood.id;
      }
      
      // Call API to add/update dish
      const response = isEditing 
        ? await dishAPI.updateDish(editingFood.id, dishData)
        : await dishAPI.addDish(dishData);
      
      if (response.success) {
        Alert.alert(
          isEditing ? 'Thành công' : 'Thành công', 
          isEditing ? 'Cập nhật món ăn thành công' : 'Thêm món ăn mới thành công', 
          [{ text: 'OK', onPress: () => navigation.navigate('RestaurantTabs', { screen: 'MyFood' }) }]
        );
      } else {
        Alert.alert('Lỗi', response.message || (isEditing ? 'Không thể cập nhật món ăn' : 'Không thể thêm món ăn'));
      }
    } catch (error) {
      console.error(isEditing ? 'Error updating dish:' : 'Error adding dish:', error);
      Alert.alert('Lỗi', isEditing ? 'Đã xảy ra lỗi khi cập nhật món ăn' : 'Đã xảy ra lỗi khi thêm món ăn');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    if (isEditing && editingFood) {
      // Reset to original values
      setItemName(editingFood.name || '');
      setPrice(editingFood.price ? editingFood.price.toString() : '');
      setDetails(editingFood.description || '');
      setSelectedCategory(editingFood.category || '');
      if (editingFood.thumbnail) {
        setImage({ uri: editingFood.thumbnail });
      } else {
        setImage(null);
      }
    } else {
      // Clear all fields
      setItemName('');
      setPrice('');
      setDetails('');
      setImage(null);
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      } else {
        setSelectedCategory('');
      }
    }
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
          <Text style={styles.resetButton}></Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={{ 
          paddingBottom: keyboardVisible ? 150 : 50 
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {/* Food Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tên món ăn</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ví dụ: Phở bò tái"
            value={itemName}
            onChangeText={setItemName}
            ref={nameRef}
            returnKeyType="next"
            onSubmitEditing={() => priceRef.current?.focus()}
            onFocus={() => handleInputFocus(nameRef)}
          />
        </View>
        
        {/* Price Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Giá bán (VNĐ)</Text>
          <TextInput 
            style={styles.input}
            placeholder="Ví dụ: 25000"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            ref={priceRef}
            returnKeyType="next"
            onSubmitEditing={() => detailsRef.current?.focus()}
            onFocus={() => handleInputFocus(priceRef)}
          />
        </View>
        
        {/* Category Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Danh mục</Text>
          <TouchableOpacity 
            style={styles.dropdownToggle}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={styles.selectedValue}>
              {selectedCategory || 'Chọn danh mục...'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Food Details Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mô tả chi tiết</Text>
          <TextInput 
            style={[styles.input, styles.multilineInput]}
            placeholder="Mô tả chi tiết về món ăn..."
            multiline={true}
            numberOfLines={4}
            value={details}
            onChangeText={setDetails}
            ref={detailsRef}
            onFocus={() => handleInputFocus(detailsRef)}
          />
        </View>
        
        {/* Upload Photo/Video */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TẢI LÊN HÌNH ẢNH</Text>
          <View style={styles.uploadContainer}>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: image.uri }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#3498db" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadedImage} />
            )}
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Ionicons name="cloud-upload-outline" size={24} color="#6B63F6" />
              <Text style={styles.uploadText}>Thêm ảnh</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSaveChanges}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'CẬP NHẬT' : 'THÊM MÓN ĂN'}
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Extra space to ensure all content is visible */}
        <View style={{ height: 30 }} />
      </ScrollView>
      
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
    marginTop: 10,
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
    marginTop: 0,
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
    color: '#3498db',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginVertical: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  dropdownToggle: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedValue: {
    fontSize: 16,
    color: '#333',
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
  imagePreviewContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
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
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B63F6',
  },
  multilineInput: {
    height: 120,
    paddingVertical: 12,
  },
  saveButton: {
    height: 62,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#7fc7f2',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default AddNewFoodScreen;