import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

const DraggableClientItem = ({ item, style }) => {
  return (
    <Animated.View style={[styles.clientCard, style]}>
      <Text style={styles.clientName}>{item.name}</Text>
      <Text>{item.email}</Text>
      <Text>{item.phone}</Text>
      <Text>{item.whatsapp}</Text>
      {/* Adicionar botões de ação aqui, se necessário */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  clientCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  clientName: {
    fontWeight: 'bold',
  },
});

export default DraggableClientItem; 