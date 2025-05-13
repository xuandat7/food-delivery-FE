import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const WithdrawSuccessScreen = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Success Icon with Decoration */}
          <View style={styles.iconContainer}>
            {/* Decorative elements like stars */}
            <View style={[styles.star, styles.starTopRight]}>
              <Ionicons name="star" size={16} color="#3498db" />
            </View>
            <View style={[styles.star, styles.starTopLeft]}>
              <Ionicons name="star-outline" size={16} color="#3498dbAA" />
            </View>
            <View style={[styles.star, styles.starBottomLeft]}>
              <Ionicons name="ellipse" size={8} color="#3498db88" />
            </View>
            <View style={[styles.star, styles.starBottomRight]}>
              <Ionicons name="star" size={16} color="#3498db" />
            </View>
            <View style={[styles.star, styles.starBottom]}>
              <Ionicons name="ellipse" size={8} color="#3498db88" />
            </View>
            <View style={[styles.star, styles.starMiddleLeft]}>
              <Ionicons name="sparkles" size={24} color="#3498db88" />
            </View>

            {/* Success checkmark */}
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={45} color="white" />
            </View>
          </View>
          
          {/* Success Text */}
          <Text style={styles.successText}>Withdraw Successful</Text>
          
          {/* OK Button */}
          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    width: '85%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 180,
    height: 180,
    position: 'relative',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    position: 'absolute',
  },
  starTopRight: {
    top: 20,
    right: 20,
  },
  starTopLeft: {
    top: 0,
    left: 50,
  },
  starBottomRight: {
    bottom: 40,
    right: 10,
  },
  starBottomLeft: {
    bottom: 50,
    left: 0,
  },
  starBottom: {
    bottom: 20,
    left: 80,
  },
  starMiddleLeft: {
    top: '50%',
    left: '10%',
  },
  successText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 30,
  },
  okButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  okText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
  }
});

export default WithdrawSuccessScreen;