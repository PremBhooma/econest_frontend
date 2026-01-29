import React, { useEffect, useState } from "react";
import Flatapi from "../api/Flatapi.jsx";
import Groupownerapi from "../api/Groupownerapi.jsx";
import Projectapi from "../api/Projectapi.jsx";
import Errorpanel from "../shared/Errorpanel";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { IconArrowLeft, IconArrowNarrowLeft } from "@tabler/icons-react";
import {
  Loadingoverlay,
  Modal,
  Select,
  Textarea,
  Textinput,
} from "@nayeshdaggula/tailify";

function Editflat() {
  const navigate = useNavigate();
  const { uuid } = useParams();

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employee_id = employeeInfo?.id || null;

  const [flat, setFlat] = useState(null);
  const [flatNo, setFlatNo] = useState("");
  const [flatNoError, setFlatNoError] = useState("");
  const updateFlatNo = (e) => {
    const value = e.target.value;
    setFlatNo(value);
    setFlatNoError("");
  };

  const [bedrooms, setBedrooms] = useState("");
  const [bedroomsError, setBedroomsError] = useState("");
  const updateBedrooms = (e) => {
    const value = e.target.value;
    setBedrooms(value);
    setBedroomsError("");
  };

  const [bathrooms, setBathrooms] = useState("");
  const [bathroomsError, setBathroomsError] = useState("");
  const updateBathrooms = (e) => {
    const value = e.target.value;
    setBathrooms(value);
    setBathroomsError("");
  };

  const [balconies, setBalconies] = useState("");
  const [balconiesError, setBalconiesError] = useState("");
  const updateBalconies = (e) => {
    const value = e.target.value;
    setBalconies(value);
    setBalconiesError("");
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

  const [squareFeet, setSquareFeet] = useState("");
  const [squareFeetError, setSquareFeetError] = useState("");
  const updateSquareFeet = (e) => {
    const value = e.target.value;
    setSquareFeet(value);
    setSquareFeetError("");
  };

  const [UDL, setUDL] = useState("");
  const [udlError, setUDLError] = useState("");
  const updateUDL = (e) => {
    const value = e.target.value;
    setUDL(value);
    setUDLError("");
  };

  const [projects, setProjects] = useState([]);
  const [rawProjects, setRawProjects] = useState([]);
  const [targetProjectId, setTargetProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectError, setSelectedProjectError] = useState("");
  const handleProjectChange = (value) => {
    setSelectedProject(value);
    setSelectedProjectError("");
  };

  const [groupOwners, setGroupOwners] = useState([]);
  const [groupOwnersError, setGroupOwnersError] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const handleOwnerChange = (value) => {
    setSelectedOwner(value);
    setGroupOwnersError("");
  };

  const [mortgage, setMortgage] = useState(false);
  const [mortgageError, setMortgageError] = useState("");
  const updateMortgage = (value) => {
    setMortgage(value);
    setMortgageError("");
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

  const [deedNo, setDeedNo] = useState("");
  const [deedNoError, setDeedNoError] = useState("");
  const updateDeedNo = (e) => {
    const value = e.target.value;
    setDeedNo(value);
    setDeedNoError("");
  };

  const [corner, setCorner] = useState(false);
  const [cornerError, setCornerError] = useState("");
  const updateCorner = (value) => {
    setCorner(value);
    setCornerError("");
  };

  const [floorRise, setFloorRise] = useState(false);
  const [floorRiseError, setFloorRiseError] = useState("");
  const updateFloorRise = (value) => {
    setFloorRise(value);
    setFloorRiseError("");
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

  const [parkingSquareFeet, setParkingSquareFeet] = useState("");
  const [parkingSquareFeetError, setParkingSquareFeetError] = useState("");
  const updateParkingSquareFeet = (e) => {
    const value = e.target.value;
    setParkingSquareFeet(value);
    setParkingSquareFeetError("");
  };

  const [googleMapLink, setGoogleMapLink] = useState("");
  const [googleMapLinkError, setGoogleMapLinkError] = useState("");
  const updateGoogleMapLink = (e) => {
    const value = e.target.value;
    setGoogleMapLink(value);
    setGoogleMapLinkError("");
  };

  const [floorEastCorner, setFloorEastCorner] = useState(false)
  const openFloorEastCorner = () => {
    setFloorEastCorner(true)
  }
  const closeFloorEastCorner = () => {
    setFloorEastCorner(false)
  }

  const [originalFloor, setOriginalFloor] = useState(null);
  const [originalFacing, setOriginalFacing] = useState(null);
  const [originalCorner, setOriginalCorner] = useState(null);
  const [flatStatus, setFlatStatus] = useState("");

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFlat = async (uuid) => {
    setIsLoadingEffect(true);

    Flatapi.get(`get-flat/${uuid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          setErrorMessage(data.message);
          setIsLoadingEffect(false);
          return false;
        }
        console.log(data.flat);
        let flat = data.flat;
        setFlatNo(flat?.flat_no);
        setBlock(flat?.block_id);
        setFloorNo(flat?.floor_no);
        setSquareFeet(flat?.square_feet);
        setFlatType(flat?.type);
        setFacing(flat?.facing);
        setParkingSquareFeet(flat?.parking);
        setUDL(flat?.udl);
        setCorner(flat?.corner === true ? "true" : "false");
        setMortgage(flat?.mortgage === true ? "true" : "false");
        setEastFace(flat?.east_face);
        setWestFace(flat?.west_face);
        setNorthFace(flat?.north_face);
        setSouthFace(flat?.south_face);
        setDeedNo(flat?.deed_number);
        setFloorRise(flat?.floor_rise === true ? "true" : "false");
        setSelectedOwner(flat?.group_owner_id);
        setBedrooms(flat?.bedrooms);
        setBathrooms(flat?.bathrooms);
        setBalconies(flat?.balconies);
        setFurnishingStatus(flat?.furnished_status);
        setDescription(flat?.description);
        setFlatStatus(flat?.status);
        setOriginalFloor(flat?.floor_no);
        setOriginalFacing(flat?.facing);
        setOriginalCorner(flat?.corner === true ? "true" : "false");
        setTargetProjectId(flat?.project_id);

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
      setGroupOwners(data?.groupOwners || []);
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

  const [blocks, setBlocks] = useState([]);

  const fetchblocks = async () => {
    setIsLoadingEffect(true);

    Projectapi.get("get-blocks-label")
      .then((response) => {
        let data = response?.data;
        if (data?.status === "error") {
          setErrorMessage(data?.message);
          setIsLoadingEffect(false);
          return false;
        }
        const blocks = data?.blocks;
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
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      });

  };

  const fetchProjects = async () => {
    setIsLoadingEffect(true);
    Projectapi.get("get-all-projects")
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          console.error("Error fetching projects:", data.message);
        } else {
          const projectOptions = (data.data || []).map(p => ({
            value: p.uuid,
            label: p.project_name
          }));
          setProjects(projectOptions);
          setRawProjects(data.data || []);
        }
        setIsLoadingEffect(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setIsLoadingEffect(false);
      });
  };

  const handleSubmit = () => {
    if (
      (FloorNo !== originalFloor ||
        facing !== originalFacing ||
        corner !== originalCorner) && flatStatus !== "Unsold"
    ) {
      openFloorEastCorner();
      return;
    }

    proceedWithSubmit();
  };



  const proceedWithSubmit = () => {
    if (!selectedProject) {
      setIsLoadingEffect(false);
      setSelectedProjectError("Select Project");
      return false;
    }

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

    // if (mortgage === "" || !mortgage) {
    //   setIsLoadingEffect(false);
    //   setMortgageError("Enter Mortgage ?");
    //   return false;
    // }

    if (squareFeet === "" || !squareFeet) {
      setIsLoadingEffect(false);
      setSquareFeetError("Enter Square Feet");
      return false;
    }

    // if (googleMapLink && !googleMapLink.startsWith("https://")) {
    //   setIsLoadingEffect(false);
    //   setGoogleMapLinkError("Enter a valid Google Map link");
    //   return false;
    // }

    // const googleMapRegex = /^https:\/\/(www\.)?google\.[a-z.]+\/maps|^https:\/\/maps\.app\.goo\.gl\//;

    // if (googleMapLink && !googleMapRegex.test(googleMapLink)) {
    //   setIsLoadingEffect(false);
    //   setGoogleMapLinkError("Enter a valid Google Map link");
    //   return false;
    // }


    const formData = {
      employee_id: employee_id,
      project_uuid: selectedProject,
      uuid: uuid,
      flatNo: flatNo,
      block: block,
      floorNo: FloorNo,
      squareFeet: squareFeet,
      flatType: flatType,
      facing: facing,
      parking: parkingSquareFeet,
      udlNo: UDL,
      group_owner: selectedOwner,
      east_face: eastFace,
      west_face: westFace,
      north_face: northFace,
      south_face: southFace,
      mortgage: mortgage,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      balconies: balconies,
      corner: corner,
      furnishingStatus: furnishingStatus,
      description: description,
      deedNo: deedNo,
      // floorRise: floorRise,
      google_map_link: googleMapLink,
    };

    Flatapi.post("update-flat", formData)
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setIsLoadingEffect(false);
          setErrorMessage(finalresponse);
          return false;
        }
        setIsLoadingEffect(false);
        setErrorMessage("");
        navigate("/flats");
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

  useEffect(() => {
    fetchFlat(uuid);
    fetchblocks();
    fetchGroupOwners();
    fetchProjects();
  }, [uuid]);

  useEffect(() => {
    if (targetProjectId && rawProjects.length > 0) {
      const matchedProject = rawProjects.find(p => String(p.id) === String(targetProjectId));
      if (matchedProject) {
        setSelectedProject(matchedProject.uuid);
      }
    }
  }, [targetProjectId, rawProjects]);


  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-[22px] font-semibold">Update Flat</h1>
          <Link to={`/flats`} className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200">
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
              {/* <Textinput
                label="Floor No"
                value={FloorNo}
                onChange={updateFloorNo}
                error={FloorNoError}
                placeholder="Enter Floor No"
              /> */}

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
                // searchable
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
                error={groupOwnersError}
                searchable
                onChange={handleOwnerChange}
                placeholder="Select Group Owner"
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
                placeholder="Mortgage ?"
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
                // searchable
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
                placeholder="Floor Rise"
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
              </div> */}
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
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* {errorMessage && <p className="text-sm text-[#ec0606]">{errorMessage}</p>} */}
      {errorMessage !== "" && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}

      <Modal
        open={floorEastCorner}
        close={closeFloorEastCorner}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {floorEastCorner && (
          <div className="p-4 text-center">
            <p className="text-gray-800 font-medium mb-4">
              Changing <strong>Floor / Facing / Corner</strong> values will update the
              flat cost calculations.
              Do you want to proceed?
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={closeFloorEastCorner}
                className="px-4 py-2 bg-gray-400 text-white rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closeFloorEastCorner();
                  proceedWithSubmit();
                }}
                className="px-4 py-2 bg-[#0083bf] cursor-pointer text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default Editflat;
