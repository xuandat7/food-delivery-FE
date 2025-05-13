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
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
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
});

export default NotificationScreen;
