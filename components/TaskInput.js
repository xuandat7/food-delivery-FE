import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';

const TaskInput = ({ value, onChangeText, onAddTask }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add a new task..."
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.addButton} onPress={onAddTask}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#2196F3',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TaskInput; 