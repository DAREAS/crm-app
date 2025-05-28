import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';

export default function LembreteList({ lembretes, onEdit, onDelete, onReenviar, getClienteNome }) {
  return (
    <FlatList
      data={lembretes}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Vencimento: {item.due_date}</Text>
            <Text>Notificar {item.notify_before} minutos antes</Text>
            <Text>Destinatário: {item.destinatario === 'usuario' ? 'Você' : item.destinatario === 'cliente' ? `Cliente (${getClienteNome(item.cliente_id)})` : `Você e Cliente (${getClienteNome(item.cliente_id)})`}</Text>
            <Text>Status: {item.notified ? 'Enviado' : 'Pendente'}</Text>
          </View>
          <Button title="Editar" onPress={() => onEdit(item)} />
          <Button title="Excluir" color="red" onPress={() => onDelete(item.id)} />
          <Button title="Reenviar" onPress={() => onReenviar(item)} />
        </View>
      )}
    />
  );
} 