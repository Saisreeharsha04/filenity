import { $fetch } from "../fetch";

export const AddProjectsAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/projects", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const GetProjectsAPI = async ({ page, limit }: { page: number; limit: number }) => {
  try {
    const response = await $fetch.get(`/projects?page=${page}&limit=${limit}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
