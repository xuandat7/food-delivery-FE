import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
  Dimensions,
  UIManager,
  findNodeHandle
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { restaurantAPI } from '../../services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditRestaurantScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const info = route.params?.info || {};
  
  const [name, setName] = useState(info.name || '');
  const [email, setEmail] = useState(info.email || '');
  const [phone, setPhone] = useState(info.phone || '');
  const [address, setAddress] = useState(info.address || '');
  const [description, setDescription] = useState(info.description || '');
  const [type, setType] = useState(info.type || '');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Keyboard states
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Input refs
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const descriptionRef = useRef(null);
  const typeRef = useRef(null);
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
    
    setTimeout(() => {
      const nodeHandle = findNodeHandle(fieldRef.current);
      if (!nodeHandle) return;
      
      UIManager.measure(nodeHandle, (x, y, width, height, pageX, pageY) => {
        const inputBottom = pageY + height;
        const screenHeight = Dimensions.get('window').height;
        const keyboardTop = screenHeight - keyboardHeight;
        const paddingForVisibility = 20;
        
        if (inputBottom + paddingForVisibility > keyboardTop) {
          scrollViewRef.current?.scrollTo({ 
            y: pageY - 100,
            animated: true 
          });
        }
      });
    }, 100);
  };

  // Xin quyền truy cập thư viện ảnh
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Thông báo', 'Cần quyền truy cập thư viện ảnh để thay đổi ảnh nhà hàng.');
        }
      }
    })();
  }, []);

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        console.log('Selected asset:', JSON.stringify(result.assets[0]));
        setAvatar(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nhà hàng');
      return;
    }

    setLoading(true);
    try {
      // Chuẩn bị dữ liệu cần cập nhật
      const updateData = {
        id: info.id,
        name,
        phone,
        address,
        description,
        type
      };
      
      console.log('Restaurant data before update:', updateData);
      
      // Thêm ảnh nếu đã chọn ảnh mới
      if (avatar && avatar.uri) {
        console.log('Adding new image to update data');
        updateData.image = {
          uri: avatar.uri,
          type: avatar.type || 'image/jpeg',
          name: avatar.fileName || avatar.uri.split('/').pop() || 'restaurant_image.jpg',
        };
      }
      
      // In ra FormData để debug
      console.log('Sending update request to API with data:', JSON.stringify(updateData));
      
      const res = await restaurantAPI.updateProfile(updateData);
      console.log('API response:', res);
      
      if (res.success) {
        // Cập nhật lại thông tin nhà hàng trong AsyncStorage
        try {
          const profileData = await AsyncStorage.getItem('restaurantProfile');
          if (profileData) {
            const parsedData = JSON.parse(profileData);
            const updatedProfile = { ...parsedData, ...updateData };
            await AsyncStorage.setItem('restaurantProfile', JSON.stringify(updatedProfile));
            console.log('Updated restaurant profile in AsyncStorage');
          }
        } catch (e) {
          console.error('Error updating AsyncStorage:', e);
        }
        
        Alert.alert('Thành công', 'Cập nhật thông tin nhà hàng thành công!', [
          { text: 'OK', onPress: () => {
            // Quay lại và refresh màn hình thông tin
            navigation.navigate('RestaurantInfo', { refresh: true });
          }}
        ]);
      } else {
        Alert.alert('Lỗi', res.message || 'Cập nhật thất bại!');
      }
    } catch (e) {
      console.error('Error updating restaurant:', e);
      Alert.alert('Lỗi', e.message || 'Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{
          ...styles.scrollContainer,
          paddingBottom: keyboardVisible ? 150 : 80
        }}
      >
        {/* Top bar */}
        <View style={styles.top}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Chỉnh sửa thông tin nhà hàng</Text>
        </View>

        {/* Restaurant Image */}
        <View style={styles.profileImageContainer}>
          {avatar ? (
            <Image source={{ uri: avatar.uri }} style={styles.profileImage} />
          ) : info.image_url ? (
            <Image source={{ uri: info.image_url }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage} />
          )}
          <TouchableOpacity style={styles.editIconButton} onPress={pickImage}>
            <Feather name="edit-2" size={17} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formField}>
          <Text style={styles.label}>TÊN NHÀ HÀNG</Text>
          <TextInput
            style={[styles.input, styles.editableInput]}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên nhà hàng"
            placeholderTextColor="#000000"
            ref={nameRef}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            onFocus={() => handleInputFocus(nameRef)}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={[styles.input, styles.nonEditableInput]}
            value={email}
            placeholder="Email không thể thay đổi"
            placeholderTextColor="#6B6E82"
            editable={false}
            ref={emailRef}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>SỐ ĐIỆN THOẠI</Text>
          <TextInput
            style={[styles.input, styles.editableInput]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#000000"
            keyboardType="phone-pad"
            ref={phoneRef}
            returnKeyType="next"
            onSubmitEditing={() => addressRef.current?.focus()}
            onFocus={() => handleInputFocus(phoneRef)}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>ĐỊA CHỈ</Text>
          <TextInput
            style={[styles.input, styles.editableInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Nhập địa chỉ nhà hàng"
            placeholderTextColor="#000000"
            ref={addressRef}
            returnKeyType="next"
            onSubmitEditing={() => typeRef.current?.focus()}
            onFocus={() => handleInputFocus(addressRef)}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>LOẠI NHÀ HÀNG</Text>
          <TextInput
            style={[styles.input, styles.editableInput]}
            value={type}
            onChangeText={setType}
            placeholder="Nhập loại nhà hàng (Á, Âu, Việt Nam,...)"
            placeholderTextColor="#000000"
            ref={typeRef}
            returnKeyType="next"
            onSubmitEditing={() => descriptionRef.current?.focus()}
            onFocus={() => handleInputFocus(typeRef)}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>MÔ TẢ</Text>
          <TextInput
            style={[styles.input, styles.multilineInput, styles.editableInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Nhập mô tả về nhà hàng"
            placeholderTextColor="#000000"
            multiline={true}
            numberOfLines={4}
            ref={descriptionRef}
            onFocus={() => handleInputFocus(descriptionRef)}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>LƯU THAY ĐỔI</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 24,
    marginBottom: 30,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#ECF0F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#181C2E',
    fontSize: 17,
    marginLeft: 16,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 120,
    borderRadius: 15,
    backgroundColor: '#FFCDB6',
  },
  editIconButton: {
    width: 41,
    height: 41,
    borderRadius: 20.5,
    backgroundColor: '#3498db',
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formField: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#32343E',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 60,
    backgroundColor: '#F0F5FA',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#6B6E82',
  },
  multilineInput: {
    height: 120,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  editableInput: {
    borderWidth: 1,
    borderColor: '#3498db',
    color: '#000000',
  },
  nonEditableInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    color: '#A0A0A0',
  },
  saveButton: {
    height: 56,
    backgroundColor: '#3498db',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditRestaurantScreen; 