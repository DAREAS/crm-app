# CRM App (Mobile)

Aplicativo CRM multiplataforma (React Native) para gestão de clientes, tarefas e lembretes, com integração a notificações locais e WhatsApp.

## Funcionalidades
- Cadastro e login de usuários
- Perfis: Free, Premium, Premium IA
- Cadastro e gestão de clientes
- Cadastro e gestão de tarefas vinculadas a clientes
- Cadastro e gestão de lembretes com notificações locais e WhatsApp
- Perfil do usuário editável

## Como rodar
1. Instale as dependências:
   ```sh
   npm install
   ```
2. Inicie o app:
   ```sh
   npx expo start
   ```
   ou
   ```sh
   npx react-native run-android
   ```

## Configuração
- Altere o `API_URL` em `App.js` para o endereço do backend.
- Para notificações WhatsApp, cadastre o número na sandbox do Twilio.

## Documentação
- [Leia em inglês](README.en.md) 