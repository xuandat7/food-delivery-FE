import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import {
  useNavigation,
  useIsFocused,
  CommonActions,
} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const NotificationItem = ({ userName, action, time }) => {
  return (
    <View style={styles.notificationItem}>
      <View style={styles.userAvatar} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          <Text style={styles.userName}>{userName} </Text>
          <Text style={styles.actionText}>{action}</Text>
        </Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.notificationImage} />
    </View>
  );
};

const NotificationScreen = () => {
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState("menu");
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (isFocused) {
      setActiveTab("menu");
    }
  }, [isFocused]);

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    if (tabName === "home") {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "SellerDashboard" }],
        })
      );
    } else if (tabName === "menu") {
      navigation.dispatch(
        CommonActions.navigate({
          name: "MyFoodScreen",
        })
      );
    } else if (tabName === "add") {
      navigation.dispatch(
        CommonActions.navigate({
          name: "AddNewItemsScreen",
        })
      );
    } else if (tabName === "profile") {
      navigation.navigate("ProfileScreen");
    }
    // Already on notifications
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notifications</Text>
      </View>

      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {/* Notification Items */}
        <NotificationItem
          userName="Tanbir Ahmed"
          action="Placed a\nnew order"
          time="20 min ago"
        />
        <View style={styles.divider} />

        <NotificationItem
          userName="Salim Smith"
          action="left a 5 star\nreview"
          time="20 min ago"
        />
        <View style={styles.divider} />

        <NotificationItem
          userName="Royal Bengol"
          action="agreed to\ncancel"
          time="20 min ago"
        />
        <View style={styles.divider} />

        <NotificationItem
          userName="Pabel Vuiya"
          action="Placed a\nnew order"
          time="20 min ago"
        />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress("home")}
        >
          <MaterialCommunityIcons
            name="view-grid-outline"
            size={24}
            color="#32343E"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress("menu")}
        >
          <Feather name="menu" size={24} color="#32343E" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleTabPress("add")}
        >
          <Feather name="plus" size={24} color="#FB6D3A" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="notifications-outline" size={24} color="#FB6D3A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleTabPress("profile")}
        >
          <Feather name="user" size={24} color="#32343E" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 50,
    marginBottom: 24,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#ECF0F4",
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 17,
    color: "#181C2E",
    marginLeft: 16,
    fontWeight: "400",
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 16,
  },
  userAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#98A8B8",
  },
  notificationContent: {
    marginLeft: 14,
    flex: 1,
    justifyContent: "flex-start",
  },
  notificationText: {
    fontSize: 13,
    lineHeight: 20,
  },
  userName: {
    color: "#32343E",
    fontWeight: "500",
  },
  actionText: {
    color: "#9B9BA5",
  },
  timeText: {
    color: "#9B9BA5",
    fontSize: 10,
    marginTop: 6,
  },
  notificationImage: {
    width: 53,
    height: 54,
    borderRadius: 10,
    backgroundColor: "#98A8B8",
    marginLeft: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F4F9",
    width: "100%",
  },
  tabBar: {
    flexDirection: "row",
    height: 89,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  addButton: {
    width: 57,
    height: 57,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF1F1",
    borderWidth: 1,
    borderColor: "#FF7621",
    borderRadius: 28.5,
    marginBottom: 20,
  },
});

export default NotificationScreen;
