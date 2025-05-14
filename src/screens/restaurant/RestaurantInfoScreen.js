import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import restaurantAPI from '../../services/restaurantAPI';

const RestaurantInfoScreen = () => {
  const navigation = useNavigation();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      const res = await restaurantAPI.getProfile();
      if (res.success) {
        setInfo(res.data);
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể tải thông tin nhà hàng');
      }
      setLoading(false);
    };
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FB6D3A" />
      </View>
    );
  }
  if (!info) {
    return <View style={[styles.container, styles.loadingContainer]}><Text>Không có dữ liệu nhà hàng.</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin nhà hàng</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen', { info })}>
          <Text style={styles.editText}>CHỈNH SỬA</Text>
        </TouchableOpacity>
      </View>

      {/* Profile info */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarWrapper}>
          {info?.image_url ? (
            <Image source={{ uri: info.image_url }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
        <View>
          <Text style={styles.name}>{info?.name || 'Tên nhà hàng'}</Text>
        </View>
      </View>

      {/* Info card */}
      <ScrollView contentContainerStyle={styles.infoCard} showsVerticalScrollIndicator={false}>
        <InfoRow label="TÊN NHÀ HÀNG" value={info?.name || 'Chưa có'} icon="storefront-outline" />
        <InfoRow label="EMAIL" value={info?.email || 'Chưa có'} icon="mail-outline" />
        <InfoRow label="SỐ ĐIỆN THOẠI" value={info?.phone || 'Chưa có'} icon="call-outline" />
        <InfoRow label="ĐỊA CHỈ" value={info?.address || 'Chưa có'} icon="location-outline" />
        {info?.description ? (
          <InfoRow label="MÔ TẢ" value={info.description} icon="document-text-outline" />
        ) : null}
      </ScrollView>
    </View>
  );
};

function InfoRow({ label, value, icon }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconPlaceholder}>
        <Ionicons name={icon} size={20} color="#FB6D3A" />
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
  title: {
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
  editText: {
    color: '#FB6D3A',
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});

export default RestaurantInfoScreen;
