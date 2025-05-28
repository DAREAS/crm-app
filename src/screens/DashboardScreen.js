import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, ScrollView, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import DraggableClientItem from '../components/DraggableClientItem';

export default function DashboardScreen({ navigation, user, token, setUser }) {
  const [clientes, setClientes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [draggingItem, setDraggingItem] = React.useState(null);
  const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });

  const statusOptions = [
    'Novo',
    'Em Atendimento',
    'Esperando Tarefa',
    'Com Lembretes',
  ];

  const [columnLayouts, setColumnLayouts] = React.useState({});

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(res.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os clientes para o Kanban');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClientes();
  }, []);

  const groupedClients = React.useMemo(() => {
    return statusOptions.reduce((acc, status) => {
      acc[status] = clientes.filter(cliente => cliente.status === status);
      return acc;
    }, {});
  }, [clientes]);

  const draggedItemId = useSharedValue(null);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const currentTranslateX = useSharedValue(0);
  const currentTranslateY = useSharedValue(0);

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: ({ translationX, translationY, state }) => {
          if (state === State.ACTIVE) {
            currentTranslateX.value = offsetX.value + translationX;
            currentTranslateY.value = offsetY.value + translationY;
          } else if (state === State.END) {
            offsetX.value = currentTranslateX.value;
            offsetY.value = currentTranslateY.value;

            const dropX = offsetX.value;

            let targetStatus = null;
            for (const status in columnLayouts) {
              const layout = columnLayouts[status];
              if (dropX >= layout.x && dropX <= layout.x + layout.width) {
                targetStatus = status;
                break;
              }
            }

            if (targetStatus && draggedItemId.value !== null) {
              const draggedItem = clientes.find(c => c.id === draggedItemId.value);
              if (draggedItem && draggedItem.status !== targetStatus) {
                setClientes(prevClients =>
                  prevClients.map(client =>
                    client.id === draggedItem.id ? { ...client, status: targetStatus } : client
                  )
                );
                api.put(`/clients/${draggedItem.id}`, { status: targetStatus }, {
                  headers: { Authorization: `Bearer ${token}` },
                }).catch(err => {
                  Alert.alert('Erro', 'Não foi possível atualizar o status do cliente no backend');
                  setClientes(prevClients =>
                    prevClients.map(client =>
                      client.id === draggedItem.id ? { ...client, status: draggedItem.status } : client
                    )
                  );
                });
              }
            }

            offsetX.value = 0;
            offsetY.value = 0;
            currentTranslateX.value = 0;
            currentTranslateY.value = 0;
            draggedItemId.value = null;
          }
        },
      }
    ],
    { useNativeDriver: true }
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: currentTranslateX.value },
        { translateY: currentTranslateY.value },
      ],
      zIndex: draggedItemId.value !== null ? 100 : 0,
    };
  });

  const renderClientItem = ({ item }) => {
    const isDragging = draggedItemId.value === item.id;

    return (
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.BEGAN) {
            draggedItemId.value = item.id;
          }
        }}
      >
        <DraggableClientItem
          item={item}
          style={isDragging ? animatedStyle : {}}
        />
      </PanGestureHandler>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Kanban</Text>
      <View style={styles.userInfo}>
        <Text>Bem-vindo, {user?.name}</Text>
        <Text>WhatsApp: {user?.whatsapp || 'Não cadastrado'}</Text>
        <Button title="Perfil" onPress={() => navigation.navigate('Perfil', { user, token, setUser })} />
      </View>
      <View style={styles.navButtons}>
        <Button title="Clientes" onPress={() => navigation.navigate('Clientes', { token })} />
        <Button title="Tarefas" onPress={() => navigation.navigate('Tarefas', { token })} />
        <Button title="Lembretes" onPress={() => navigation.navigate('Lembretes', { token })} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView horizontal style={styles.kanbanContainer}>
          {statusOptions.map(status => (
            <View
              key={status}
              style={styles.column}
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                setColumnLayouts(prev => ({ ...prev, [status]: { x, y, width, height } }));
              }}
            >
              <Text style={styles.columnTitle}>{status} ({groupedClients[status].length})</Text>
              <FlatList
                data={groupedClients[status]}
                keyExtractor={item => item.id.toString()}
                renderItem={renderClientItem}
                key={status}
                ListEmptyComponent={<Text>Nenhum cliente neste status.</Text>}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  kanbanContainer: {
    flexDirection: 'row',
  },
  column: {
    width: 200,
    backgroundColor: '#fff',
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    maxHeight: '80%',
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  clientCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  clientName: {
    fontWeight: 'bold',
  },
}); 