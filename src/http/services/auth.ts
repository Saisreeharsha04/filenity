import { $fetch } from "../fetch"

export const loginWithEmailOTPAPI = async (
    payload: { email: string; otp: string }
  )=> {
    try {
      const response = await $fetch.post("/users/verify-otp", payload);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

export const loginWithEmailAPI = async ({email}: {email: string}) => {
    try{
        const response = await $fetch.post("/users/login", {email});
        return response.data;
    }catch(err){
        throw err;
    }   
}
