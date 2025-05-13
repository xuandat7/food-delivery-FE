import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { dishAPI } from '../../services';

const CategoryDetailScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(0);
      } else if (!refresh && !hasMoreData) {
        return;
      } else {
        setLoading(true);
      }

      const currentPage = refresh ? 0 : page;
      console.log(`Fetching dishes for category: ${category.name} (ID: ${category.id}), page: ${currentPage}`);
      
      const response = await dishAPI.getPublicDishByCategory(category.id, currentPage, 10);
      
      if (response.success) {
        console.log(`Got ${response.data.content?.length || 0} dishes`);
        
        if (refresh || page === 0) {
          setDishes(response.data.content || []);
        } else {
          setDishes(prevDishes => [...prevDishes, ...(response.data.content || [])]);
        }
        
        // Kiểm tra xem còn dữ liệu không
        setHasMoreData(currentPage < response.data.totalPages - 1);
        
        // Nếu không phải refresh, tăng số trang
        if (!refresh) {
          setPage(currentPage + 1);
        }
      } else {
        console.error("Không thể lấy món ăn:", response.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy món ăn:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDishes(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMoreData) {
      fetchDishes();
    }
  };

  const handleDishPress = (dish) => {
    navigation.navigate("DishDetail", { dish });
  };

  const renderDishItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.dishItem}
      onPress={() => handleDishPress(item)}
    >
      <Image 
        source={item.thumbnail ? { uri: item.thumbnail } : require('../../../assets/icon.png')}
        style={styles.dishImage}
      />
      <View style={styles.dishInfo}>
        <Text style={styles.dishName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.dishDescription} numberOfLines={2}>{item.description || 'Không có mô tả'}</Text>
        <Text style={styles.dishPrice}>{item.price?.toLocaleString('vi-VN')} ₫</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#FB6D3A" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{category.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && page === 0 ? (
        <ActivityIndicator size="large" color="#FB6D3A" style={styles.loader} />
      ) : dishes.length > 0 ? (
        <FlatList
          data={dishes}
          renderItem={renderDishItem}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="restaurant-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Không có món ăn nào trong danh mục này</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#31343d',
  },
  loader: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  dishItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  dishInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#31343d',
  },
  dishDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  dishPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FB6D3A',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FB6D3A',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default CategoryDetailScreen; 