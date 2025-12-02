import { $fetch } from "../fetch";

export const GetFilesAPI = async ({ page, limit }: { page: number; limit: number }) => {
  try {
    const response = await $fetch.get(`/files?page=${page}&limit=${limit}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const GetSignedUrlAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/files/signed-url", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const RegisterFileMetaAPI = async (payload: any) => {
  try {
    const response = await $fetch.post("/files", payload);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const DownloadFileAPI = async (fileId: number) => {
  try {
    const response = await $fetch.get(`/files/${fileId}/download`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const GetFileInfoAPI = async (fileId: number) => {
  try {
    const response = await $fetch.get(`/files/${fileId}/info`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const DeleteFileAPI = async (fileId: number) => {
  try {
    const response = await $fetch.delete(`/files/${fileId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const formatFileSize = (bytes: number) => {
  if (!bytes && bytes !== 0) return "--";
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  else if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  else return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
