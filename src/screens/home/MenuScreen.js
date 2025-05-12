import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import api, { AsyncStorage } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

const profileData = {
  name: 'Vishal Khadok',
  desc: 'I love fast food',
  // avatar: require('../../../assets/profile-avatar.png'), // Để trống, thêm sau
};

const menuItems = [
  {
    section: [
      { label: 'Personal Info' },
      { label: 'Addresses' },
    ],
  },
  {
    section: [
      { label: 'Cart' },
      { label: 'Favourite' },
      { label: 'Notifications' },
      { label: 'Payment Method' },
    ],
  },
];

export default function MenuScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user profile when component mounts
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.user.getProfile();
      if (response.success) {
        setUserData(response.data);
      } else {
        setError(response.message);
        Alert.alert('Error', response.message || 'Failed to load profile');
      }
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Hiển thị thông báo xác nhận trước khi đăng xuất
      Alert.alert(
        'Đăng xuất',
        'Bạn có chắc chắn muốn đăng xuất?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
            onPress: () => setLoading(false),
          },
          {
            text: 'Đăng xuất',
            style: 'destructive',
            onPress: async () => {
              try {
                // Gọi API logout TRƯỚC
                const token = await AsyncStorage.getItem('token');
                if (token) {
                  try {
                    const response = await api.auth.logout();
                    console.log('Logout response:', response);
                  } catch (logoutErr) {
                    console.log('Logout API error (non-critical):', logoutErr);
                  }
                }
                
                // Sau đó mới xóa token và thông tin người dùng
                await AsyncStorage.removeItem('token');
                console.log('Token removed from AsyncStorage');
                
                await AsyncStorage.removeItem('user');
                console.log('User data removed from AsyncStorage');
                
                // Điều hướng về màn hình Auth
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }],
                });
              } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng xuất');
                setLoading(false);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      console.error('Logout process error:', err);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng xuất');
      setLoading(false);
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
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.profileTitle}>Menu</Text>
        <TouchableOpacity style={styles.circleBtn}>
          <View style={styles.iconPlaceholder} />
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
          <Text style={styles.name}>{userData?.full_name || profileData.name}</Text>
          <Text style={styles.desc}>{userData?.desc || profileData.desc}</Text>
        </View>
      </View>

      {/* Menu sections */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          {/* Section 1 */}
          <View style={styles.menuGroup}>
            <MenuItem label={menuItems[0].section[0].label} onPress={() => navigation.navigate('PersonalInfo', { userData })} />
            <MenuItem label={menuItems[0].section[1].label} />
          </View>
          {/* Section 2 */}
          <View style={styles.menuGroup}>
            {menuItems[1].section.map((item, idx) => (
              <MenuItem key={item.label} label={item.label} />
            ))}
          </View>
        </View>
        {/* Logout */}
        <TouchableOpacity 
          style={[styles.logoutBtn, { backgroundColor: '#fff0f0' }]} 
          onPress={handleLogout}
        >
          <View style={styles.logoutContent}>
            <View style={[styles.logoutIconWrapper, { backgroundColor: '#ffecec' }]}>
              <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
            </View>
            <Text style={[styles.logoutText, { color: '#ff3b30', fontWeight: '500' }]}>Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MenuItem({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconWrapper}>
        <View style={styles.menuIconPlaceholder} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <View style={styles.chevronPlaceholder} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
  profileTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#181c2e',
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
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#32343e',
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: '#a0a5ba',
    fontWeight: '400',
  },
  menuSection: {
    width: '100%',
    alignItems: 'center',
  },
  menuGroup: {
    backgroundColor: '#f6f8fa',
    borderRadius: 16,
    width: 327,
    marginBottom: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  menuIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuIconPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#32343e',
    fontWeight: '400',
  },
  chevronPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  logoutBtn: {
    backgroundColor: '#f6f8fa',
    borderRadius: 12,
    width: 200,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 30,
    paddingVertical: 10,
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  logoutIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoutText: {
    fontSize: 14,
    color: '#32343e',
    fontWeight: '400',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
}); 