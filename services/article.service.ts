import { Article, ArticleFormData } from "@/type/api";
import axios from "axios";

// Public read — Resources page (no auth)
const PUBLIC_BASE = `${process.env.NEXT_PUBLIC_API_URL}`; // .../api/v1
// Admin CRUD — Admin panel (auth required)
const ADMIN_BASE = `${process.env.NEXT_PUBLIC_API_URL_ADMIN}`; // .../api/v2/admin

const getToken = () => localStorage.getItem("token");

export const articleService = {
  // Public — used on the Resources page
  getPublishedArticles: async (): Promise<Article[]> => {
    const response = await axios.get(`${PUBLIC_BASE}/articles`);
    return response.data.data;
  },

  // Admin — list all (active + inactive) for the admin table
  getAllArticlesAdmin: async (): Promise<Article[]> => {
    const response = await axios.get(`${ADMIN_BASE}/articles`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      withCredentials: true,
    });
    return response.data.data;
  },

  createArticle: async (data: ArticleFormData): Promise<Article> => {
    const response = await axios.post(`${ADMIN_BASE}/articles`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
      withCredentials: true,
    });
    return response.data.data;
  },

  updateArticle: async (id: string, data: Partial<ArticleFormData> & { isActive?: boolean }): Promise<Article> => {
    const response = await axios.put(`${ADMIN_BASE}/articles/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
      withCredentials: true,
    });
    return response.data.data;
  },

  deleteArticle: async (id: string): Promise<void> => {
    await axios.delete(`${ADMIN_BASE}/articles/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
      withCredentials: true,
    });
  },
};

// Converts a File (from <input type="file">) into a base64 data URI string,
// since the backend stores articleLogo as a plain string (no file upload middleware).
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
