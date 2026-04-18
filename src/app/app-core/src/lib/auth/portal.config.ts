export type PortalKey = 'root' | 'admin' | 'ensino';
export type PortalKeyOuDesconhecido = PortalKey | 'desconhecido';

export interface PortalConfig {
  key: PortalKey;
  port: string;
  roles: string[];
}

export const PORTAIS: Record<PortalKey, PortalConfig> = {
  root: {
    key: 'root',
    port: '4201',
    roles: []
  },
  admin: {
    key: 'admin',
    port: '4200',
    roles: ['ROLE_ADMIN', 'ADMIN', 'admin']
  },
  ensino: {
    key: 'ensino',
    port: '4203',
    roles: ['ROLE_ENSINO', 'ENSINO', 'ensino']
  }
};

export function montarUrlPortal(
  portal: PortalKey,
  protocol = window.location.protocol,
  hostname = window.location.hostname
): string {
  return `${protocol}//${hostname}:${PORTAIS[portal].port}/`;
}
