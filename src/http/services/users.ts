import { $fetch } from "../fetch";

export const GetUsersAPI = async ({ page, limit }: { page: number; limit: number }) => {
    try {
        const response = await $fetch.get(`/users?page=${page}&limit=${limit}`);
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const AddUserAPI = async (payload: any) => {
    try {
        const response = await $fetch.post("/users/add", payload)
        return response.data;
    } catch (err) {
        throw err;
    }
};  