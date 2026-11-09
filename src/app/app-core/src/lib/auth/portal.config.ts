export type PortalKey = 'root' | 'admin' | 'ensino';
export type PortalKeyOuDesconhecido = PortalKey | 'desconhecido';

export interface PortalConfig {
  key: PortalKey;
  port: string;
  path: string;
  roles: string[];
}

export const PORTAIS: Record<PortalKey, PortalConfig> = {
  root: {
    key: 'root',
    port: '4201',
    path: '/',
    roles: []
  },
  admin: {
    key: 'admin',
    port: '4200',
    path: '/admin/',
    roles: ['ROLE_ADMIN', 'ADMIN', 'admin']
  },
  ensino: {
    key: 'ensino',
    port: '4203',
    path: '/dept-ensino/',
    roles: ['ROLE_ENSINO', 'ENSINO', 'ensino']
  }
};

export function montarUrlPortal(
  portal: PortalKey,
  protocol = window.location.protocol,
  hostname = window.location.hostname
): string {
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:${PORTAIS[portal].port}/`;
  }

  return `${protocol}//${hostname}${PORTAIS[portal].path}`;
}
