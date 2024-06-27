import React from "react";
import useCustomToast from "../../Hooks/useCustomTost";
import  useLogout  from "../../Hooks/useLogout";
import axios from "axios";

export const SettingsPage = () => {
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account?"))
      return;

    try {
      const response = await axios.put("/api/users/freeze");

      await logout();
      if (response.data.success) {
        showSuccessToast("Your account has been frozen");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error.response.data.error);
        showErrorToast(error.response.data.error);
      } else {
        showErrorToast("Network Error");
      }
    }
  };

  return (
    <div>
      <p className="my-1 font-bold">Freeze Your Account</p>
      <p className="my-1">
        You can unfreeze your account anytime by logging in.
      </p>
      <button
        className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        onClick={freezeAccount}
      >
        Freeze
      </button>
    </div>
  );
};
