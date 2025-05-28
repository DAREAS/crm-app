import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';

export default function TarefaList({ tarefas, onEdit, onDelete, getClienteNome }) {
  return (
    <FlatList
      data={tarefas}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Data: {item.due_date}</Text>
            <Text>Cliente: {getClienteNome ? getClienteNome(item.client_id) : item.client_id}</Text>
          </View>
          <Button title="Editar" onPress={() => onEdit(item)} />
          <Button title="Excluir" color="red" onPress={() => onDelete(item.id)} />
        </View>
      )}
    />
  );
} 