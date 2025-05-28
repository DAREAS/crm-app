import React from 'react';
import { View, TextInput, Button } from 'react-native';

export default function LembreteForm({ title, setTitle, description, setDescription, dueDate, setDueDate, notifyBefore, setNotifyBefore, onSave, onCancel, isEdit }) {
  return (
    <View>
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Descrição" value={description} onChangeText={setDescription} />
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Data de vencimento (YYYY-MM-DD HH:mm)" value={dueDate} onChangeText={setDueDate} />
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Notificar quantos minutos antes?" value={notifyBefore} onChangeText={setNotifyBefore} keyboardType="numeric" />
      <Button title={isEdit ? 'Salvar' : 'Adicionar'} onPress={onSave} />
      <Button title="Cancelar" onPress={onCancel} />
    </View>
  );
} 