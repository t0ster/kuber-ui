if (!window._env_) {
  window._env_ = {};
}
const config = {
  REACT_APP_PARSE_URL:
    process.env.REACT_APP_PARSE_URL || window._env_.REACT_APP_PARSE_URL,
  REACT_APP_URL: process.env.REACT_APP_URL || window._env_.REACT_APP_URL,
  REACT_APP_PARSE_APP_ID:
    process.env.REACT_APP_PARSE_APP_ID || window._env_.REACT_APP_PARSE_APP_ID,
  REACT_APP_PARSE_MASTER_KEY:
    process.env.REACT_APP_PARSE_MASTER_KEY ||
    window._env_.REACT_APP_PARSE_MASTER_KEY,
};
export default config;
