import client from './client';

export const login = async (email: string, password: string) => {
  const res = await client.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (username: string, email: string, password: string) => {
  const res = await client.post('/auth/register', { username, email, password });
  return res.data;
};

export const getProfile = async () => {
  const res = await client.get('/auth/profile');
  return res.data;
};

export const updateProfile = async (data: { username?: string; email?: string }) => {
  const res = await client.put('/auth/profile', data);
  return res.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const res = await client.put('/auth/change-password', { currentPassword, newPassword });
  return res.data;
};
