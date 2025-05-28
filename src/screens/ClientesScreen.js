import React from 'react';
import { View, Text, Button, TextInput, FlatList, Alert, Modal, Picker } from 'react-native';
import api from '../services/api';

export default function ClientesScreen({ route, navigation }) {
  const { token } = route.params;
  const [clientes, setClientes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editCliente, setEditCliente] = React.useState(null);
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [status, setStatus] = React.useState('Novo');

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clients', {
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
    setStatus(cliente ? cliente.status : 'Novo');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditCliente(null);
    setNome('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
    setStatus('Novo');
  };

  const handleSave = async () => {
    try {
      const clienteData = { name: nome, email, phone, whatsapp, status };
      if (editCliente) {
        await api.put(`/clients/${editCliente.id}`, clienteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/clients', clienteData, {
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
            await api.delete(`/clients/${id}`, {
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

  const statusOptions = [
    'Novo',
    'Em Atendimento',
    'Esperando Tarefa',
    'Com Lembretes',
  ];

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
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text>{item.email}</Text>
                <Text>{item.phone}</Text>
                <Text>{item.whatsapp}</Text>
                <Text>Status: {item.status}</Text>
              </View>
              <Button title="Editar" onPress={() => openModal(item)} />
              <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          )}
        />
      )}
      {/* Modal de adicionar/editar */}
      {modalVisible && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '90%', elevation: 5 }}>
            <Text style={{ fontSize: 24, marginBottom: 24 }}>{editCliente ? 'Editar Cliente' : 'Novo Cliente'}</Text>
            <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Nome" value={nome} onChangeText={setNome} />
            <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="Telefone" value={phone} onChangeText={setPhone} />
            <TextInput style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }} placeholder="WhatsApp (ex: +5511999999999)" value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
            <View style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 }}>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
              >
                {statusOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
            <Button title={editCliente ? 'Salvar' : 'Adicionar'} onPress={handleSave} />
            <Button title="Cancelar" onPress={closeModal} />
            <Button title="Tarefas deste cliente" onPress={() => navigation.navigate('Tarefas', { token, clientes: [{ id: editCliente.id, name: editCliente.name }], clienteFixo: { id: editCliente.id, name: editCliente.name } })} />
          </View>
        </View>
      )}
    </View>
  );
} 