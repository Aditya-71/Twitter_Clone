import React from "react";

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen w-screen mx-auto">
     <div className="animate-spin rounded-full border-t-4 border-blue-700 border-opacity-25 h-12 w-12"></div>
    </div>
  );
}

export default Loader;
