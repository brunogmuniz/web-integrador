export const environment = {
  production: true,
  // A URL real de onde sua API está respondendo neste ambiente
  apiUrl: "https://pdsa-5033-a.bolicheiro.ufsm.br/api",

  // A URL pública e real do seu servidor Keycloak
  issuer: 'https://oauth.bolicheiro.ufsm.br/realms/ufsm', // Substitua pelo domínio real do seu Keycloak

  clientId: 'webClient',
  responseType: 'code',
  scope: 'openid profile email offline_access',
};
