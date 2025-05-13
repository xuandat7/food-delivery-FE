import React, { useState, useEffect } from 'react';
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
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { userAPI, AsyncStorage } from '../../services';
import restaurantAPI from '../../services/restaurantAPI';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // Ưu tiên info (restaurant), fallback userData (user)
  const info = route.params?.info || {};
  const userData = route.params?.userData || {};
  // Nếu là nhà hàng thì lấy info, nếu là user thì lấy userData
  const [name, setName] = useState(info.name || userData.full_name || userData.fullName || '');
  const [email, setEmail] = useState(info.email || userData.email || userData.account?.email || '');
  const [phone, setPhone] = useState(info.phone || userData.phone || '');
  const [address, setAddress] = useState(info.address || userData.address || '');
  const [description, setDescription] = useState(info.description || userData.description || '');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // Xin quyền truy cập thư viện ảnh khi component được mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Thông báo', 'Cần quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.');
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
        aspect: [1, 1],
        quality: 0.7,
      });

      // Ghi log cấu trúc dữ liệu trả về từ image picker để debug
      console.log('ImagePicker result structure:', JSON.stringify(result));

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
    try {
      setIsLoading(true);
      
      // Chuẩn bị dữ liệu người dùng cần cập nhật - sử dụng full_name theo yêu cầu API
      const updatedData = {
        full_name: fullName, // Sử dụng full_name thay vì fullName
        phone: phone,
        address: address
      };
      
      // Thêm avatar nếu đã chọn ảnh mới
      if (avatar) {
        updatedData.avatar = {
          uri: avatar.uri,
          type: avatar.type || 'image/jpeg',
          name: 'avatar.jpg'
        };
      }
      
      console.log('Sending update with data:', updatedData);
      
      // Gọi API cập nhật thông tin người dùng
      const response = await userAPI.updateProfile(userData.id, updatedData);
      
      if (response.success) {
        Alert.alert('Thành công', 'Thông tin hồ sơ đã được cập nhật');
        
        // Chuẩn bị dữ liệu đã cập nhật để trở về màn hình trước
        // Đảm bảo dữ liệu trả về từ API được xử lý đúng
        const updatedUserData = {
          ...userData,
          ...response.data,
          // Sau khi xem code backend, đảm bảo dữ liệu hiển thị đúng
          // Backend trả về full_name từ trường fullName trong entity
          full_name: response.data.full_name || fullName
        };
        
        console.log('Updated user data after API response:', updatedUserData);
        
        // Sử dụng replace thay vì navigate để thay thế hoàn toàn màn hình hiện tại
        // Điều này sẽ loại bỏ EditProfileScreen khỏi stack điều hướng
        navigation.replace('PersonalInfo', { 
          userData: updatedUserData,
          refresh: true 
        });
      } else {
        Alert.alert('Lỗi', response.message || 'Không thể cập nhật thông tin hồ sơ');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRestaurant = async () => {
    setLoading(true);
    try {
      // Build update data for restaurant (do NOT include email)
      const updateData = {
        id: info.id,
        name,
        phone,
        address,
        description
      };
      // Attach avatar/image if selected
      if (avatar && avatar.uri) {
        updateData.avatar = {
          uri: avatar.uri,
          type: avatar.type || 'image/jpeg',
          name: avatar.fileName || avatar.uri.split('/').pop() || 'avatar.jpg',
        };
      }
      const res = await restaurantAPI.updateProfile(updateData);
      if (res.success) {
        Alert.alert('Thành công', 'Cập nhật thông tin thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Lỗi', res.message || 'Cập nhật thất bại!');
      }
    } catch (e) {
      Alert.alert('Lỗi', e.message || 'Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top bar */}
        <View style={styles.top}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          {avatar ? (
            <Image source={{ uri: avatar.uri }} style={styles.profileImage} />
          ) : userData.avatar ? (
            <Image source={{ uri: userData.avatar }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage} />
          )}
          <TouchableOpacity style={styles.editIconButton} onPress={pickImage}>
            <Feather name="edit-2" size={17} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formField}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            style={[styles.input, styles.editableInput]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#000000"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={[styles.input, styles.nonEditableInput]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#6B6E82"
            keyboardType="email-address"
            editable={false}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <TextInput
            style={[styles.input, styles.editableInput]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor="#000000"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>ADDRESS</Text>
          <TextInput
            style={[styles.input, styles.editableInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            placeholderTextColor="#000000"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.editableInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor="#000000"
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveRestaurant}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>SAVE</Text>
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
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFCDB6',
  },
  editIconButton: {
    width: 41,
    height: 41,
    borderRadius: 20.5,
    backgroundColor: '#FF7621',
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
  },
  input: {
    height: 60,
    backgroundColor: '#F0F5FA',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#6B6E82',
  },
  editableInput: {
    borderWidth: 1,
    borderColor: '#FF7621',
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
    backgroundColor: '#FF7621',
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

export default EditProfileScreen;