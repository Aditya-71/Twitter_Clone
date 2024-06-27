import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useCustomToast from "./useCustomTost";

function useGetUserProfile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showErrorToast } = useCustomToast();

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                console.log("Fetching user profile...");
                const response = await axios.get(`/api/users/profile/${username}`);
                console.log("User profile fetched:", response.data);

                if(response.data.isFrozen){
                    setUser(null);
                    return;
                }
                setUser(response.data);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    console.log(error.response.data.error);
                    showErrorToast(error.response.data.error);
                } else {
                    showErrorToast("Network Error");
                }
            } finally {
                setLoading(false); // Set loading to false after the request is done
            }
        };

        console.log("Effect triggered");
        getUserProfile();
    }, [username, showErrorToast]);

    return { user, loading };
}

export default useGetUserProfile;
