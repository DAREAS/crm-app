import React from 'react';
import { View, TextInput, Button } from 'react-native';

export default function TarefaForm({ title, setTitle, description, setDescription, status, setStatus, dueDate, setDueDate, onSave, onCancel, isEdit }) {
  return (
    <View>
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Título" value={title} onChangeText={setTitle} />
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Descrição" value={description} onChangeText={setDescription} />
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Status" value={status} onChangeText={setStatus} />
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Data (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} />
      <Button title={isEdit ? 'Salvar' : 'Adicionar'} onPress={onSave} />
      <Button title="Cancelar" onPress={onCancel} />
    </View>
  );
} 