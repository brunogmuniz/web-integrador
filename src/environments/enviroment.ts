export const environment = {
  production: false,
  apiUrl: "http://localhost:8080",

  issuer: 'http://localhost:8081/realms/ufsm',
  clientId: 'webClient',
  redirectUri: 'http://localhost:4200/',
  responseType: 'code',
  scope: 'openid profile email offline_access',

}
