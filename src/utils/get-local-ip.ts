import os from 'node:os';

export function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();

  for (const interfaceName in interfaces) {
    const interfaceDetails = interfaces[interfaceName] || []
    for (const iface of interfaceDetails) {
      // Filtrar apenas IPv4 e interfaces que não são internas (loopback)
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // Retorna o primeiro IP encontrado
      }
    }
  }

  return null; // Caso nenhum IP seja encontrado
}