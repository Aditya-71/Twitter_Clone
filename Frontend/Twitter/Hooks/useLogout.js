import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useCustomToast from "./useCustomTost";
import axios from "axios";

function useLogout() {
        const setUser = useSetRecoilState(userAtom);
        const {showErrorToast} = useCustomToast();
    
        const Logout = async () => {
            try {
                const res = await axios.post("/api/users/logout");
    
                localStorage.removeItem("user-threads");
                setUser(null);
            } catch (error) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.error
                  ) {
                    console.log(error.response.data.error);
                    showErrorToast(error.response.data.error);
                  } else {
                    showErrorToast("Network Error");
                  }
            }
        };
        return Logout
    };

export default useLogout