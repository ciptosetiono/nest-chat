import axios from 'axios';

const API_URL = 'http://localhost:3001';

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
      console.log(error);
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

  export const getRoomById = async (token: string, roomId: string) => {
    try {
      const response = await axios.get(`${API_URL}/rooms/${roomId}`, {
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
 
  export const uploadFile = async (token: string, roomId: string, file: File) => {
    try {
      console.log(`roomid: ${roomId}`);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/files/upload/${roomId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log(response.data);
      return response.data;
    } catch (error:unknown) {
      throw error;
    }
  };

  export const downloadFile = async (token: string, fileId: string) => {
    try {
      const response = await axios.get(`${API_URL}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error:unknown) {
      throw error;
    }
  };

  export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  };