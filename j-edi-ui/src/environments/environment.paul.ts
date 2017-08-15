// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
let grafanaUrl = 'http://localhost:9082/';
export const environment = {
  production: false,
  websocketUrl: 'ws://localhost:9090/salt-events?token=',
  apiUrl:'http://localhost:9090/api/',
  grafanaUrl:grafanaUrl,
  grafanaEndpoint: grafanaUrl + 'render/dashboard-solo/file/data_streaming_collector_dashboard.json?',
  saltCredentials: {
    username:'juniper',
    password:'Clouds123',
    eauth:'pam'
  }
};