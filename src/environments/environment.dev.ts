export const environment = {
  production: false,
  application: {
    code: 'security',
    version: 'v0.0.1',
    environment: 'Local',
    companyName: 'Company',
    companyDescription: 'Security Portal',
    companyUrl: 'https://security.company.com',
    isMockEnabled: true,
  },
  frontend: {
    developerMode: false,
    baseUrl: 'https://localhost:5173'
  },
  backend: {
    apiUrl: 'https://app-company-security-apis-dev.azurewebsites.net/api'
  },
  security: {
    issuer: 'https://app-company-security-apis-dev.azurewebsites.net',
    clientId: 'security',
    scope: 'profile email roles offline_access security.apis',
  },
};
