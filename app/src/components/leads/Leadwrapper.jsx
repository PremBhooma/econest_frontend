import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ExcelJS from "exceljs";
import Customerapi from "../api/Customerapi.jsx";
import Groupownerapi from "../api/Groupownerapi.jsx";
import Leadapi from "../api/Leadapi.jsx";
import Errorpanel from "../shared/Errorpanel.jsx";
import Datefilter from "../shared/Datefilter.jsx";
import DeleteModal from "../shared/DeleteModal.jsx";
import Uploadleadsexcel from "./excelleadswrapper/Uploadleadsexcel.jsx";
import Excelleadstemplate from "./excelleadswrapper/Excelleadstemplate.jsx";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router-dom";
import { useColumnStore } from "../zustand/useColumnStore.jsx";
import { Button, Modal, Pagination, Select } from "@nayeshdaggula/tailify";
import { useProjectDetails } from "../zustand/useProjectDetails.jsx";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails.jsx";
import { IconDownload, IconEdit, IconEye, IconSearch, IconTrash } from "@tabler/icons-react";
import MultipleleadassignModal from "./MultipleleadassignModal.jsx";
import { Funnel } from "lucide-react";

function Leadwrapper() {
  const permissions = useEmployeeDetails((state) => state.permissions);
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const { storedColumns, fetchColumns, handleColumnStore } = useColumnStore();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCustomerCount, setPageCustomerCount] = useState(0);

  const [sortby, setSortby] = useState("created_at");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortbyType, setSortbyType] = useState("desc");
  const [singleLeadId, setSingleLeadId] = useState(null);

  const [leadType, setLeadType] = useState('all')
  const updateLeadType = (type) => {
    setLeadType(type)
    setPage(1);
  };

  const [dateRange, setDateRange] = useState({
    // startDate: new Date(new Date().setDate(new Date().getDate() - 30))
    //   .toISOString()
    //   .split("T")[0],
    // endDate: new Date().toISOString().split("T")[0],
    startDate: "",
    endDate: "",
  });

  const { projectData, hasFetched, fetchProjectData } = useProjectDetails();

  const [projectModel, setProjectModel] = useState(false);
  const openProjectModel = () => {
    setProjectModel(true);
  };
  const closeProjectModel = () => {
    setProjectModel(false);
  };

  const [downloadTemplate, setDownloadTemplate] = useState(false)
  const openDownloadTemplate = () => {
    setDownloadTemplate(true)
  }
  const closeDownloadTemplate = () => {
    setDownloadTemplate(false)
  }

  const [uploadLeadExcel, setUploadLeadExcel] = useState(false)
  const openUploadLeadExcel = () => {
    setUploadLeadExcel(true)
  }
  const closeUploadLeadExcel = () => {
    setUploadLeadExcel(false)
  }

  const [leadStages, setLeadStages] = useState([]);
  const [selectedLeadStage, setSelectedLeadStage] = useState(null);
  const handleLeadStageChange = (value) => {
    setSelectedLeadStage(value);
  };

  useEffect(() => {
    fetchProjectData();
    getLeadStagesData()
  }, []);

  useEffect(() => {
    if (hasFetched) {
      if (
        !projectData ||
        (typeof projectData === "object" &&
          Object.keys(projectData).length === 0)
      ) {
        openProjectModel();
      }
    }
  }, [hasFetched, projectData]);

  const [deleteModal, setDeleteModal] = useState(false);
  const openDeleteModal = (id) => {
    setDeleteModal(true);
    setSingleLeadId(id);
  };
  const closeDeleteModal = () => setDeleteModal(false);

  const [leadsData, setLeadsData] = useState([]);

  const [subordinateId, setSubordinateId] = useState(null);
  const updateSubordinateId = (id) => {
    setSubordinateId(id);
    setPage(1);
  };

  async function getLeadsData(newPage, newLimit, newSearchQuery, newSortbyType, newSortby, newLeadStage, leadType, subordinateid) {
    const params = {
      page: newPage,
      limit: newLimit,
      searchQuery: newSearchQuery,
      sortbyType: newSortbyType,
      sortby: newSortby,
      leadStage: newLeadStage,
      leadType: leadType,
      employee_id: employeeId,
      subordinateId: subordinateid
    };

    if (dateRange.startDate) params.startDate = dateRange.startDate;
    if (dateRange.endDate) params.endDate = dateRange.endDate;

    await Leadapi.get("/get-all-leads", {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoading(false);
          return false;
        }
        setLeadsData(data?.leads || []);
        setTotalPages(data?.totalPages);
        setPageCustomerCount(data?.pageLeadsCount || 0);
        setIsLoading(false);
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
        setIsLoading(false);
        return false;
      });
  }

  async function getLeadStagesData() {
    setIsLoading(true);
    try {
      const response = await Leadapi.get("/get-lead-stages-order-wise");
      const data = response?.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoading(false);
        return false;
      }
      setLeadStages(data?.data);

      setIsLoading(false);
      return true;
    } catch (error) {
      const finalresponse = {
        message: error.message || "Failed to fetch group owners",
        server_res: error.response?.data || null,
      };
      setErrorMessage(finalresponse);
      setIsLoading(false);
      return false;
    }
  }

  const handlePageChange = useCallback(
    (value) => {
      setPage(value);
      getLeadsData(value, limit);
      setIsLoading(true);
    },
    [limit]
  );

  const updateSortby = useCallback(
    (data) => {
      setSortby(data);
      getLeadsData(page, limit, searchQuery, sortbyType, data, selectedLeadStage, leadType, subordinateId);
    },
    [page, limit, searchQuery, sortbyType, selectedLeadStage, leadType, subordinateId]
  );

  const [sortByPanel, setSortByPanel] = useState(false);
  const sortByPanelToggle = () => setSortByPanel(!sortByPanel);

  const updateSortbyType = useCallback(
    (data) => {
      setSortbyType(data);
      getLeadsData(page, limit, searchQuery, data, sortby, selectedLeadStage, leadType, subordinateId);
    },
    [page, limit, searchQuery, sortby, selectedLeadStage, leadType, subordinateId]
  );

  const updateSearchQuery = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
      getLeadsData(page, limit, e.target.value, sortbyType, sortby, selectedLeadStage, leadType, subordinateId);
    },
    [page, limit, sortbyType, sortby, selectedLeadStage, leadType, subordinateId]
  );

  const updateLimit = useCallback(
    (data) => {
      let newpage = 1;
      setLimit(data);
      setPage(newpage);
      getLeadsData(newpage, data, searchQuery, sortbyType, sortby, selectedLeadStage, leadType, subordinateId);
    },
    [page, searchQuery, sortbyType, sortby, selectedLeadStage, leadType, subordinateId]
  );

  useEffect(() => {
    setIsLoading(true);
    getLeadsData(page, limit, searchQuery, sortbyType, sortby, selectedLeadStage, leadType, subordinateId);
  }, [page, limit, searchQuery, sortbyType, sortby, dateRange, selectedLeadStage, leadType, subordinateId]);

  const refreshLeadsData = useCallback(() => {
    setIsLoading(true);
    getLeadsData(page, limit, searchQuery, sortbyType, sortby, selectedLeadStage, leadType, subordinateId);
  }, [page, limit, searchQuery, sortbyType, sortby, selectedLeadStage, leadType, subordinateId]);

  const handleDateFilterChange = (newDateRange) => {
    setDateRange(newDateRange);
    setPage(1);
    setIsLoading(true);
    getLeadsData(1, limit, searchQuery, sortbyType, sortby, selectedLeadStage, leadType, subordinateId);
  };

  const handleDownload = async (searchQuery, dateRange) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const params = {
        searchQuery: searchQuery,
      };

      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await Customerapi.get("get-customers-for-excel", {
        params,
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });

      if (response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Dashboard Stats.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success({
          title: "Export Successful",
          message: "Dashboard stats downloaded successfully.",
          color: "green",
        });
      } else {
        toast.error({
          title: "Export Failed",
          message: "No data received for export.",
          color: "red",
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error Downloading Flat payments Data");
      const finalResonse =
        error.response?.data?.message || "An error occurred during download";
      setErrorMessage(finalResonse);
      setIsLoading(false);
    }
  };

  const handleDownloadFunction = () => {
    handleDownload(searchQuery, dateRange);
  };

  const [visibleColumns, setVisibleColumns] = useState({
    reference: true,
    name: true, // Name
    email: true, // Email
    phone: true, // Phone
    // fatherName: true, // FatherName
    // adhar: true, // Adhar
    // pan: true, // PAN
    // citizenship: true, // Citizenship
    // residence: true, // Residence
    // motherTongue: true, // Mother Tongue
    // maritalStatus: true, // Martial Status
    leadStage: true,
    assignedto: true,
    status: true, // Status
  });
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const containerRef = useRef(null);

  const [allSubordinates, setAllSubordinates] = useState([]);
  const fetchAllSubordinates = async () => {
    setIsLoading(true);
    await Leadapi.get('/getallsubordinates', {
      params: {
        employee_id: employeeId
      }
    })
      .then((res) => {
        const data = res.data;
        if (data.status === "error") {
          const finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoading(false);
          return false;
        }
        setAllSubordinates(data?.subordinates || [])
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error:", error);
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
        setIsLoading(false);
        return false;
      });
  }

  useEffect(() => {
    fetchAllSubordinates();
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowColumnToggle(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleColumn = (colKey) => {
    setVisibleColumns((prev) => {
      const updated = { ...prev, [colKey]: !prev[colKey] };
      handleColumnStore(updated, employeeId, "leads");
      return updated;
    });
  };

  useEffect(() => {
    if (employeeId) {
      fetchColumns(employeeId, "leads");
    }
  }, [employeeId]);

  useEffect(() => {
    if (storedColumns && Array.isArray(storedColumns)) {
      let updatedColumns;

      if (storedColumns.length === 0) {
        updatedColumns = Object.keys(visibleColumns).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
      } else {
        updatedColumns = Object.keys(visibleColumns).reduce((acc, key) => {
          acc[key] = storedColumns.includes(key);
          return acc;
        }, {});
      }

      setVisibleColumns(updatedColumns);
    }
  }, [storedColumns]);

  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Check if a lead is assigned (has lead_assigned_employee)
  const isLeadAssigned = (lead) => {
    return lead?.lead_assigned_employee && lead.lead_assigned_employee !== "----";
  };

  // Function to handle individual checkbox selection
  const handleSingleCheckboxChange = (leadId, isChecked, isAssigned) => {
    // Prevent selection if lead is assigned
    if (isAssigned) {
      return;
    }

    if (isChecked) {
      // Add lead ID to selectedLeadIds if not already present
      setSelectedLeadIds(prev => [...prev, leadId]);
    } else {
      // Remove lead ID from selectedLeadIds
      setSelectedLeadIds(prev => prev.filter(id => id !== leadId));
    }
  };

  // Function to handle select all checkbox
  const handleSelectAllChange = (isChecked) => {
    if (isChecked) {
      // Select only unassigned lead IDs from current page
      const unassignedLeadIds = leadsData
        .filter(lead => !isLeadAssigned(lead))
        .map(lead => lead.id);
      setSelectedLeadIds(unassignedLeadIds);
    } else {
      // Deselect all
      setSelectedLeadIds([]);
    }
  };

  // Get unassigned leads from current page
  const unassignedLeads = leadsData.filter(lead => !isLeadAssigned(lead));

  // Check if all unassigned leads on current page are selected
  const isAllUnassignedSelected = unassignedLeads.length > 0 &&
    unassignedLeads.every(lead => selectedLeadIds.includes(lead.id));

  // Check if some unassigned leads are selected (for indeterminate state)
  const isSomeUnassignedSelected = unassignedLeads.some(lead => selectedLeadIds.includes(lead.id)) &&
    !isAllUnassignedSelected;

  // Check if any leads are assigned on current page
  const hasAssignedLeads = leadsData.some(lead => isLeadAssigned(lead));

  const [assigneLeaModal, setAssigneLeaModal] = useState(false);
  const openAssigneLeaModal = () => {
    if (selectedLeadIds.length <= 0) {
      toast.error("Please select at least one lead before assigning.")
      return false;
    }
    setAssigneLeaModal(true);
  };

  const closeAssigneLeaModal = () => {
    setAssigneLeaModal(false);
  };

  const isFilterApplied =
    searchQuery !== '' ||
    limit !== '10' ||
    dateRange.startDate !== '' ||
    dateRange.endDate !== '' ||
    leadType !== 'all' ||
    selectedLeadStage !== null ||
    subordinateId !== null;

  const clearFilters = () => {
    setSearchQuery("");
    setLimit("10");
    setDateRange({ startDate: '', endDate: '' });
    setLeadType('all');
    setSelectedLeadStage(null);
    setSubordinateId(null);
    setPage(1);
    setIsLoading(true);
    getLeadsData(1, limit, searchQuery, sortbyType, sortby, selectedLeadStage, leadType, null);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[22px] font-semibold">Leads</p>
          <div className="flex flex-col lg:flex-row justify-end items-center gap-2">
            <div className="flex gap-2">
              {permissions?.leads_page?.includes("add_lead") && (
                <Link to={"/lead/add-lead"} className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-black flex items-center gap-1">
                  + Add Lead
                </Link>
              )}
              {permissions?.leads_page?.includes("assign_bulk_leads_to_employee") && (
                <Button onClick={openAssigneLeaModal} size="sm" className="px-4 py-2 border border-[#B4295E] !rounded-sm !bg-[#B4295E] hover:!bg-[#B4295E]/90 hover:border-[#B4295E]">
                  Assign leads to employee
                </Button>
              )}
              {permissions?.leads_page?.includes("download_lead_template") && (
                <button onClick={openDownloadTemplate} className="cursor-pointer text-[14px] text-white px-4 !py-[7px] !rounded !bg-[#0083bf]">
                  Download Lead Template
                </button>
              )}
              {permissions?.leads_page?.includes("upload_bulk_leads") && (
                <button onClick={openUploadLeadExcel} className="cursor-pointer text-[14px] text-white px-4 !py-[7px] !rounded bg-emerald-500">
                  Upload Bulk Leads
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <div className="border border-[#ebecef] rounded-md relative">
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="focus:outline-none text-[14px] pl-6 py-1.5"
                  onChange={updateSearchQuery}
                  value={searchQuery}
                />
                <div className="absolute left-0 top-2 px-1">
                  <IconSearch size={16} color="#ebecef" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isFilterApplied && (
                <div onClick={clearFilters} className={`flex items-center gap-2 cursor-pointer px-2 !py-[7px] !rounded-sm !border !border-[#ebecef] ${isFilterApplied ? '!bg-red-400 !text-white hover:!bg-red-500' : '!bg-white hover:!bg-gray-50'} !font-normal !text-[14px] !text-[#6b7178]`}>
                  <Funnel className="!w-4 !h-4" /> <p>Clear Filters</p>
                </div>
              )}
              {
                allSubordinates.length > 0 &&
                <div className="w-[180px]">
                  <Select
                    data={allSubordinates}
                    placeholder="Select subordinate..."
                    value={subordinateId}
                    searchable
                    onChange={updateSubordinateId}
                    selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-[7px] !bg-white !rounded-sm !shadow-none !border !border-[#ebecef]"
                    className="!m-0 !p-0 !border-0"
                    dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                  />
                </div>
              }
              <div className="w-[180px]">
                <Select
                  data={[
                    { value: "all", label: "All" },
                    { value: "assigned", label: "Assigned" },
                    { value: "unassigned", label: "Unassigned" }
                  ]}
                  placeholder="select lead types..."
                  value={leadType}
                  onChange={updateLeadType}
                  selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-[7px] !bg-white !rounded-sm !shadow-none !border !border-[#ebecef]"
                  className="!m-0 !p-0 !border-0"
                  dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                />
              </div>
              <div className="w-[180px]">
                <Select
                  data={leadStages}
                  value={selectedLeadStage}
                  isLoading={isLoading}
                  onChange={handleLeadStageChange}
                  placeholder="Select Lead Stages..."
                  searchable
                  selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-[6px] !bg-white !rounded-sm !shadow-none !border !border-[#ebecef]"
                  className="!m-0 !p-0 !border-0"
                  dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                />
              </div>
              <div className="w-[50px]">
                <Select
                  data={[
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                    { value: "30", label: "30" },
                    { value: "40", label: "40" },
                    { value: "50", label: "50" },
                  ]}
                  placeholder="10"
                  value={limit}
                  onChange={updateLimit}
                  selectWrapperClass="focus:ring-0 !focus:border-[#fff] focus:outline-none !py-[7px] !bg-white !rounded-sm !shadow-none !border !border-[#ebecef]"
                  className="!m-0 !p-0 !border-0"
                  dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                />
              </div>
              <Datefilter
                onFilterChange={handleDateFilterChange}
                onClearFilter={handleDateFilterChange}
              />
              <div ref={containerRef} className="relative">
                <button
                  onClick={() => setShowColumnToggle(!showColumnToggle)}
                  className="cursor-pointer flex items-center gap-1 px-2 py-2 text-sm border border-[#ebecef] rounded-sm bg-white hover:bg-gray-50"
                >
                  ⚙️ Columns
                </button>

                {showColumnToggle && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#ebecef] rounded-md shadow z-50">
                    <div className="p-2">
                      {Object.keys(visibleColumns).map((colKey) => (
                        <label
                          key={colKey}
                          className="flex items-center gap-2 py-1 text-sm cursor-pointer capitalize"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns[colKey]}
                            onChange={() => toggleColumn(colKey)}
                          />
                          {colKey}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full relative overflow-x-auto border border-[#ebecef] rounded-md z-0">
            <table className="w-full table-fixed text-left border-collapse">
              <thead className="border-b-[0.6px] border-b-[#ebecef] bg-white">
                <tr className="w-full">
                  <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[50px] sticky left-0 z-20 bg-white border-r border-[#ebecef]">
                    <input
                      type="checkbox"
                      checked={isAllUnassignedSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = isSomeUnassignedSelected;
                        }
                      }}
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                      disabled={unassignedLeads.length === 0}
                    />
                  </th>
                  {visibleColumns.reference && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[140px] sticky left-[40px] z-20 bg-white border-r border-[#ebecef]">
                      Ref ID
                    </th>
                  )}
                  {visibleColumns.name && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[140px]">
                      Name
                    </th>
                  )}
                  {visibleColumns.email && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[200px]">
                      Email
                    </th>
                  )}
                  {visibleColumns.phone && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[140px]">
                      Phone
                    </th>
                  )}
                  {/* {visibleColumns.fatherName && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[140px]">
                      Father Name
                    </th>
                  )}
                  {visibleColumns.adhar && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[140px]">
                      Aadhar
                    </th>
                  )}
                  {visibleColumns.pan && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[140px]">
                      PAN
                    </th>
                  )}
                  {visibleColumns.citizenship && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[160px]">
                      Citizenship
                    </th>
                  )}
                  {visibleColumns.residence && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[160px]">
                      Residence
                    </th>
                  )}
                  {visibleColumns.motherTongue && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[160px]">
                      Mother Tongue
                    </th>
                  )}
                  {visibleColumns.maritalStatus && (
                    <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[160px]">
                      Martial Status
                    </th>
                  )} */}
                  {visibleColumns.leadStage && (
                    <th className="sticky right-[240px] z-10 w-[120px] bg-white border-l border-[#ebecef] px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px]">
                      Lead Stage
                    </th>
                  )}
                  {visibleColumns.assignedto && (
                    <th className="sticky right-[240px] z-10 w-[120px] bg-white border-l border-[#ebecef] px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px]">
                      Assigned To
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className="sticky right-[120px] z-10 w-[120px] bg-white border-l border-[#ebecef] px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px]">
                      Status
                    </th>
                  )}
                  {/* LAST (STICKY RIGHT) */}
                  <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[120px] sticky right-0 z-20 bg-white border-l border-[#ebecef]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading === false ? (
                  leadsData?.length > 0 ? (
                    leadsData?.map((ele, index) => (
                      <tr
                        key={index}
                        className="border-b-[0.6px] border-b-[#ebecef] align-top bg-white"
                      >
                        <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[50px] sticky left-0 z-20 bg-white border-r border-[#ebecef]">
                          {
                            ele?.lead_assigned_employee ?
                              <input
                                type="checkbox"
                                checked={true}
                                disabled={ele?.lead_assigned_employee}
                              />
                              :
                              <input
                                type="checkbox"
                                checked={selectedLeadIds.includes(ele.id)}
                                disabled={ele?.lead_assigned_employee}
                                onChange={(e) => handleSingleCheckboxChange(ele.id, e.target.checked, ele?.lead_assigned_employee)}
                              />
                          }
                        </th>
                        {visibleColumns.reference && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[140px] sticky left-[40px] z-10 bg-white border-r border-[#ebecef]">
                            {permissions?.leads_page?.includes("view_lead") ? (
                              <NavLink to={`/lead/${ele?.lead_uid}`}>
                                <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                                  {ele?.lead_uid}
                                </p>
                              </NavLink>
                            ) : (
                              <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                                {ele?.lead_uid}
                              </p>
                            )}
                          </td>

                        )}
                        {visibleColumns.name && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.full_name}
                            </p>
                          </td>
                        )}
                        {visibleColumns.email && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[200px]">
                            <NavLink to={`mailto:${ele.email}`}>
                              <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                                {ele?.email || "----"}
                              </p>
                            </NavLink>
                          </td>
                        )}
                        {visibleColumns.phone && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                            <NavLink
                              to={`https://wa.me/${ele.phone_code}${ele.phone_number}?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                                {ele?.phone_code && ele?.phone_number
                                  ? `+${ele?.phone_code} ${ele?.phone_number}`
                                  : "----"}
                              </p>
                            </NavLink>
                          </td>
                        )}
                        {/* {visibleColumns.fatherName && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.father_name || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.adhar && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.aadhar_card_no || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.pan && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.pan_card_no || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.citizenship && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.country_of_citizenship || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.residence && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.country_of_residence || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.motherTongue && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.mother_tongue || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.maritalStatus && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.marital_status || "----"}
                            </p>
                          </td>
                        )} */}
                        {visibleColumns.leadStage && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px] sticky right-[240px] z-10 bg-white border-l border-[#ebecef]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.lead_stage_name || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.assignedto && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px] sticky right-[240px] z-10 bg-white border-l border-[#ebecef]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {ele?.lead_assigned_employee || "----"}
                            </p>
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px] sticky right-[120px] z-10 bg-white border-l border-[#ebecef]">
                            {ele?.status === "Inactive" ? (
                              <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fdecec] w-fit">
                                <svg
                                  width={9}
                                  height={8}
                                  viewBox="0 0 9 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                  preserveAspectRatio="xMidYMid meet"
                                >
                                  <circle
                                    cx="4.42871"
                                    cy={4}
                                    r={3}
                                    fill="#EC0606"
                                  />
                                </svg>
                                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#ec0606]">
                                  Inactive
                                </p>
                              </div>
                            ) : ele?.status === "Active" ? (
                              <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#ecfdf3] w-fit">
                                <svg
                                  width={9}
                                  height={8}
                                  viewBox="0 0 9 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                  preserveAspectRatio="xMidYMid meet"
                                >
                                  <circle
                                    cx="4.42871"
                                    cy={4}
                                    r={3}
                                    fill="#14BA6D"
                                  />
                                </svg>
                                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#037847]">
                                  Active
                                </p>
                              </div>
                            ) : (
                              ele?.status === "Suspended" && (
                                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#D6D6D6] w-fit">
                                  <svg
                                    width={9}
                                    height={8}
                                    viewBox="0 0 9 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <circle
                                      cx="4.42871"
                                      cy={4}
                                      r={3}
                                      fill="#434343"
                                    />
                                  </svg>
                                  <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#434343]">
                                    Suspended
                                  </p>
                                </div>
                              )
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3 flex items-start whitespace-normal break-words w-[120px] sticky right-0 z-10 bg-white border-l border-[#ebecef]">
                          <div className="flex flex-row gap-1">
                            {permissions?.leads_page?.includes("view_lead") && (
                              <Link
                                to={`/lead/${ele?.lead_uid}`}
                                className="cursor-pointer transition-colors duration-200"
                              >
                                <IconEye size={20} color="#4b5563" />
                              </Link>
                            )}
                            {permissions?.leads_page?.includes("edit_lead") && (
                              <Link
                                to={`/lead/edit-lead/${ele?.lead_uid}`}
                                className="cursor-pointer transition-colors duration-200"
                              >
                                <IconEdit size={20} color="#4b5563" />
                              </Link>
                            )}
                            {permissions?.leads_page?.includes("delete_lead") && (
                              <div
                                onClick={() => openDeleteModal(ele?.id)}
                                className="cursor-pointer"
                              >
                                <IconTrash
                                  color="red"
                                  size={20}
                                  strokeWidth={1.5}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-gray-400 text-[15px] font-medium"  >
                        No data found
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={
                        Object.keys(visibleColumns).filter(
                          (key) => visibleColumns[key]
                        ).length
                      }
                      className="text-center py-6 text-gray-400 text-[15px] font-medium"
                    >
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {leadsData?.length > 0 && (
            <div className="flex flex-row-reverse">
              <Pagination
                totalpages={totalPages}
                value={page}
                siblings={1}
                onChange={handlePageChange}
                color="#0083bf"
              />
            </div>
          )}

          {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </div>
      </div>

      <DeleteModal
        title="Delete Lead"
        message={`Are you sure you want to delete this lead?`}
        open={deleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => {
          Leadapi.post("delete-lead", {
            leadId: singleLeadId,
            employeeId: employeeId,
          })
            .then((response) => {
              let data = response.data;
              if (data.status === "error") {
                let finalresponse = {
                  message: data.message,
                  server_res: data,
                };
                setErrorMessage(finalresponse);
                return false;
              }
              closeDeleteModal();
              refreshLeadsData();
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
              return false;
            });
        }}
      />

      <Modal
        open={assigneLeaModal}
        onClose={closeAssigneLeaModal}
        size="md"
        zIndex={9999}
        withCloseButton={false}
      >
        {assigneLeaModal === true && (
          <MultipleleadassignModal
            closeAssigneLeaModal={closeAssigneLeaModal}
            selectedLeadIds={selectedLeadIds}
            refreshLeadsData={refreshLeadsData}
            setSelectedLeadIds={setSelectedLeadIds}
          />
        )}
      </Modal>

      {/* <Modal
        open={projectModel}
        onClose={closeProjectModel}
        size="lg"
        zIndex={9999}
        withCloseButton={false}
      >
        {projectModel === true && (
          <AssignProject closeProjectModel={closeProjectModel} />
        )}
      </Modal>

      <Modal
        open={downloadTemplate}
        close={closeDownloadTemplate}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {downloadTemplate && (
          <Excelcustomertemplate
            closeDownloadTemplate={closeDownloadTemplate}
          />
        )}
      </Modal>

      <Modal
        open={deleteModal}
        onClose={closeDeleteModal}
        size="md"
        zIndex={9999}
        withCloseButton={false}
      >
        {deleteModal === true && (
          <Deletecustomer refreshLeadsData={refreshLeadsData} closeDeleteModal={closeDeleteModal} singleLeadId={singleLeadId} employeeId={employeeId} />
        )}
      </Modal>
       */}

      <Modal
        open={downloadTemplate}
        close={closeDownloadTemplate}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {downloadTemplate && (
          <Excelleadstemplate
            closeDownloadTemplate={closeDownloadTemplate}
          />
        )}
      </Modal>

      <Modal
        open={uploadLeadExcel}
        close={closeUploadLeadExcel}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
      >
        {uploadLeadExcel && (
          <Uploadleadsexcel
            closeUploadLeadExcel={closeUploadLeadExcel}
            refreshLeadsData={refreshLeadsData}
            setErrorMessage={setErrorMessage}
          />
        )}
      </Modal>
    </>
  );
}

export default Leadwrapper;
