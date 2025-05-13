import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../services/api';

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

  // Tạo danh sách danh mục mẫu
  const defaultCategories = [
    'Món chính',
    'Món khai vị', 
    'Món tráng miệng',
    'Đồ uống',
    'Đặc sản'
  ];

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
        mediaTypes: 'image',
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
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
        restaurantId: 1,
      };
      
      // Nếu có hình ảnh mới, thêm vào dishData
      if (image && (!foodItem || image !== foodItem.thumbnail)) {
        dishData.thumbnail = image;
      }
      
      console.log('Gửi dữ liệu:', dishData);
      
      let response;
      
      // Xử lý chỉnh sửa món ăn
      if (isEditing && foodItem) {
        try {
          // Gọi API cập nhật trực tiếp thay vì tạo mới và xóa cũ
          response = await api.restaurant.updateDish(foodItem.id, dishData);
          console.log('Kết quả cập nhật:', response);
        } catch (updateError) {
          console.error('Lỗi khi cập nhật:', updateError);
          
          // Nếu cập nhật thất bại, thử phương án tạo mới và xóa cũ
          console.log('Chuyển sang phương án dự phòng: tạo mới và xóa cũ');
          response = await api.restaurant.createDish(dishData);
          
          if (response.success) {
            console.log('Tạo món ăn mới thành công:', response.data);
            
            // Nếu tạo thành công, xóa món cũ
            try {
              const deleteResponse = await api.restaurant.deleteDish(foodItem.id);
              console.log('Kết quả xóa món cũ:', deleteResponse);
            } catch (deleteError) {
              console.error('Lỗi khi xóa món cũ:', deleteError);
              // Không báo lỗi cho người dùng vì món mới đã được tạo thành công
            }
          }
        }
      } else {
        // Gọi API tạo món ăn mới
        response = await api.restaurant.createDish(dishData);
      }
      
      if (response.success) {
        Alert.alert(
          'Thành công', 
          isEditing ? 'Đã cập nhật món ăn thành công' : 'Đã thêm món ăn mới thành công',
          [
            { 
              text: 'OK', 
              onPress: () => navigateBack()
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
            onPress: () => navigateBack()
          }
        ]
      );
    } else {
      // Nếu không có thay đổi, thoát trực tiếp
      navigateBack();
    }
  };
  
  // Hàm điều hướng quay lại an toàn
  const navigateBack = () => {
    try {
      // Thử goBack trước
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        // Nếu không thể goBack, chuyển đến màn hình chính
        navigation.navigate('RestaurantTabs');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback nếu cả hai cách trên đều không hoạt động
      navigation.reset({
        index: 0,
        routes: [{ name: 'RestaurantTabs' }],
      });
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
              />
            </View>
            
            {/* Danh mục */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Danh mục<Text style={styles.requiredStar}>*</Text></Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
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
    marginTop: 50,
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