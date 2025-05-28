import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';

export default function ClienteList({ clientes, onEdit, onDelete }) {
  return (
    <FlatList
      data={clientes}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>{item.phone}</Text>
            <Text>{item.whatsapp}</Text>
          </View>
          <Button title="Editar" onPress={() => onEdit(item)} />
          <Button title="Excluir" color="red" onPress={() => onDelete(item.id)} />
        </View>
      )}
    />
  );
} 