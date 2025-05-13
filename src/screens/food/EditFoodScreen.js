import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  UIManager,
  findNodeHandle
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { dishAPI } from '../../services';

const EditFoodScreen = ({ route, navigation }) => {
  const { foodItem } = route.params || {};
  const isEditing = !!foodItem;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Keyboard states
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Input refs
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const scrollViewRef = useRef(null);

  // Tạo danh sách danh mục mẫu
  const defaultCategories = [
    'Món chính',
    'Món khai vị', 
    'Món tráng miệng',
    'Đồ uống',
    'Đặc sản'
  ];
  
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

  useEffect(() => {
    if (isEditing && foodItem) {
      setName(foodItem.name || '');
      setPrice(foodItem.price ? foodItem.price.toString() : '');
      setDescription(foodItem.description || '');
      setCategory(foodItem.category || '');
      setImage(foodItem.thumbnail || null);
    }
    
    // Tải danh sách danh mục từ API hoặc sử dụng danh mục mặc định
    setCategoryList(defaultCategories);
  }, []);

  const pickImage = async () => {
    try {
      // Yêu cầu quyền truy cập thư viện ảnh
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Cần cấp quyền truy cập thư viện ảnh để chọn hình');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        console.log('Đã chọn ảnh:', selectedImage);
        setImage(selectedImage);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn hình ảnh');
    }
  };

  const handleSaveFood = async () => {
    // Kiểm tra dữ liệu đầu vào
    if (!name.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên món ăn');
      return;
    }
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập giá hợp lệ');
      return;
    }
    
    if (!category) {
      Alert.alert('Thông báo', 'Vui lòng chọn danh mục');
      return;
    }
    
    try {
      setLoading(true);
      
      // Chuẩn bị dữ liệu đơn giản
      const dishData = {
        name,
        price: parseFloat(price),
        description: description || '',
        category,
      };
      
      // Xử lý hình ảnh
      if (image) {
        // Nếu image là URI string (đường dẫn ảnh mới được chọn)
        if (image !== foodItem?.thumbnail) {
          // Đây là ảnh mới được chọn, không phải URL từ server
          if (image.startsWith('file://') || image.startsWith('content://')) {
            dishData.thumbnail = {
              uri: image,
              name: image.split('/').pop(),
              type: 'image/jpeg'
            };
          } else {
            // Trường hợp image là URL từ server
            dishData.thumbnail = image;
          }
        } else {
          // Giữ nguyên thumbnail cũ
          dishData.thumbnail = image;
        }
      }
      
      console.log('Gửi dữ liệu:', dishData);
      
      let response;
      
      if (isEditing && foodItem) {
        // Gọi API cập nhật món ăn
        response = await dishAPI.updateDish(foodItem.id, dishData);
        console.log('Kết quả cập nhật:', response);
      } else {
        // Gọi API tạo món ăn mới
        response = await dishAPI.addDish(dishData);
      }
      
      if (response.success) {
        Alert.alert(
          'Thành công', 
          isEditing ? 'Đã cập nhật món ăn thành công' : 'Đã thêm món ăn mới thành công',
          [
            { 
              text: 'OK', 
              onPress: () => {
                try {
                  // Đơn giản chỉ quay lại màn hình trước đó
                  navigation.goBack();
                } catch (error) {
                  console.error('Navigation error:', error);
                  // Nếu có lỗi, không làm gì cả để giữ người dùng ở màn hình hiện tại
                }
              }
            }
          ]
        );
      } else {
        Alert.alert('Lỗi', response.message || 'Có lỗi xảy ra khi lưu món ăn');
      }
      
    } catch (error) {
      console.error('Error saving dish:', error);
      Alert.alert('Lỗi', `Có lỗi xảy ra khi lưu món ăn: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn nút trở lại
  const handleBackPress = () => {
    // Kiểm tra xem người dùng đã thay đổi thông tin chưa
    const hasChanges = 
      (isEditing && (
        name !== foodItem.name || 
        price.toString() !== foodItem.price?.toString() ||
        description !== foodItem.description ||
        category !== foodItem.category ||
        (image && image !== foodItem.thumbnail)
      )) || 
      (!isEditing && (name || price || description || category || image));
    
    if (hasChanges) {
      // Nếu có thay đổi, hiển thị thông báo xác nhận
      Alert.alert(
        'Xác nhận',
        'Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát không?',
        [
          {
            text: 'Hủy',
            style: 'cancel'
          },
          {
            text: 'Thoát',
            style: 'destructive',
            onPress: () => {
              try {
                navigation.goBack();
              } catch (error) {
                console.error('Navigation error:', error);
              }
            }
          }
        ]
      );
    } else {
      // Nếu không có thay đổi, thoát trực tiếp
      try {
        navigation.goBack();
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
            >
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
            </Text>
          </View>
          
          {/* Hình ảnh */}
          <TouchableOpacity 
            style={styles.imageContainer} 
            onPress={pickImage}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.foodImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <FontAwesome name="camera" size={40} color="#ddd" />
                <Text style={styles.imagePlaceholderText}>Chọn ảnh</Text>
              </View>
            )}
            <View style={styles.editImageButton}>
              <Ionicons name="pencil" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
          
          {/* Form */}
          <View style={styles.formContainer}>
            {/* Tên món */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên món ăn<Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên món ăn"
                placeholderTextColor="#999"
                ref={nameRef}
                returnKeyType="next"
                onSubmitEditing={() => priceRef.current?.focus()}
                onFocus={() => handleInputFocus(nameRef)}
              />
            </View>
            
            {/* Giá */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Giá<Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Nhập giá"
                placeholderTextColor="#999"
                keyboardType="numeric"
                ref={priceRef}
                returnKeyType="next"
                onSubmitEditing={() => categoryRef.current?.focus()}
                onFocus={() => handleInputFocus(priceRef)}
              />
            </View>
            
            {/* Danh mục */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Danh mục<Text style={styles.requiredStar}>*</Text></Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                ref={categoryRef}
                onFocus={() => handleInputFocus(categoryRef)}
              >
                <Text style={styles.dropdownButtonText}>
                  {category || 'Chọn danh mục'}
                </Text>
                <Ionicons 
                  name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#333" 
                />
              </TouchableOpacity>
              
              {showCategoryDropdown && (
                <View style={styles.dropdownList}>
                  {categoryList.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategory(item);
                        setShowCategoryDropdown(false);
                        descriptionRef.current?.focus();
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        category === item && styles.selectedDropdownItemText
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            {/* Mô tả */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Nhập mô tả món ăn"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                ref={descriptionRef}
                onFocus={() => handleInputFocus(descriptionRef)}
              />
            </View>
            
            {/* Nút lưu */}
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveFood}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Cập nhật' : 'Thêm món ăn'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  imageContainer: {
    marginTop: 20,
    alignSelf: 'center',
    width: '90%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
    overflow: 'hidden',
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  editImageButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#3498db',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
  },
  dropdownButton: {
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDropdownItemText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditFoodScreen; 