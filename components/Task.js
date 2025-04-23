import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Task = ({ task, onToggle, onDelete }) => {
  return (
    <View style={styles.taskItem}>
      <TouchableOpacity 
        style={[styles.checkbox, task.completed ? styles.checkboxChecked : {}]} 
        onPress={() => onToggle(task.id)}
      />
      <Text 
        style={[styles.taskTitle, task.completed ? styles.taskCompleted : {}]}
        numberOfLines={1}
      >
        {task.title}
      </Text>
      <TouchableOpacity onPress={() => onDelete(task.id)}>
        <Text style={styles.deleteButton}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 12,
    marginRight: 15,
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});

export default Task; 