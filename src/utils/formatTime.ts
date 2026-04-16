export function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
