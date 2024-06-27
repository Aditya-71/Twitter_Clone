import { Link } from "react-router-dom";
import useFollowUnfollow from "../../Hooks/useFollowUnfollow";

const SuggestedUser = ({ user }) => {
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow({
    user,
  });

  return (
    <div className="flex gap-2 justify-between items-center">
      <Link to={`/${user.username}`} className="flex gap-2 items-center">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <svg
            className="w-10 h-10 me-3 text-gray-200 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        )}

        <div>
          <p className="text-sm font-bold">{user.username}</p>
          <p className="text-sm text-gray-400">{user.name}</p>
        </div>
      </Link>
      <button
        className={`text-sm px-4 py-2 rounded ${
          following ? "text-black bg-white" : "text-white bg-blue-400"
        }`}
        onClick={handleFollowUnfollow}
        disabled={updating}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default SuggestedUser;
