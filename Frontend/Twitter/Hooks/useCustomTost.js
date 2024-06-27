import { useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

const useCustomToast = () => {
  console.log("toast");
  const showSuccessToast = useCallback( (message) => {
    toast.success(message, {
      position: 'top-right', // Customize the position
      autoClose: 3000, // Auto-close after 3 seconds
      hideProgressBar: true, // Hide the progress bar
      className: 'bg-green-200 text-black-400', // Tailwind CSS classes for styling
    });
  },[toast]);

  const showErrorToast = useCallback( (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      className: 'bg-red-200 text-black-400',
    });
  },[]);

  const showInfoToast = useCallback( (message) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      className: 'bg-yellow-200 text-black-400',
    });
  },[toast]);

  // Add more custom toast functions if needed (e.g., warning, info)

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast
    // Export other custom toast functions here
  };
};

export default useCustomToast;
