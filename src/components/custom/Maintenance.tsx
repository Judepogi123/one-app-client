//import React from "react";

// Icons
import { GrHostMaintenance } from "react-icons/gr";

const Maintenance = () => {
  return (
    <div className="w-full h-full min-h-[500px] p-2 grid">
      <div className="w-auto p-2 m-auto flex justify-center flex-col items-center">
        <GrHostMaintenance size={40} />
        <h1 className="text-lg mt-2 font-medium">
          Sorry for the inconvenience. This page is currently undergoing
          maintenance.
        </h1>
        <p>We are working to resolve some issues, bugs, and errors.</p>
        <h1 className="italic">02/15/2025 12:01 AM - 02/17/2025 12:01 AM</h1>
      </div>
    </div>
  );
};

export default Maintenance;
