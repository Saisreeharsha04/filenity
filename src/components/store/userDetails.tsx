    import { Store } from "@tanstack/store";

    type UserState = {
        full_name: string;
        email: string;
        phone: string;
        user_type: string;
    };

    function loadUserState(): UserState {
        try {
            if (typeof window == "undefined")
                return { full_name: "", email: "", phone: "", user_type: "" };

            const savedState = localStorage.getItem("userState");
            if (savedState) {
                try {
                    return JSON.parse(savedState);
                } catch (error) { }
            }
            return { full_name: "", email: "", phone: "", user_type: "" };
        } catch (error) {
            return { full_name: "", email: "", phone: "", user_type: "" };
        }
    }

    const initialState: UserState = loadUserState();

    export const userStore = new Store<UserState>(initialState);

    export const updateUserStore = (updates: Partial<UserState>) => {
        userStore.setState((state) => ({
            ...state,
            ...updates,
        }));

        if (typeof window == "undefined") return;
        localStorage.setItem("userState", JSON.stringify(userStore.state));
    };

    export const getUserState = (): UserState => {
        return userStore.state;
    };