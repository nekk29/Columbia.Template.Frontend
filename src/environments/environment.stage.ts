export const environment = {
  production: true,
  application: {
    code: 'security',
    version: 'v$(ApiOptions.Version)',
    environment: '$(ApiOptions.Environment)',
    companyName: 'Company',
    companyDescription: 'Security Portal',
    companyUrl: 'https://security.company.com',
    isMockEnabled: true,
  },
  frontend: {
    developerMode: false,
    baseUrl: '$(SecurityOptions.FrontUrl)'
  },
  backend: {
    apiUrl: '$(Backend.ApiUrl)'
  },
  security: {
    issuer: '$(SecurityOptions.Issuer)',
    clientId: 'security',
    scope: 'profile email roles offline_access security.apis',
  },
};
