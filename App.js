import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, TextInput, StyleSheet, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';

const API_URL = 'http://localhost:3001'; // Altere para o IP da sua máquina se testar no celular

function LoginScreen({ navigation, setUser, setToken }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      navigation.replace('Dashboard');
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

function RegisterScreen({ navigation }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password, whatsapp });
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
      navigation.replace('Login');
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

function DashboardScreen({ navigation, user, token, setUser }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [whatsapp, setWhatsapp] = React.useState(user?.whatsapp || '');
  const [loading, setLoading] = React.useState(false);

  const handleUpdateWhatsapp = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/auth/whatsapp`, { whatsapp }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, whatsapp });
      setModalVisible(false);
      Alert.alert('Sucesso', 'WhatsApp atualizado!');
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao atualizar WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Dashboard</Text>
      <Text>Bem-vindo, {user?.name}</Text>
      <Text>WhatsApp: {user?.whatsapp || 'Não cadastrado'}</Text>
      <Button title="Editar WhatsApp" onPress={() => setModalVisible(true)} />
      <Button title="Clientes" onPress={() => navigation.navigate('Clientes')} />
      <Button title="Tarefas" onPress={() => navigation.navigate('Tarefas')} />
      <Button title="Lembretes" onPress={() => navigation.navigate('Lembretes')} />
      <Button title="Perfil" onPress={() => navigation.navigate('Perfil', { user, token, setUser })} />
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Editar WhatsApp</Text>
            <TextInput
              style={styles.input}
              placeholder="WhatsApp (ex: +5511999999999)"
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType="phone-pad"
            />
            <Button title={loading ? 'Salvando...' : 'Salvar'} onPress={handleUpdateWhatsapp} disabled={loading} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      )}
    </View>
  );
}

function ClientesScreen({ route, navigation }) {
  const { token } = route.params;
  const [clientes, setClientes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editCliente, setEditCliente] = React.useState(null);
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os clientes');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClientes();
  }, []);

  const openModal = (cliente = null) => {
    setEditCliente(cliente);
    setNome(cliente ? cliente.name : '');
    setEmail(cliente ? cliente.email : '');
    setPhone(cliente ? cliente.phone : '');
    setWhatsapp(cliente ? cliente.whatsapp : '');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditCliente(null);
    setNome('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
  };

  const handleSave = async () => {
    try {
      if (editCliente) {
        await axios.put(`${API_URL}/clients/${editCliente.id}`, { name: nome, email, phone, whatsapp }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/clients`, { name: nome, email, phone, whatsapp }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchClientes();
      closeModal();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao salvar cliente');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Excluir', 'Deseja realmente excluir este cliente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/clients/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchClientes();
          } catch (err) {
            Alert.alert('Erro', 'Erro ao excluir cliente');
          }
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Adicionar Cliente" onPress={() => openModal()} />
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.clienteItem}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text>{item.email}</Text>
                <Text>{item.phone}</Text>
              </View>
              <Button title="Editar" onPress={() => openModal(item)} />
              <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          )}
        />
      )}
      {/* Modal de adicionar/editar */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{editCliente ? 'Editar Cliente' : 'Novo Cliente'}</Text>
            <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Telefone" value={phone} onChangeText={setPhone} />
            <TextInput style={styles.input} placeholder="WhatsApp (ex: +5511999999999)" value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
            <Button title={editCliente ? 'Salvar' : 'Adicionar'} onPress={handleSave} />
            <Button title="Cancelar" onPress={closeModal} />
            <Button title="Tarefas deste cliente" onPress={() => navigation.navigate('Tarefas', { token, clientes: [{ id: editCliente.id, name: editCliente.name }], clienteFixo: { id: editCliente.id, name: editCliente.name } })} />
          </View>
        </View>
      )}
    </View>
  );
}

