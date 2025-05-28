import React from 'react';
import { View, Text, Button, TextInput, FlatList, Alert, Modal, Picker } from 'react-native';
import api from '../services/api';
import { formatDateTime } from '../utils/dateTimeUtils';

export default function TarefasScreen({ route, navigation }) {
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

  const fetchTarefas = async () => {
    setLoading(true);
    try {
      const url = clienteFixo ? `/tasks/client/${clienteFixo.id}` : '/tasks';
      const res = await api.get(url, {
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
    fetchTarefas();
  }, [clienteFixo]);

  const openModal = (task = null) => {
    setEditTask(task);
    setDescription(task ? task.description : '');
    setDueDate(task ? task.due_date : '');
    setClientId(task ? task.client_id : (clienteFixo ? clienteFixo.id : ''));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditTask(null);
    setDescription('');
    setDueDate('');
    setClientId(clienteFixo ? clienteFixo.id : '');
  };

  const handleSave = async () => {
    try {
      const taskData = { description: description, due_date: dueDate, client_id: clientId };
      if (editTask) {
        await api.put(`/tasks/${editTask.id}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/tasks', taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchTarefas();
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
            await api.delete(`/tasks/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchTarefas();
          } catch (err) {
            Alert.alert('Erro', 'Erro ao excluir tarefa');
          }
        }
      }
    ]);
  };

  const getClienteNome = (clientId) => {
    const cliente = clientes.find(c => c.id === clientId);
    return cliente ? cliente.name : 'Cliente Desconhecido';
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
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>Status: {item.status}</Text>
                <Text>Data: {formatDateTime(item.due_date)}</Text>
                <Text>Cliente: {getClienteNome(item.client_id)}</Text>
              </View>
              <Button title="Editar" onPress={() => openModal(item)} />
              <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          )}
        />
      )}
      {/* Modal de adicionar/editar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 16 }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '90%', elevation: 5 }}>
            <Text style={{ fontSize: 24, marginBottom: 24 }}>{editTask ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
            <TextInput
              style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }}
              placeholder="Descrição"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }}
              placeholder="Data de Vencimento (YYYY-MM-DD)"
              value={dueDate}
              onChangeText={setDueDate}
            />
            {!clienteFixo && clientes && clientes.length > 0 && (
              <View style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 }}>
                <Picker
                  selectedValue={clientId}
                  onValueChange={(itemValue) => setClientId(itemValue)}
                >
                  <Picker.Item label="Selecione um Cliente" value="" />
                  {clientes.map(cliente => (
                    <Picker.Item key={cliente.id} label={cliente.name} value={cliente.id} />
                  ))}
                </Picker>
              </View>
            )}
            <Button title={editTask ? 'Salvar' : 'Adicionar'} onPress={handleSave} />
            <Button title="Cancelar" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
} 