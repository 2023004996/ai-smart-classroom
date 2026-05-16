export const buildHeaders = () => {
  const token = localStorage.getItem('ai-classroom-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const parseError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return error.message || 'Request failed.';
};
