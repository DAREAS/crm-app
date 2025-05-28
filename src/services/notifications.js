import * as Notifications from 'expo-notifications';

export async function pedirPermissaoNotificacoes() {
  await Notifications.requestPermissionsAsync();
}

export async function agendarNotificacao(titulo, corpo, dataVencimento, minutosAntes) {
  const dataNotificacao = new Date(new Date(dataVencimento).getTime() - minutosAntes * 60000);
  await Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: corpo },
    trigger: dataNotificacao,
  });
} 