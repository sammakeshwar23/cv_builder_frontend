import axios from 'axios';
import { API_BASE_URL } from '../constants/api'; 

const CV_API = `${API_BASE_URL}/cvs`;

export const getUserCVs = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(CV_API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getCVById = async (cvId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${CV_API}/${cvId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const getUserAllCVs = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${CV_API}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteCV = async (cvId) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${CV_API}/${cvId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const markCVAsPaid = async (cvId) => {
  const token = localStorage.getItem('token');
  const res = await axios.patch(`${CV_API}/${cvId}/mark-paid`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


export const createCV = async (cvData) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${CV_API}/create`, cvData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateCV = async (cvId, updatedData) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${CV_API}/${cvId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const downloadCV = async (cvId, template = '1') => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${CV_API}/${cvId}/download?template=${template}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });
  return res.data;
};

export const shareCV = async (cvId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${CV_API}/${cvId}/share`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const generateShareLink = async (cvId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${CV_API}/${cvId}/generate-share-link`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getCVPreview = async (templateNumber, data) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${CV_API}/preview/${templateNumber}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};