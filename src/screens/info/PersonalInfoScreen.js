import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { userAPI } from '../../services';

export default function PersonalInfoScreen(props) {
  // Sử dụng navigation từ props nếu có, nếu không thì dùng useNavigation
  const route = useRoute();
  const hookNavigation = useNavigation();
  const navigation = props.navigation || hookNavigation;
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(route.params?.userData);
  const [loading, setLoading] = useState(!userData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Chỉ tải lại dữ liệu khi màn hình được focus
    if (isFocused) {
      // Nếu có flag refresh hoặc không có userData, tải dữ liệu từ API
      if (route.params?.refresh || !userData) {
        fetchUserProfile();
      }
      // Nếu có userData mới từ params, cập nhật state
      else if (route.params?.userData) {
        setUserData(route.params.userData);
      }
    }
  }, [isFocused, route.params]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching user profile from API...');
      const response = await userAPI.getProfile();
      
      if (response.success) {
        // Backend trả về full_name từ fullName trong entity
        const profileData = response.data;
        console.log('API getProfile success, data:', JSON.stringify(profileData));
        setUserData(profileData);
      } else {
        setError(response.message);
        console.error('API getProfile failed:', response.message);
        Alert.alert('Lỗi', response.message || 'Không thể tải thông tin hồ sơ');
      }
    } catch (err) {
      setError(err.message);
      console.error('API getProfile error:', err.message);
      Alert.alert('Lỗi', err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  // Hàm điều hướng an toàn
  const safeNavigate = (screenName, params = {}) => {
    if (navigation) {
      navigation.navigate(screenName, params);
    } else {
      console.error('Navigation is not available');
      Alert.alert('Lỗi', 'Không thể điều hướng, vui lòng thử lại');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ff7621" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => {
          // Sử dụng hàm điều hướng an toàn
          safeNavigate('Menu');
        }}>
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin cá nhân</Text>
        <TouchableOpacity onPress={() => {
          // Sử dụng hàm điều hướng an toàn
          safeNavigate('EditProfile', { userData });
        }}>
          <Text style={styles.editText}>SỬA</Text>
        </TouchableOpacity>
      </View>

      {/* Profile info */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarWrapper}>
          {userData?.avatar ? (
            <Image 
              source={{ uri: userData.avatar }} 
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
        <View>
          <Text style={styles.name}>{userData?.full_name || 'Tên người dùng'}</Text>
        </View>
      </View>

      {/* Info card */}
      <View style={styles.infoCard}>
        <InfoRow label="HỌ VÀ TÊN" value={userData?.full_name || 'Chưa cung cấp'} />
        <InfoRow label="EMAIL" value={userData?.email || userData?.account?.email || 'Chưa cung cấp'} />
        <InfoRow label="SỐ ĐIỆN THOẠI" value={userData?.phone || 'Chưa cung cấp'} />
        <InfoRow label="ĐỊA CHỈ" value={userData?.address || 'Chưa cung cấp'} />
      </View>
    </View>
  );
}

function InfoRow({ label, value }) {
  // Xác định icon dựa vào label
  let iconName = 'person-outline';
  
  if (label === 'EMAIL') {
    iconName = 'mail-outline';
  } else if (label === 'SỐ ĐIỆN THOẠI') {
    iconName = 'call-outline';
  } else if (label === 'ĐỊA CHỈ') {
    iconName = 'location-outline';
  }

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconPlaceholder}>
        <Ionicons name={iconName} size={20} color="#ff7621" />
      </View>
      <View style={styles.infoTextGroup}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 50,
    marginBottom: 20,
  },
  circleBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#ecf0f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#e0e0e0',
  },
  title: {
    fontSize: 17,
    fontWeight: '400',
    color: '#181c2e',
  },
  editText: {
    color: '#ff7621',
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 24,
    marginBottom: 20,
    width: '100%',
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f6f8fa',
    marginRight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#32343e',
    marginBottom: 4,
  },
  infoCard: {
    backgroundColor: '#f6f8fa',
    borderRadius: 16,
    marginHorizontal: 24,
    paddingVertical: 16,
    paddingHorizontal: 0,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 20,
  },
  infoIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoTextGroup: {
    flexDirection: 'column',
  },
  infoLabel: {
    color: '#32343e',
    fontSize: 14,
    fontWeight: '400',
  },
  infoValue: {
    color: '#6b6e82',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 