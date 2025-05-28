import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function PerfilScreen({ user, token, setUser, navigation }) {
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [whatsapp, setWhatsapp] = React.useState(user?.whatsapp || '');
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/auth/update', { name, email, whatsapp }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assumindo que o backend retorna o usuário atualizado
      setUser(res.data.user); // Atualiza o estado do usuário no App.js ou contexto
      Alert.alert('Sucesso', res.data.message || 'Perfil atualizado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="WhatsApp (ex: +5511999999999)" value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
      <Button title={loading ? 'Salvando...' : 'Salvar'} onPress={handleSave} disabled={loading} />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
}); 