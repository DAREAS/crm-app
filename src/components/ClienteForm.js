import React from 'react';
import { View, TextInput, Button } from 'react-native';

export default function ClienteForm({ nome, setNome, email, setEmail, phone, setPhone, whatsapp, setWhatsapp, onSave, onCancel, isEdit }) {
  return (
    <View>
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Telefone" value={phone} onChangeText={setPhone} />
      <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="WhatsApp (ex: +5511999999999)" value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
      <Button title={isEdit ? 'Salvar' : 'Adicionar'} onPress={onSave} />
      <Button title="Cancelar" onPress={onCancel} />
    </View>
  );
} 