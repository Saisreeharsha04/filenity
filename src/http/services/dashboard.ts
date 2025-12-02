import { $fetch } from "../fetch";

export const GetDashboardStatsAPI = async () => {
    try {
        const response = await $fetch.get("/dashboard/stats");
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const GetDashboardRecentFilesAPI = async () => {
    try {
        const response = await $fetch.get("/dashboard/recent-files");
        return response.data;
    } catch (err) {
        throw err;
    }
}