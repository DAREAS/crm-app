import React from 'react';
import { View, Text, Button, TextInput, FlatList, Alert, Modal } from 'react-native';
import api from '../services/api'; // Importa o serviço de API
import { schedulePushNotification } from '../services/notifications'; // Importa o serviço de notificações
import { formatDateTime } from '../utils/dateTimeUtils'; // Importa a função formatDateTime

export default function LembretesScreen({ route, navigation }) {
  const { token } = route.params;

  const [lembretes, setLembretes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editLembrete, setEditLembrete] = React.useState(null);
  const [descricao, setDescricao] = React.useState('');
  const [dataHora, setDataHora] = React.useState(''); // Formato esperado: YYYY-MM-DD HH:mm
  const [antecedencia, setAntecedencia] = React.useState('0'); // Em minutos

  const fetchLembretes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reminders', { // Usa o serviço de API
        headers: { Authorization: `Bearer ${token}` },
      });
      setLembretes(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os lembretes');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLembretes();
  }, []);

  const openModal = (lembrete = null) => {
    setEditLembrete(lembrete);
    setDescricao(lembrete ? lembrete.description : '');
    setDataHora(lembrete ? lembrete.dateTime : ''); // Use 'dateTime' conforme backend
    setAntecedencia(lembrete ? String(lembrete.notifyBefore) : '0'); // Use 'notifyBefore'
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditLembrete(null);
    setDescricao('');
    setDataHora('');
    setAntecedencia('0');
  };

  const handleSave = async () => {
    try {
      const lembreteData = {
        description: descricao,
        dateTime: dataHora,
        notifyBefore: parseInt(antecedencia, 10),
      };

      if (editLembrete) {
        await api.put(`/reminders/${editLembrete.id}`, lembreteData, { // Usa o serviço de API
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const res = await api.post('/reminders', lembreteData, { // Usa o serviço de API
          headers: { Authorization: `Bearer ${token}` },
        });
        // Agendar notificação local se antecedencia for maior que 0
        if (parseInt(antecedencia, 10) > 0) {
          // Converter dataHora para um objeto Date válido para agendamento
          const [datePart, timePart] = dataHora.split(' ');
          const [year, month, day] = datePart.split('-').map(Number);
          const [hour, minute] = timePart.split(':').map(Number);

          // Note: Month is 0-indexed in Date object
          const triggerDate = new Date(year, month - 1, day, hour, minute);

          // Calcular a data/hora do gatilho subtraindo a antecedência
          const triggerTimestamp = triggerDate.getTime() - (parseInt(antecedencia, 10) * 60 * 1000);
          const notificationTriggerDate = new Date(triggerTimestamp);

          // Agendar notificação
          await schedulePushNotification(
            `Lembrete: ${descricao}`, // Título da notificação
            `Está chegando a hora do seu lembrete: ${descricao}. Agendado para ${dataHora}.` // Corpo da notificação
          );
        }
      }
      fetchLembretes();
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
            await api.delete(`/reminders/${id}`, { // Usa o serviço de API
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchLembretes();
          } catch (err) {
            Alert.alert('Erro', 'Erro ao excluir lembrete');
          }
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Adicionar Lembrete" onPress={() => openModal()} />
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={lembretes}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.description}</Text>
              <Text>Data/Hora: {formatDateTime(item.dateTime)}</Text>
              <Text>Notificar {item.notifyBefore} minutos antes</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Button title="Editar" onPress={() => openModal(item)} />
                <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
              </View>
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
            <Text style={{ fontSize: 24, marginBottom: 24 }}>{editLembrete ? 'Editar Lembrete' : 'Novo Lembrete'}</Text>

            <TextInput
              style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />

            <TextInput
              style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }}
              placeholder="Data e Hora (YYYY-MM-DD HH:mm)"
              value={dataHora}
              onChangeText={setDataHora}
            />

            <TextInput
              style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 }}
              placeholder="Antecedência (minutos)"
              value={antecedencia}
              onChangeText={setAntecedencia}
              keyboardType="numeric"
            />

            <Button title={editLembrete ? 'Salvar' : 'Adicionar'} onPress={handleSave} />
            <Button title="Cancelar" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
} 