import React, { useEffect, useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import {
  Loadingoverlay,
  Select,
  Textarea,
  Textinput,
} from "@nayeshdaggula/tailify";
import Flatapi from "../api/Flatapi.jsx";
import Projectapi from "../api/Projectapi.jsx";
import Groupownerapi from "../api/Groupownerapi.jsx";
import Errorpanel from "../shared/Errorpanel";

function Addflat() {
  const navigate = useNavigate();

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employee_id = employeeInfo?.id || null;

  const [flatNo, setFlatNo] = useState("");
  const [flatNoError, setFlatNoError] = useState("");
  const updateFlatNo = (e) => {
    const value = e.target.value;
    setFlatNo(value);
    setFlatNoError("");
  };

  const [UDL, setUDL] = useState("");
  const [udlError, setUDLError] = useState("");
  const updateUDL = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setUDL(value);
    setUDLError("");
  };

  const [groupOwners, setGroupOwners] = useState([]);
  const [groupOwnersError, setGroupOwnersError] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const handleOwnerChange = (value) => {
    setSelectedOwner(value);
    setGroupOwnersError("");
  };

  const [block, setBlock] = useState("");
  const [blockError, setBlockError] = useState("");
  const updateBlock = (value) => {
    setBlock(value);
    setBlockError("");
  };

  const [FloorNo, setFloorNo] = useState("");
  const [FloorNoError, setFloorNoError] = useState("");
  const updateFloorNo = (value) => {
    setFloorNo(value);
    setFloorNoError("");
  };

  const [deedNo, setDeedNo] = useState("");
  const [deedNoError, setDeedNoError] = useState("");
  const updateDeedNo = (e) => {
    const value = e.target.value;
    setDeedNo(value);
    setDeedNoError("");
  };

  const [squareFeet, setSquareFeet] = useState("");
  const [squareFeetError, setSquareFeetError] = useState("");
  const updateSquareFeet = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setSquareFeet(value);
    setSquareFeetError("");
  };

  const [parkingSquareFeet, setParkingSquareFeet] = useState("");
  const [parkingSquareFeetError, setParkingSquareFeetError] = useState("");
  const updateParkingSquareFeet = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setParkingSquareFeet(value);
    setParkingSquareFeetError("");
  };

  const [flatType, setFlatType] = useState("");
  const [flatTypeError, setFlatTypeError] = useState("");
  const updateFlatType = (value) => {
    setFlatType(value);
    setFlatTypeError("");
  };

  const [facing, setFacing] = useState("");
  const [facingError, setFacingError] = useState("");
  const updateFacing = (value) => {
    setFacing(value);
    setFacingError("");
  };

  const [bedrooms, setBedrooms] = useState("");
  const [bedroomsError, setBedroomsError] = useState("");
  const updateBedrooms = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setBedrooms(value);
    setBedroomsError("");
  };

  const [bathrooms, setBathrooms] = useState("");
  const [bathroomsError, setBathroomsError] = useState("");
  const updateBathrooms = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setBathrooms(value);
    setBathroomsError("");
  };

  const [balconies, setBalconies] = useState("");
  const [balconiesError, setBalconiesError] = useState("");
  const updateBalconies = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setBalconies(value);
    setBalconiesError("");
  };

  const [eastFace, setEastFace] = useState("");
  const [eastFaceError, setEastFaceError] = useState("");
  const updateEastFace = (e) => {
    let value = e.target.value;
    setEastFace(value);
    setEastFaceError("");
  };

  const [westFace, setWestFace] = useState("");
  const [westFaceError, setWestFaceError] = useState("");
  const updateWestFace = (e) => {
    let value = e.target.value;
    setWestFace(value);
    setWestFaceError("");
  };

  const [northFace, setNorthFace] = useState("");
  const [northFaceError, setNorthFaceError] = useState("");
  const updateNorthFace = (e) => {
    let value = e.target.value;
    setNorthFace(value);
    setNorthFaceError("");
  };

  const [southFace, setSouthFace] = useState("");
  const [southFaceError, setSouthFaceError] = useState("");
  const updateSouthFace = (e) => {
    let value = e.target.value;
    setSouthFace(value);
    setSouthFaceError("");
  };

  const [parking, setParking] = useState(false);
  const [parkingError, setParkingError] = useState("");
  const updateParking = (value) => {
    setParking(value);
    setParkingError("");
  };

  const [corner, setCorner] = useState(false);
  const [cornerError, setCornerError] = useState("");
  const updateCorner = (value) => {
    setCorner(value);
    setCornerError("");
  };

  const [mortgage, setMortgage] = useState(false);
  const [mortgageError, setMortgageError] = useState("");
  const updateMortgage = (value) => {
    setMortgage(value);
    setMortgageError("");
  };

  const [floorRise, setFloorRise] = useState(false);
  const [floorRiseError, setFloorRiseError] = useState("");
  const updateFloorRise = (value) => {
    setFloorRise(value);
    setFloorRiseError("");
  };

  const [furnishingStatus, setFurnishingStatus] = useState("");
  const [furnishingStatusError, setFurnishingStatusError] = useState("");
  const updateFurnishingStatus = (value) => {
    setFurnishingStatus(value);
    setFurnishingStatusError("");
  };

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const updateDescription = (e) => {
    const value = e.target.value;
    setDescription(value);
    setDescriptionError("");
  };

  const [googleMapLink, setGoogleMapLink] = useState("");
  const [googleMapLinkError, setGoogleMapLinkError] = useState("");
  const updateGoogleMapLink = (e) => {
    const value = e.target.value;
    setGoogleMapLink(value);
    setGoogleMapLinkError("");
  };

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [blocks, setBlocks] = useState([]);

  const fetchblocks = async () => {
    setIsLoadingEffect(true);

    Projectapi.get("get-blocks-label")
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          setErrorMessage(data.message);
          setIsLoadingEffect(false);
          return false;
        }
        const blocks = data.blocks;
        setBlocks(blocks);
        setIsLoadingEffect(false);
        setErrorMessage("");
        return false;
      })
      .catch((error) => {
        console.log(error);
        let finalresponse;
        if (error.response !== undefined) {
          finalresponse = {
            message: error.message,
            server_res: error.response.data,
          };
        } else {
          finalresponse = {
            message: error.message,
            server_res: null,
          };
        }
        setIsLoadingEffect(false);
        setErrorMessage(finalresponse);
        return false;
      });
  };

  async function fetchGroupOwners() {
    setIsLoadingEffect(true);
    try {
      const response = await Groupownerapi.get("/get-list-group-owners");
      const data = response?.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoadingEffect(false);
        return false;
      }
      setGroupOwners(data?.groupOwners);

      setIsLoadingEffect(false);
      return true;
    } catch (error) {
      console.error("fetchGroupOwners error:", error);
      const finalresponse = {
        message: error.message || "Failed to fetch group owners",
        server_res: error.response?.data || null,
      };
      setErrorMessage(finalresponse);
      setIsLoadingEffect(false);
      return false;
    }
  }

  const handleSubmit = () => {
    setIsLoadingEffect(true);

    if (flatNo === "" || !flatNo) {
      setIsLoadingEffect(false);
      setFlatNoError("Enter Flat No");
      return false;
    }

    if (FloorNo === "" || !FloorNo) {
      setIsLoadingEffect(false);
      setFloorNoError("Enter Floor No");
      return false;
    }

    if (block === "" || !block) {
      setIsLoadingEffect(false);
      setBlockError("Enter Block");
      return false;
    }

    // if (selectedOwner === "" || !selectedOwner) {
    //   setIsLoadingEffect(false);
    //   setGroupOwnersError("Enter Group/Owner");
    //   return false;
    // }

    if (mortgage === "" || !mortgage) {
      setIsLoadingEffect(false);
      setMortgageError("Enter Mortgage ?");
      return false;
    }

    if (squareFeet === "" || !squareFeet) {
      setIsLoadingEffect(false);
      setSquareFeetError("Enter Square Feet");
      return false;
    }

    if (googleMapLink && !googleMapLink.startsWith("https://")) {
      setIsLoadingEffect(false);
      setGoogleMapLinkError("Invalid google map link");
      return false;
    }

    const googleMapRegex = /^https:\/\/(www\.)?google\.[a-z.]+\/maps|^https:\/\/maps\.app\.goo\.gl\//;

    if (googleMapLink && !googleMapRegex.test(googleMapLink)) {
      setIsLoadingEffect(false);
      setGoogleMapLinkError("Enter a valid Google Map link");
      return false;
    }

    if (!selectedProject) {
      setIsLoadingEffect(false);
      setSelectedProjectError("Select Project");
      return false;
    }

    const formData = {
      employee_id: employee_id,
      project_uuid: selectedProject,
      flatNo: flatNo,
      block: block,
      floorNo: FloorNo,
      squareFeet: squareFeet,
      flatType: flatType,
      facing: facing,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      balconies: balconies,
      furnishingStatus: furnishingStatus,
      description: description,
      parking: parkingSquareFeet,
      udlNo: UDL,
      group_owner: selectedOwner,
      east_face: eastFace,
      west_face: westFace,
      north_face: northFace,
      south_face: southFace,
      corner: corner,
      mortgage: mortgage,
      deedNo: deedNo,
      // floorRise: floorRise,
      google_map_link: googleMapLink,
    };

    Flatapi.post("flats/add-flat", formData)
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        navigate("/flats");
        setErrorMessage("");
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log(error);
        let finalresponse;
        if (error.response !== undefined) {
          finalresponse = {
            message: error.message,
            server_res: error.response.data,
          };
        } else {
          finalresponse = {
            message: error.message,
            server_res: null,
          };
        }
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      });
  };

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectError, setSelectedProjectError] = useState("");
  const handleProjectChange = (value) => {
    setSelectedProject(value);
    setSelectedProjectError("");
  };

  const fetchProjects = async () => {
    setIsLoadingEffect(true);
    Projectapi.get("get-all-projects")
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          // Handle error if needed, or just log
          console.error("Error fetching projects:", data.message);
        } else {
          const projectOptions = (data.data || []).map(p => ({
            value: p.uuid,
            label: p.project_name
          }));
          setProjects(projectOptions);

          // Optional: Select the first project by default if available
          // if (projectOptions.length > 0) {
          //     setSelectedProject(projectOptions[0].value);
          // }
        }
        // Don't turn off loading here as other fetches might be running, 
        // or handle loading state more granularly. 
        // For now, let's just let the other independent fetches handle their own loading or global loading.
        // Actually, since we set isLoadingEffect(true) at start of this function, we should ideally turn it off or manage it.
        // But existing code has multiple fetches in useEffect. simpler to just not block UI too much.
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
    // Not disabling loading here to avoid conflict with other parallel fetches if they share same loading state
  };

  useEffect(() => {
    fetchblocks();
    fetchGroupOwners();
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-[22px] font-semibold">Add Flat</h1>
        <Link
          to={"/flats"}
          className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
        >
          <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
          Back
        </Link>
      </div>

      <div className="relative bg-white p-6 rounded-[4px] border-[0.6px] border-[#979797]/40">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select
              data={projects}
              placeholder="Select Project"
              value={selectedProject}
              label="Project"
              error={selectedProjectError}
              searchable
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-full"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              onChange={handleProjectChange}
              selectWrapperClass="!shadow-none"
            />
            <Textinput
              label="Flat No"
              value={flatNo}
              onChange={updateFlatNo}
              error={flatNoError}
              placeholder="Enter Flat No"
            />
            <Select
              data={Array.from({ length: 100 }, (_, i) => ({
                value: String(i + 1),
                label: ` ${i + 1}`,
              }))}
              placeholder="Select Floor No"
              searchable
              value={FloorNo}
              label="Floor No"
              error={FloorNoError}
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-12"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              onChange={updateFloorNo}
              selectWrapperClass="!shadow-none"
            />

            <Select
              data={blocks}
              placeholder="Select Block"
              value={block}
              label="Block"
              error={blockError}
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-12"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              onChange={updateBlock}
              selectWrapperClass="!shadow-none"
            />
            {/* <Select
              data={groupOwners}
              label="Group/Owner"
              value={selectedOwner}
              searchable
              onChange={handleOwnerChange}
              placeholder="Select Group Owner"
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-full"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              selectWrapperClass="!shadow-none"
            /> */}
            <Select
              data={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              label="Mortgage"
              value={mortgage}
              onChange={updateMortgage}
              error={mortgageError}
              placeholder="Select Mortgage"
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-12"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              selectWrapperClass="!shadow-none"
            />
            <Textinput
              label="Area(Sq.ft.)"
              value={squareFeet}
              onChange={updateSquareFeet}
              error={squareFeetError}
              placeholder="Enter Square Feet"
            />
            {/* <Textinput
              label="UDL"
              value={UDL}
              onChange={updateUDL}
              error={udlError}
              placeholder="Enter UDL No"
            />
            <Textinput
              label="Deed No"
              value={deedNo}
              onChange={updateDeedNo}
              error={deedNoError}
              placeholder="Enter Deed No"
            /> */}
            <Select
              data={[
                { value: "2 BHK", label: "2 BHK" },
                { value: "3 BHK", label: "3 BHK" },
              ]}
              placeholder="Select flat type"
              value={flatType}
              label="Flat Type"
              error={flatTypeError}
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-12"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              onChange={updateFlatType}
              selectWrapperClass="!shadow-none"
            />
            {/* <Textinput
              label="Bedrooms"
              value={bedrooms}
              onChange={updateBedrooms}
              error={bedroomsError}
              placeholder="Enter Bedrooms"
            />
            <Textinput
              label="Bathrooms"
              value={bathrooms}
              onChange={updateBathrooms}
              error={bathroomsError}
              placeholder="Enter Bathrooms"
            /> 
            <Textinput
              label="Balconies"
              value={balconies}
              onChange={updateBalconies}
              error={balconiesError}
              placeholder="Enter Balconies"
            />
            <Textinput
              label="Parking Area(Sq.ft.)"
              value={parkingSquareFeet}
              onChange={updateParkingSquareFeet}
              error={parkingSquareFeetError}
              placeholder="Enter Square Feet"
            /> */}
            <Select
              data={[
                { value: "North", label: "North" },
                { value: "South", label: "South" },
                { value: "East", label: "East" },
                { value: "West", label: "West" },
                { value: "NorthEast", label: "NorthEast" },
                { value: "NorthWest", label: "NorthWest" },
                { value: "SouthEast", label: "SouthEast" },
                { value: "SouthWest", label: "SouthWest" },
              ]}
              placeholder="Select Facing"
              value={facing}
              label="Facing"
              error={facingError}
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-12"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              onChange={updateFacing}
              selectWrapperClass="!shadow-none"
            />
            <Textinput
              label="East Facing View"
              value={eastFace}
              onChange={updateEastFace}
              error={eastFaceError}
              placeholder="Enter POV"
            />
            <Textinput
              label="West Facing View"
              value={westFace}
              onChange={updateWestFace}
              error={eastFaceError}
              placeholder="Enter POV"
            />
            <Textinput
              label="North Facing View"
              value={northFace}
              onChange={updateNorthFace}
              error={northFaceError}
              placeholder="Enter POV"
            />
            <Textinput
              label="South Facing View"
              value={southFace}
              onChange={updateSouthFace}
              error={southFaceError}
              placeholder="Enter POV"
            />
            <Select
              data={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              label="Corner"
              value={corner}
              onChange={updateCorner}
              error={cornerError}
              placeholder="Is Corner ?"
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-12"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              selectWrapperClass="!shadow-none"
            />

            {/* <Select
              data={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              label="Floor Rise"
              value={floorRise}
              onChange={updateFloorRise}
              error={floorRiseError}
              placeholder="Select Floor Rise"
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-12"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              selectWrapperClass="!shadow-none"
            /> */}
            {/* <Select
              data={[
                { value: "Furnished", label: "Furnished" },
                { value: "SemiFurnished", label: "SemiFurnished" },
                { value: "Unfurnished", label: "Unfurnished" },
              ]}
              placeholder="Select furnishing status"
              value={furnishingStatus}
              label="Furnishing Status"
              // searchable
              error={furnishingStatusError}
              inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
              className="!m-0 !p-0 w-12"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
              onChange={updateFurnishingStatus}
              selectWrapperClass="!shadow-none"
            /> 
            <Textinput
              label="Google Map Link"
              value={googleMapLink}
              onChange={updateGoogleMapLink}
              error={googleMapLinkError}
              placeholder="Enter Google Map Link"
            />
            <div className="col-span-3">
              <Textarea
                label="Description"
                value={description}
                onChange={updateDescription}
                error={descriptionError}
                placeholder="Enter Description"
              />
            </div>*/}
          </div>
          {isLoadingEffect ? (
            isLoadingEffect && (
              <div className="absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded">
                <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
              </div>
            )
          ) : (
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-[14px] text-white bg-[#0083bf] rounded cursor-pointer"
              >
                Add Flat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* {errorMessage && <p className="text-sm text-[#ec0606]">{errorMessage}</p>} */}
      {errorMessage !== "" && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}
    </div>
  );
}

export default Addflat;