function TarefasScreen({ route, navigation }) {
  const { token, clientes: clientesProp, clienteFixo } = route.params || {};
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editTask, setEditTask] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState('pendente');
  const [dueDate, setDueDate] = React.useState('');
  const [clientId, setClientId] = React.useState('');
  const [clientes, setClientes] = React.useState(clientesProp || []);

  const fetchClientes = async () => {
    if (!clientesProp) {
      try {
        const res = await axios.get(`${API_URL}/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(res.data);
      } catch {}
    }
  };

  const fetchTasks = async (client_id = null) => {
    setLoading(true);
    try {
      let url = `${API_URL}/tasks`;
      if (client_id) url += `?client_id=${client_id}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar as tarefas');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClientes();
    if (clienteFixo) {
      setClientId(String(clienteFixo.id));
      fetchTasks(clienteFixo.id);
    } else {
      fetchTasks();
    }
  }, []);

  const openModal = (task = null) => {
    setEditTask(task);
    setTitle(task ? task.title : '');
    setDescription(task ? task.description : '');
    setStatus(task ? task.status : 'pendente');
    setDueDate(task ? task.due_date : '');
    setClientId(task ? String(task.client_id) : (clienteFixo ? String(clienteFixo.id) : (clientes[0] ? String(clientes[0].id) : '')));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditTask(null);
    setTitle('');
    setDescription('');
    setStatus('pendente');
    setDueDate('');
    setClientId('');
  };

  const handleSave = async () => {
    if (!clientId || !title) {
      Alert.alert('Erro', 'Cliente e título são obrigatórios');
      return;
    }
    try {
      if (editTask) {
        await axios.put(`${API_URL}/tasks/${editTask.id}`, { title, description, status, due_date: dueDate }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/tasks`, { client_id: clientId, title, description, status, due_date: dueDate }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchTasks(clientId);
      closeModal();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao salvar tarefa');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Excluir', 'Deseja realmente excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/tasks/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchTasks(clientId);
          } catch (err) {
            Alert.alert('Erro', 'Erro ao excluir tarefa');
          }
        }
      }
    ]);
  };

  const getClienteNome = (id) => {
    const c = clientes.find(c => String(c.id) === String(id));
    return c ? c.name : id;
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Adicionar Tarefa" onPress={() => openModal()} />
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.clienteItem}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>Status: {item.status}</Text>
                <Text>Data: {item.due_date}</Text>
                <Text>Cliente: {getClienteNome(item.client_id)}</Text>
              </View>
              <Button title="Editar" onPress={() => openModal(item)} />
              <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          )}
        />
      )}
      {/* Modal de adicionar/editar */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{editTask ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
            {(!clienteFixo) && (
              <Picker
                selectedValue={clientId}
                onValueChange={setClientId}
                style={{ width: '100%', marginBottom: 12 }}>
                {clientes.map(c => (
                  <Picker.Item key={c.id} label={c.name} value={String(c.id)} />
                ))}
              </Picker>
            )}
            <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Status" value={status} onChangeText={setStatus} />
            <TextInput style={styles.input} placeholder="Data (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} />
            <Button title={editTask ? 'Salvar' : 'Adicionar'} onPress={handleSave} />
            <Button title="Cancelar" onPress={closeModal} />
          </View>
        </View>
      )}
    </View>
  );
}

function LembretesScreen({ route }) {
  const { token } = route.params;
  const [reminders, setReminders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editReminder, setEditReminder] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [notifyBefore, setNotifyBefore] = React.useState('60');
  const [destinatario, setDestinatario] = React.useState('usuario');
  const [clientes, setClientes] = React.useState([]);
  const [clienteId, setClienteId] = React.useState('');

  React.useEffect(() => {
    fetchReminders();
    fetchClientes();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/reminders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os lembretes');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const res = await axios.get(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(res.data);
    } catch {}
  };

  const getClienteNome = (id) => {
    const c = clientes.find(c => String(c.id) === String(id));
    return c ? c.name : id;
  };

  const openModal = (reminder = null) => {
    setEditReminder(reminder);
    setTitle(reminder ? reminder.title : '');
    setDescription(reminder ? reminder.description : '');
    setDueDate(reminder ? reminder.due_date : '');
    setNotifyBefore(reminder ? String(reminder.notify_before) : '60');
    setDestinatario(reminder ? reminder.destinatario || 'usuario' : 'usuario');
    setClienteId(reminder ? String(reminder.cliente_id || '') : '');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditReminder(null);
    setTitle('');
    setDescription('');
    setDueDate('');
    setNotifyBefore('60');
    setDestinatario('usuario');
    setClienteId('');
  };

  const handleSave = async () => {
    if (!title || !dueDate) {
      Alert.alert('Erro', 'Título e data de vencimento são obrigatórios');
      return;
    }
    try {
      await axios.post(`${API_URL}/reminders`, {
        title,
        description,
        due_date: dueDate,
        notify_before: Number(notifyBefore),
        destinatario,
        cliente_id: destinatario !== 'usuario' ? clienteId : null
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReminders();
      closeModal();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao salvar lembrete');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Excluir', 'Deseja realmente excluir este lembrete?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/reminders/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchReminders();
          } catch (err) {
            Alert.alert('Erro', 'Erro ao excluir lembrete');
          }
        }
      }
    ]);
  };

  const handleReenviar = async (reminder) => {
    try {
      await axios.post(`${API_URL}/reminders/reenviar`, { id: reminder.id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Sucesso', 'Lembrete reenviado!');
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao reenviar lembrete');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Adicionar Lembrete" onPress={() => openModal()} />
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.clienteItem}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>Vencimento: {item.due_date}</Text>
                <Text>Notificar {item.notify_before} minutos antes</Text>
                <Text>Destinatário: {item.destinatario === 'usuario' ? 'Você' : item.destinatario === 'cliente' ? `Cliente (${getClienteNome(item.cliente_id)})` : `Você e Cliente (${getClienteNome(item.cliente_id)})`}</Text>
                <Text>Status: {item.notified ? 'Enviado' : 'Pendente'}</Text>
              </View>
              <Button title="Editar" onPress={() => openModal(item)} />
              <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
              <Button title="Reenviar" onPress={() => handleReenviar(item)} />
            </View>
          )}
        />
      )}
      {/* Modal de adicionar/editar */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{editReminder ? 'Editar Lembrete' : 'Novo Lembrete'}</Text>
            <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Data de vencimento (YYYY-MM-DD HH:mm)" value={dueDate} onChangeText={setDueDate} />
            <TextInput style={styles.input} placeholder="Notificar quantos minutos antes?" value={notifyBefore} onChangeText={setNotifyBefore} keyboardType="numeric" />
            <Picker selectedValue={destinatario} onValueChange={setDestinatario} style={{ width: '100%', marginBottom: 12 }}>
              <Picker.Item label="Usuário (você)" value="usuario" />
              <Picker.Item label="Cliente" value="cliente" />
              <Picker.Item label="Ambos" value="ambos" />
            </Picker>
            {destinatario !== 'usuario' && (
              <Picker selectedValue={clienteId} onValueChange={setClienteId} style={{ width: '100%', marginBottom: 12 }}>
                {clientes.map(c => (
                  <Picker.Item key={c.id} label={c.name} value={String(c.id)} />
                ))}
              </Picker>
            )}
            <Button title={editReminder ? 'Salvar' : 'Adicionar'} onPress={handleSave} />
            <Button title="Cancelar" onPress={closeModal} />
          </View>
        </View>
      )}
    </View>
  );
}

function PerfilScreen({ user, token, setUser, navigation }) {
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [whatsapp, setWhatsapp] = React.useState(user?.whatsapp || '');
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/auth/whatsapp`, { whatsapp }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.put(`${API_URL}/users/profile`, { name, email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, name, email, whatsapp });
      Alert.alert('Sucesso', 'Dados atualizados!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao atualizar dados');
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

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Dashboard' : 'Login'}>
        {!user && (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {props => <LoginScreen {...props} setUser={setUser} setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
        {user && <Stack.Screen name="Dashboard">
          {props => <DashboardScreen {...props} user={user} token={token} setUser={setUser} />}
        </Stack.Screen>}
        {user && <Stack.Screen name="Clientes">
          {props => <ClientesScreen {...props} token={token} />}
        </Stack.Screen>}
        {user && <Stack.Screen name="Tarefas">
          {props => <TarefasScreen {...props} token={token} />}
        </Stack.Screen>}
        {user && <Stack.Screen name="Lembretes">
          {props => <LembretesScreen {...props} token={token} />}
        </Stack.Screen>}
        {user && <Stack.Screen name="Perfil">
          {props => <PerfilScreen {...props} user={user} token={token} setUser={setUser} />}
        </Stack.Screen>}
      </Stack.Navigator>
    </NavigationContainer>
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
  clienteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    elevation: 5,
  },
}); 