const apiBaseUrl = "https://api.petertecnet.com.br/api";
const storageUrl = "https://api.petertecnet.com.br/storage/";

// Legacy numeric ID remains exported while consumers move to the v1 context.
const appId = 4;
const appSlug = "inkap";
const apiV1BaseUrl = `${apiBaseUrl}/v1/apps/${appSlug}`;
const linkApp = "https://inkap.petertecnet.com.br";
const logoApp = "https://inkap.petertecnet.com.br/images/logo.png";

export { apiBaseUrl, apiV1BaseUrl, storageUrl, appId, appSlug, linkApp, logoApp };
