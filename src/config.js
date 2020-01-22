if (!window._env_) {
  window._env_ = {};
}
const config = {
  REACT_APP_PARSE_URL: process.env.REACT_APP_PARSE_URL || window._env_.REACT_APP_PARSE_URL
};
export default config;
