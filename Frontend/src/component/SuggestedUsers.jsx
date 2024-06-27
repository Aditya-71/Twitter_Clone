import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useCustomToast from "../../Hooks/useCustomTost";
import axios from "axios";

const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const { showErrorToast } = useCustomToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/users/suggested");
        console.log("responsw", response.data);
        setSuggestedUsers(response.data);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          console.log(error.response.data.error);
          showErrorToast(error.response.data.error);
        } else {
          showErrorToast("network error");
        }
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, [showErrorToast]);

  return (
    <>
      <h2 className="mb-4 font-bold text-lg">Suggested Users</h2>
      <div className="flex flex-col gap-4">
        {!loading &&
          suggestedUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))}
        {loading &&
          [0, 1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="flex items-center gap-2 p-1 rounded-md">
              {/* Avatar skeleton */}
              <div className="rounded-full bg-gray-400 h-10 w-10">
                <div className="animate-pulse rounded-full bg-gray-500 h-10 w-10"></div>
              </div>
              {/* Username and fullname skeleton */}
              <div className="flex flex-col flex-1 gap-2">
                <div className="h-2 bg-gray-400 rounded w-80 animate-pulse"></div>
                <div className="h-2 bg-gray-400 rounded w-90 animate-pulse"></div>
              </div>
              {/* Follow button skeleton */}
              <div className="h-8 bg-gray-400 rounded w-20 animate-pulse"></div>
            </div>
          ))}
      </div>
    </>
  );
};

export default SuggestedUsers;
