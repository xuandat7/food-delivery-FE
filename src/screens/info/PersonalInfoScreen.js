import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../services/api';

export default function PersonalInfoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [userData, setUserData] = useState(route.params?.userData);
  const [loading, setLoading] = useState(!userData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If userData is not passed through route params, fetch it
    if (!userData) {
      fetchUserProfile();
    }
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
          <View style={styles.iconPlaceholder} />
        </TouchableOpacity>
        <Text style={styles.title}>Personal Info</Text>
        <TouchableOpacity>
          <Text style={styles.editText}>EDIT</Text>
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
          <Text style={styles.name}>{userData?.full_name || 'User Name'}</Text>
          <Text style={styles.desc}>{userData?.desc || 'No description'}</Text>
        </View>
      </View>

      {/* Info card */}
      <View style={styles.infoCard}>
        <InfoRow label="FULL NAME" value={userData?.full_name || 'Not provided'} />
        <InfoRow label="EMAIL" value={userData?.email || userData?.account?.email || 'Not provided'} />
        <InfoRow label="PHONE NUMBER" value={userData?.phone || 'Not provided'} />
        {userData?.address && <InfoRow label="ADDRESS" value={userData.address} />}
      </View>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconPlaceholder} />
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
  desc: {
    fontSize: 14,
    color: '#a0a5ba',
    fontWeight: '400',
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