if (!window._env_) {
  window._env_ = {};
}
const config = {
  REACT_APP_PARSE_URL: process.env.REACT_APP_PARSE_URL || window._env_.REACT_APP_PARSE_URL,
  REACT_APP_HOST: process.env.REACT_APP_HOST || window._env_.REACT_APP_HOST
};
export default config;
