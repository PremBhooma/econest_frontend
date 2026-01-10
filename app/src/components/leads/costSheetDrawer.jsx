import React, { useEffect, useState } from 'react';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Flatapi from "../api/Flatapi";
import Settingsapi from "../api/Settingsapi";
import Customerapi from "../api/Customerapi";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { toast } from "react-toastify";
import Errorpanel from "../shared/Errorpanel";
import { Datepicker } from '@nayeshdaggula/tailify';
import { useReactToPrint } from "react-to-print";
import { CostSheetPrint } from "./CostSheetPrint";

const CostSheetDrawer = ({ open, onOpenChange, leadData, refreshLeadDetails }) => {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    // Reset Form when Drawer Closes
    useEffect(() => {
        if (!open) {
            setErrorMessage("");
            setSelectedFlat(null);
            setSearchedFlat("");
            setFlat([]);
            setSaleableAreaSqFt("");
            setRatePerSqFt("");
            setDiscount("");
            setTotalDiscount(0);
            setTotalBaseCost(0);
            setBaseCostUnit("");
            setApplicationDate(""); // Or keep default if needed
            setFloorRise('25');
            setFloorRiseXPerSft("");
            setEastFacing('100');
            setEastFacingXPerSft("");
            setCorner('100');
            setCornerXPerSft("");
            setAmenities("");
            setStatus("");
            setDescription("");
            setTotalCostofUnit("");
            setGst("");
            setCostofUnitWithTax("");
            setRegistrationCharge("");
            setManjeeraConnectionCharge("50000");
            setMaintenceCharge("");
            setDocumentationFee("15000");
            setCorpusFund("");
            setGrandTotal("");

            // Clear Errors
            setSelectedFlatError("");
            setSaleableAreaSqFtError("");
            setRatePerSqFtError("");
            setBaseCostUnitError("");
            setApplicationDateError("");
            setFloorRiseError("");
            setFloorRiseXPerSftError("");
            setEastFacingError("");
            setEastFacingXPerSftError("");
            setCornerError("");
            setCornerXPerSftError("");
            setAmenitiesError("");
            setStatusError("");
            setDescriptionError("");
            setTotalCostofUnitError("");
            setGstError("");
            setCostofUnitWithTaxError("");
            setRegistrationChargeError("");
            setManjeeraConnectionChargeError("");
            setMaintenceChargeError("");
            setDocumentationFeeError("");
            setCorpusFundError("");
            setGrandTotalError("");
        }
    }, [open]);

    // Flat Search State
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [selectedFlatError, setSelectedFlatError] = useState('');
    const [searchedFlat, setSearchedFlat] = useState("");
    const [flat, setFlat] = useState([]);
    const [flatLoading, setFlatLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Cost States
    const [saleableAreaSqFt, setSaleableAreaSqFt] = useState("");
    const [saleableAreaSqFtError, setSaleableAreaSqFtError] = useState("");
    const [ratePerSqFt, setRatePerSqFt] = useState("");
    const [ratePerSqFtError, setRatePerSqFtError] = useState("");
    const [discount, setDiscount] = useState('');
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalBaseCost, setTotalBaseCost] = useState(0);
    const [baseCostUnit, setBaseCostUnit] = useState("");
    const [baseCostUnitError, setBaseCostUnitError] = useState("");

    // Application Date
    const [applicationDate, setApplicationDate] = useState("");
    const [applicationDateError, setApplicationDateError] = useState('');

    const updateApplicationDate = (value) => {
        setApplicationDate(value);
        setApplicationDateError("");
    };

    // Charges
    const [floorRise, setFloorRise] = useState('25');
    const [floorRiseError, setFloorRiseError] = useState('');
    const [floorRiseXPerSft, setFloorRiseXPerSft] = useState('');
    const [floorRiseXPerSftError, setFloorRiseXPerSftError] = useState('');

    const [eastFacing, setEastFacing] = useState('100');
    const [eastFacingError, setEastFacingError] = useState('');
    const [eastFacingXPerSft, setEastFacingXPerSft] = useState('');
    const [eastFacingXPerSftError, setEastFacingXPerSftError] = useState('');

    const [corner, setCorner] = useState('100');
    const [cornerError, setCornerError] = useState('');
    const [cornerXPerSft, setCornerXPerSft] = useState('');
    const [cornerXPerSftError, setCornerXPerSftError] = useState('');

    const [amenities, setAmenities] = useState("");
    const [amenitiesError, setAmenitiesError] = useState('');

    const [status, setStatus] = useState("");
    const [statusError, setStatusError] = useState('');

    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState('');

    const [totalCostofUnit, setTotalCostofUnit] = useState("");
    const [totalCostofUnitError, setTotalCostofUnitError] = useState('');

    const [gst, setGst] = useState("");
    const [gstError, setGstError] = useState('');

    const [costofUnitWithTax, setCostofUnitWithTax] = useState("");
    const [costofUnitWithTaxError, setCostofUnitWithTaxError] = useState('');

    const [registartionCharge, setRegistrationCharge] = useState("");
    const [registrationChargeError, setRegistrationChargeError] = useState('');

    const [manjeeraConnectionCharge, setManjeeraConnectionCharge] = useState("50000");
    const [manjeeraConnectionChargeError, setManjeeraConnectionChargeError] = useState('');

    const [maintenceCharge, setMaintenceCharge] = useState("");
    const [maintenceChargeError, setMaintenceChargeError] = useState('');

    const [documentationFee, setDocumentationFee] = useState("20000");
    const [documentationFeeError, setDocumentationFeeError] = useState('');

    const [corpusFund, setCorpusFund] = useState("");
    const [corpusFundError, setCorpusFundError] = useState('');

    const [grandTotal, setGrandTotal] = useState('');
    const [grandTotalError, setGrandTotalError] = useState('');

    // Update form when closed/opened
    useEffect(() => {
        if (!open) {
            // Reset logic could go here
        }
    }, [open]);

    // Flat Seach Logic
    const updateSearchedLocation = (e) => {
        const value = e.target.value;
        setSearchedFlat(value);

        if (debounceTimer) clearTimeout(debounceTimer);

        const timer = setTimeout(() => {
            if (value.trim().length > 0) {
                getFlatsData(value);
                setShowDropdown(true);
            } else {
                setFlat([]);
                setShowDropdown(false);
            }
        }, 500);

        setDebounceTimer(timer);
    };

    const handleSelectFlat = (flat) => {
        console.log("FLAT____DETAILS:", flat)
        setSearchedFlat(flat?.label);
        setSelectedFlat(flat);
        setSaleableAreaSqFt(flat?.square_feet);
        setShowDropdown(false);
        setSelectedFlatError('');
    };

    const getFlatsData = async (flatQuery) => {
        try {
            setFlatLoading(true);
            const response = await Flatapi.get(`search-flats`, {
                params: {
                    flat_no: flatQuery,
                    employeeId: employeeId,
                },
            });
            const data = response?.data;
            if (data?.status === "error") {
                setFlat([]);
                return;
            }
            setFlat(data?.data || []);
        } catch (error) {
            console.log(error);
            setFlat([]);
        } finally {
            setFlatLoading(false);
        }
    };

    async function getAmenitiesData(flatType) {
        try {
            setIsLoadingEffect(true);
            const response = await Settingsapi.get(`get-list-amenities`, {
                params: { flatType: flatType }
            });
            const data = response?.data;
            if (data?.status === "error") {
                setAmenities("");
                return;
            }
            setAmenities(data?.amenities || "");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingEffect(false);
        }
    }


    useEffect(() => {
        if (selectedFlat) {
            getAmenitiesData(selectedFlat?.type);
        }
        if (!searchedFlat) {
            setSelectedFlat(null);
            setAmenities('');
            setSaleableAreaSqFt('');
        }
        if (selectedFlat?.floor_no) {
            if (selectedFlat?.floor_no >= 6) {
                const floorsToCharge = selectedFlat.floor_no - 6 + 1;
                setFloorRise(floorsToCharge * 25);
            } else {
                setFloorRise(0);
            }
        }
    }, [searchedFlat, selectedFlat]);

    // Calculation Logic
    useEffect(() => {
        const parseNum = (val) => (val ? parseFloat(val) : 0);

        const area = parseNum(saleableAreaSqFt);
        const rate = parseNum(ratePerSqFt);
        const disc = parseNum(discount);
        const amenity = parseNum(amenities);
        const flRise = parseNum(floorRise);
        const east = parseNum(eastFacing);
        const crnr = parseNum(corner);

        if (rate === '') {
            setDiscount('')
            setBaseCostUnit('')
        }

        // Base cost before discount
        const baseCost = area * rate;

        // Discount (reset to 0 if empty)
        const totalDiscountPrice = area && disc ? area * disc : 0;
        setTotalDiscount(totalDiscountPrice);

        // Final base cost after discount
        const finalBaseCost = baseCost - totalDiscountPrice;
        setTotalBaseCost(baseCost);
        setBaseCostUnit(finalBaseCost);

        // Floor Rise
        let floorRiseCost = 0;
        if (selectedFlat?.floor_no >= 6 && area && flRise) {
            floorRiseCost = flRise * area;
            setFloorRiseXPerSft(floorRiseCost);
        } else {
            setFloorRiseXPerSft("");
        }

        // East Facing
        let eastFacingCost = 0;
        if (selectedFlat?.facing === "East" && area && east) {
            eastFacingCost = east * area;
            setEastFacingXPerSft(eastFacingCost);
        } else {
            setEastFacingXPerSft("");
        }

        // Corner
        let cornerCost = 0;
        if (selectedFlat?.corner && area && crnr) {
            cornerCost = crnr * area;
            setCornerXPerSft(cornerCost);
        } else {
            setCornerXPerSft("");
        }

        // Total Cost of Unit (includes discount now!)
        if (area && rate) {
            const totalCost =
                finalBaseCost + floorRiseCost + eastFacingCost + cornerCost + amenity;

            setTotalCostofUnit(totalCost);
        } else {
            setTotalCostofUnit("");
        }
    }, [discount, selectedFlat, saleableAreaSqFt, ratePerSqFt, floorRise, eastFacing, corner, amenities]);


    // 2️⃣ Recalculate dependent states whenever totalCostofUnit changes
    useEffect(() => {
        if (totalCostofUnit) {
            const gstValue = (totalCostofUnit * 0.05).toFixed(2);
            setGst(gstValue);

            setCostofUnitWithTax(parseFloat(totalCostofUnit) + parseFloat(gstValue));

            // let registerCharge = ((parseFloat(totalCostofUnit) * 0.076) + 1050).toFixed(2);
            // setRegistrationCharge(parseFloat(registerCharge));

            if (saleableAreaSqFt) {
                let maintainCharge = ((parseFloat(saleableAreaSqFt) * 3) * 24).toFixed(2);
                setMaintenceCharge(parseFloat(maintainCharge));
                let corpusFund = (parseFloat(saleableAreaSqFt) * 50).toFixed(2);
                setCorpusFund(parseFloat(corpusFund));

                setGrandTotal(parseFloat(totalCostofUnit) + parseFloat(gstValue) + parseFloat(manjeeraConnectionCharge) + parseFloat(maintainCharge) + parseFloat(corpusFund) + parseFloat(documentationFee))
            }
        } else {
            setGst("");
            setCostofUnitWithTax("");
            // setRegistrationCharge("");
            setMaintenceCharge("");
            setCorpusFund("");
            setGrandTotal("");
        }
    }, [totalCostofUnit, saleableAreaSqFt, documentationFee]);


    const componentRef = React.useRef();
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
    });

    const handleGenerate = () => {
        setErrorMessage("");

        if (!selectedFlat) {
            setSelectedFlatError("Please select a flat");
            return;
        }
        if (!leadData) {
            toast.error("Lead data missing");
            return;
        }
        if (!applicationDate) {
            setApplicationDateError('Select application date');
            return;
        }
        if (!saleableAreaSqFt) {
            setSaleableAreaSqFtError("Saleable Area is required");
            return;
        }
        if (!ratePerSqFt) {
            setRatePerSqFtError("Rate Per sq.ft is required");
            return;
        }
        if (!grandTotal) {
            setGrandTotalError('Grand total calculation failed');
            return;
        }

        handlePrint();
    };

    // Prepare data object for print
    const printData = {
        saleableAreaSqFt,
        ratePerSqFt,
        discount,
        floorRise,
        floorRiseXPerSft,
        eastFacing,
        eastFacingXPerSft,
        corner,
        cornerXPerSft,
        amenities,
        baseCostUnit,
        totalCostofUnit,
        gst,
        costofUnitWithTax,
        manjeeraConnectionCharge,
        maintenceCharge,
        documentationFee,
        corpusFund,
        grandTotal,
        status,
        description
    };

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => onOpenChange(false)}
            />

            {/* Hidden Print Component */}
            <div style={{ display: "none" }}>
                <CostSheetPrint
                    ref={componentRef}
                    data={printData}
                    leadData={leadData}
                    selectedFlat={selectedFlat}
                />
            </div>

            {/* Drawer Panel */}
            <div
                className={`absolute top-0 right-0 h-full w-[80%] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="h-full flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Cost Sheet</h2>
                            <p className="text-sm text-gray-500">
                                Generate cost sheet for {leadData?.full_name}
                            </p>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors group"
                        >
                            <IconX size={24} className="text-gray-500 group-hover:text-gray-700" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pt-0 scrollbar-hide">

                        {/* Customer Details Section */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-300 mb-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Lead Name</p>
                                    <p className="font-medium text-sm">{leadData?.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <p className="font-medium text-sm">{leadData?.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                    <p className="font-medium text-sm">{leadData?.phone_code && leadData?.phone_number ? `+${leadData.phone_code} ${leadData.phone_number}` : '-'} </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Assigned Employee</p>
                                    <p className="font-medium text-sm">{leadData?.assigned_to || 'No Assigned'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6">
                            {/* Loading Overlay */}
                            {isLoadingEffect && (
                                <div className="absolute inset-0 z-50 bg-white/50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}

                            {/* Flat Selection */}
                            <div className="mb-6 relative">
                                <Label>Select Flat *</Label>
                                <Input
                                    value={searchedFlat}
                                    onChange={updateSearchedLocation}
                                    placeholder="Enter Flat No"
                                    className="mt-1 bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                />
                                {showDropdown && flat.length > 0 && (
                                    <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                                        {flat.map((item) => (
                                            <li
                                                key={item.value}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                onClick={() => handleSelectFlat(item)}
                                            >
                                                {item.label}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {selectedFlatError && <p className="text-red-500 text-xs mt-1">{selectedFlatError}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">

                                    <Datepicker
                                        label="Application Date"
                                        value={applicationDate}
                                        onChange={updateApplicationDate}
                                        error={applicationDateError}
                                        labelClassName="text-sm font-medium text-gray-600 !mb-1 -mt-1"
                                        inputClassName="!h-10 border border-gray-300 !rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:!border-black"
                                    />

                                    <div>
                                        <Label>Saleable Area (sq.ft) *</Label>
                                        <Input
                                            type="number"
                                            value={saleableAreaSqFt}
                                            onChange={(e) => {
                                                setSaleableAreaSqFt(e.target.value);
                                                setSaleableAreaSqFtError('');
                                            }}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                        {saleableAreaSqFtError && <p className="text-red-500 text-xs mt-1">{saleableAreaSqFtError}</p>}
                                    </div>

                                    <div>
                                        <Label>Rate Per sq.ft *</Label>
                                        <Input
                                            type="number"
                                            value={ratePerSqFt}
                                            onChange={(e) => {
                                                setRatePerSqFt(e.target.value);
                                                setRatePerSqFtError('');
                                            }}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                        {ratePerSqFtError && <p className="text-red-500 text-xs mt-1">{ratePerSqFtError}</p>}
                                    </div>

                                    <div>
                                        <Label>Discount Per sq.ft</Label>
                                        <Input
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Base Cost</Label>
                                        <Input
                                            value={baseCostUnit}
                                            readOnly
                                            className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    {selectedFlat?.floor_no >= 6 && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label>Floor Rise (Per sq.ft)</Label>
                                                <Input
                                                    value={floorRise}
                                                    onChange={(e) => setFloorRise(e.target.value)}
                                                    className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                                />
                                            </div>
                                            <div>
                                                <Label>Total Floor Rise</Label>
                                                <Input value={floorRiseXPerSft} readOnly className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black" />
                                            </div>
                                        </div>
                                    )}

                                    {selectedFlat?.facing === "East" && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label>East Facing (Per sq.ft)</Label>
                                                <Input
                                                    value={eastFacing}
                                                    onChange={(e) => setEastFacing(e.target.value)}
                                                    className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                                />
                                            </div>
                                            <div>
                                                <Label>Total East Facing</Label>
                                                <Input value={eastFacingXPerSft} readOnly className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black" />
                                            </div>
                                        </div>
                                    )}

                                    {selectedFlat?.corner && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label>Corner (Per sq.ft)</Label>
                                                <Input
                                                    value={corner}
                                                    onChange={(e) => setCorner(e.target.value)}
                                                    className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                                />
                                            </div>
                                            <div>
                                                <Label>Total Corner</Label>
                                                <Input value={cornerXPerSft} readOnly className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black" />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label>Amenities</Label>
                                        <Input
                                            value={amenities}
                                            onChange={(e) => setAmenities(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                        {amenitiesError && <p className="text-red-500 text-xs mt-1">{amenitiesError}</p>}
                                    </div>

                                    <div>
                                        <Label>Status</Label>
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-black">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-black">
                                                <SelectItem value="Under Construction">Under Construction</SelectItem>
                                                <SelectItem value="Constructed">Constructed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {statusError && <p className="text-red-500 text-xs mt-1">{statusError}</p>}
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                        {descriptionError && <p className="text-red-500 text-xs mt-1">{descriptionError}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label>Total Cost of Unit</Label>
                                        <Input
                                            value={totalCostofUnit}
                                            readOnly
                                            className="bg-gray-50 font-bold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>GST (5%)</Label>
                                        <Input
                                            value={gst}
                                            readOnly
                                            className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Cost of Unit with Tax</Label>
                                        <Input
                                            value={costofUnitWithTax}
                                            readOnly
                                            className="bg-gray-50 font-semibold border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    {/* <div>
                                    <Label>Registration Charges</Label>
                                    <Input
                                        value={registartionCharge}
                                        onChange={(e) => setRegistrationCharge(e.target.value)}
                                        className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                    />
                                </div> */}

                                    <div>
                                        <Label>Manjeera Connection Charges</Label>
                                        <Input
                                            value={manjeeraConnectionCharge}
                                            onChange={(e) => setManjeeraConnectionCharge(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Maintenance Charges</Label>
                                        <Input
                                            value={maintenceCharge}
                                            onChange={(e) => setMaintenceCharge(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Documentation Fee</Label>
                                        <Input
                                            value={documentationFee}
                                            onChange={(e) => setDocumentationFee(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <Label>Corpus Fund</Label>
                                        <Input
                                            value={corpusFund}
                                            onChange={(e) => setCorpusFund(e.target.value)}
                                            className="bg-white border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Label className="text-lg text-primary">Grand Total</Label>
                                        <Input
                                            value={grandTotal}
                                            onChange={(e) => setGrandTotal(e.target.value)}
                                            className="text-lg font-bold bg-green-50 border-green-200 text-green-700 h-14 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-white p-4 items-center border-t border-gray-300">
                            <div className="flex-1">
                                {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
                            </div>
                            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
                            <Button onClick={handleGenerate} className="bg-[#931f42] hover:bg-[#a6234b] cursor-pointer">Generate Cost Sheet</Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostSheetDrawer;
