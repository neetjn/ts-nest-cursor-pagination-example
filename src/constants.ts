const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 3000;
const API_ROOT = `http://${API_HOST}:${API_PORT}`;
const DEFAULT_PAGE_SIZE = 100;

export {
  API_HOST,
  API_PORT,
  API_ROOT,
  DEFAULT_PAGE_SIZE,
}
