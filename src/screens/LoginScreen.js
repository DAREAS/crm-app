import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function LoginScreen({ navigation, setUser, setToken }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data;
      // Salvar o token e navegar para o Dashboard
      // Exemplo simples: navegar e passar o token como parâmetro
      navigation.navigate('Dashboard', { token });
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
      <Button title="Não tem conta? Cadastre-se" onPress={() => navigation.replace('Register')} />
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