import axios from 'axios';

const API_URL = 'http://localhost:3030';

export const register = async (email:string, username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { email, username, password });
    return response.data;
  } catch (error: unknown) {
      //throw error.response.data;
  }
};


export const login = async (email:string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {email, password });
      return response.data;
    } catch (error:unknown) {
      //throw error.response.data;
    }
  };

export const getProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
     // throw error.response.data;
    }
  };

  export const updateProfile = async (token: string | null, userData:any) => {
    try {
      const response = await axios.put(`${API_URL}/users/update`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error:unknown) {
      //throw error.response.data;
    }
  };


  export const createRoom = async (token: string | null, name:string, members: any) => {
    try {
      const response = await axios.post(`${API_URL}/rooms`, { name, members}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      //throw error.response.data;
    }
  };


  export const getRooms = async (token: string | null) => {
    try {
      const response = await axios.get(`${API_URL}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      //throw error.response.data;
    }
  };

  export const getChatDetails = async (token: string, chatId: string) => {
    try {
      const response = await axios.get(`${API_URL}/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      //throw error.response.data;
    }
  };

  export const sendMessage = async (token:string, chatId:any, content:any) => {
    try {
      const response = await axios.post(`${API_URL}/chats/${chatId}/messages`, { content }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error:unknown) {
      //throw error.response.data;
    }
  };
 


  export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  };