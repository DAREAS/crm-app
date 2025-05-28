// Função para formatar data e hora (exemplo básico)
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  // Assume o formato YYYY-MM-DD HH:mm
  const [datePart, timePart] = dateTimeString.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart ? timePart.split(':') : ['00', '00'];
  return `${day}/${month}/${year}${timePart ? ` às ${hour}:${minute}` : ''}`;
}; 