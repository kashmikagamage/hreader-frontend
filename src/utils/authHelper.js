import API from '../components/api';

/**
 * Log out user by clearing httpOnly cookie and session storage
 */
export const logoutUser = async () => {
  try {
    // Call logout endpoint to clear httpOnly cookie on server
    await API.get('/api/logoutUser');
  } catch (err) {
    console.error('Logout error:', err);
  }
  
  // Clear any remaining session data
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('token');
};

/**
 * Log out trainer by clearing httpOnly cookie and session storage
 */
export const logoutTrainer = async () => {
  try {
    // Call logout endpoint to clear httpOnly cookie on server
    await API.get('/api/logoutTrainer');
  } catch (err) {
    console.error('Logout error:', err);
  }
  
  // Clear any remaining session data
  sessionStorage.removeItem('id');
  sessionStorage.removeItem('token');
  localStorage.removeItem('id');
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated (cookie exists)
 * Note: We check if we can access API, as the cookie is httpOnly
 */
export const isAuthenticated = async () => {
  try {
    const response = await API.get('/api/getUsers');
    return response.status === 200;
  } catch (err) {
    return false;
  }
};

/**
 * Get all active sessions for the current user
 */
export const getUserActiveSessions = async () => {
  try {
    const response = await API.get('/api/sessions/user');
    return response.data.sessions || [];
  } catch (err) {
    console.error('Error fetching user sessions:', err);
    return [];
  }
};

/**
 * Get all active sessions for the current trainer
 */
export const getTrainerActiveSessions = async () => {
  try {
    const response = await API.get('/api/sessions/trainer');
    return response.data.sessions || [];
  } catch (err) {
    console.error('Error fetching trainer sessions:', err);
    return [];
  }
};

/**
 * Log out from all devices
 */
export const logoutAllDevicesUser = async () => {
  try {
    const response = await API.get('/api/logoutAllSessions/user');
    // Clear any remaining session data
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    return response.data;
  } catch (err) {
    console.error('Error logging out from all devices:', err);
    throw err;
  }
};

/**
 * Log out trainer from all devices
 */
export const logoutAllDevicesTrainer = async () => {
  try {
    const response = await API.get('/api/logoutAllSessions/trainer');
    // Clear any remaining session data
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    return response.data;
  } catch (err) {
    console.error('Error logging out from all devices:', err);
    throw err;
  }
};

/**
 * Close a specific session
 */
export const closeSession = async (sessionId) => {
  try {
    const response = await API.post('/api/sessions/close', { sessionId });
    return response.data;
  } catch (err) {
    console.error('Error closing session:', err);
    throw err;
  }
};
