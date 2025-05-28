import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, password, whatsapp });
      Alert.alert('Sucesso', res.data.message);
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="WhatsApp (ex: +5511999999999)"
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
      />
      <Button title={loading ? 'Cadastrando...' : 'Cadastrar'} onPress={handleRegister} disabled={loading} />
      <Button title="Já tem conta? Entrar" onPress={() => navigation.replace('Login')} />
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