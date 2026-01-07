import React, { useState } from "react";
import Employeeapi from "../../api/Employeeapi";
import { toast } from "react-toastify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";

function Addnewform({ reloadGetroledata }) {
  const userInfo = useEmployeeDetails((state) => state.employeeInfo);
  const access_token = useEmployeeDetails((state) => state.access_token);
  let user_id = userInfo?.user_id || "";

  const [roleName, setRoleName] = useState("");
  const [roleNameError, setRoleNameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateRoleName = (e) => {
    let value = e.target.value;
    // Split by space, capitalize each word
    const formatted = value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    setRoleName(formatted);
    setRoleNameError("");
  };

  const submiteRoleName = async () => {
    setIsLoading(true);

    if (!roleName.trim()) {
      setRoleNameError("Role Name is required");
      setIsLoading(false);
      return;
    }

    if (["super admin", "superadmin"].includes(roleName.toLowerCase())) {
      setRoleNameError("Role Name is already taken");
      setIsLoading(false);
      return;
    }

    if (roleName === "") {
      setRoleNameError("Role is required");
      setIsLoading(false);
      return false;
    }

    await Employeeapi.post(
      "addnewrole",
      {
        role_name: roleName,
        user_id: user_id,
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((response) => {
        let data = response?.data;
        if (data.status === "error") {
          setIsLoading(false);
          return false;
        }
        if (data?.status === "success") {
          toast.success(data?.message);
          setRoleName("");
          setIsLoading(false);
          reloadGetroledata();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[#2B2B2B] text-[16px] font-[500] leading-[18px]">
        Add New Role
      </p>

      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Role Name"
          name="rolename"
          value={roleName}
          onChange={updateRoleName}
          className={`w-full px-4 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0083bf] focus:border-none ${roleNameError ? "border-red-500" : "border-gray-300"
            }`}
        />
        {roleNameError && (
          <p className="text-red-500 text-sm mt-1">{roleNameError}</p>
        )}
      </div>

      <button
        onClick={submiteRoleName}
        disabled={isLoading}
        className="cursor-pointer flex justify-center w-full items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-[#0083bf] hover:text-white text-[#0083bf] border-[0.8px] border-[#0083bf]"
      >
        <p className="text-sm font-medium">Add Role</p>
      </button>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default Addnewform;
