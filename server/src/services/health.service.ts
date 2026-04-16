export function getHealthStatus() {
  return {
    status: 'ok',
    service: 'transitflow-server',
    timestamp: new Date().toISOString(),
  }
}
