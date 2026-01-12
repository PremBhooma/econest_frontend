import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import Flatapi from "../../api/Flatapi";
import Customerapi from "../../api/Customerapi";
import Errorpanel from "../../shared/Errorpanel";
import noImageStaticImage from "../../../../public/assets/no_image.png"
import { toast } from "react-toastify";
import { Datepicker, Loadingoverlay, Textinput } from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import Updateactivities from "./Updateactivities";

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Flatcostupdate({ closeFlatCostUpdate, flatNo, refreshUserDetails, customerFlatDetails, flatDetails }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;


    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerError, setSelectedCustomerError] = useState('');
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [selectedFlatError, setSelectedFlatError] = useState('');

    const [saleableAreaSqFt, setSaleableAreaSqFt] = useState("");
    const [saleableAreaSqFtError, setSaleableAreaSqFtError] = useState("");

    const [ratePerSqFt, setRatePerSqFt] = useState("");
    const [ratePerSqFtError, setRatePerSqFtError] = useState("");

    const [discount, setDiscount] = useState('');
    const [discountError, setDiscountError] = useState("");

    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalBaseCost, setTotalBaseCost] = useState(0);

    const [baseCostUnit, setBaseCostUnit] = useState("");
    const [baseCostUnitError, setBaseCostUnitError] = useState("");
    const updateBaseCostUnit = (e) => {
        setBaseCostUnit(e.target.value);
        setBaseCostUnitError("");
    };

    const [applicationDate, setApplicationDate] = useState('')
    const [applicationDateError, setApplicationDateError] = useState('')
    const updateApplicationDate = (value) => {
        setApplicationDate(value)
        setApplicationDateError('')
    }

    const [floorRise, setFloorRise] = useState('25')
    const [floorRiseError, setFloorRiseError] = useState('')
    // const updateFloorRise = (e) => {
    //     let value = e.target.value;
    //     if (isNaN(value)) {
    //         return false
    //     }
    //     setFloorRise(value)
    //     setFloorRiseError('')
    // }

    const [floorRiseXPerSft, setFloorRiseXPerSft] = useState('')
    const [floorRiseXPerSftError, setFloorRiseXPerSftError] = useState('')
    const updateFloorRiseXPerSft = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setFloorRiseXPerSft(value)
        setFloorRiseXPerSftError('')
    }

    const [eastFacing, setEastFacing] = useState('100')
    const [eastFacingError, setEastFacingError] = useState('')
    // const updateEastFacing = (e) => {
    //     let value = e.target.value;
    //     if (isNaN(value)) {
    //         return false
    //     }
    //     setEastFacing(value)
    //     setEastFacingError('')
    // }

    const [eastFacingXPerSft, setEastFacingXPerSft] = useState('')
    const [eastFacingXPerSftError, setEastFacingXPerSftError] = useState('')
    const updateEastFacingXPerSft = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setEastFacingXPerSft(value)
        setEastFacingXPerSftError('')
    }

    const [corner, setCorner] = useState('100')
    const [cornerError, setCornerError] = useState('')
    // const updateCorner = (e) => {
    //     let value = e.target.value;
    //     if (isNaN(value)) {
    //         return false
    //     }
    //     setCorner(value)
    //     setCornerError('')
    // }

    const [cornerXPerSft, setCornerXPerSft] = useState('')
    const [cornerXPerSftError, setCornerXPerSftError] = useState('')
    const updateCornerXPerSft = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setCornerXPerSft(value)
        setCornerXPerSftError('')
    }

    const [amenities, setAmenties] = useState('')
    const [amenitiesError, setAmentiesError] = useState('')

    const [totalCostofUnit, setTotalCostofUnit] = useState('')
    const [totalCostofUnitError, setTotalCostofUnitError] = useState('')

    const [gst, setGst] = useState('')
    const [gstError, setGstError] = useState('')
    const updateGst = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setGst(value)
        setGstError('')
    }

    const [costofUnitWithTax, setCostofUnitWithTax] = useState('')
    const [costofUnitWithTaxError, setCostofUnitWithTaxtError] = useState('')
    const updateCostofUnitWithTax = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setCostofUnitWithTax(value)
        setCostofUnitWithTaxtError('')
    }

    const [registartionCharge, setRegistrationCharge] = useState('')
    const [registrationChargeError, setRegistrationChargeError] = useState('')
    const updateRegistrationCharge = (e) => {
        let value = e.target.value
        if (isNaN(value)) {
            return false
        }
        setRegistrationCharge(value)
        setRegistrationChargeError('')
    }

    const [manjeeraConnectionCharge, setManjeeraConnectionCharge] = useState('50000')
    const [manjeeraConnectionChargeError, setManjeeraConnectionChargeError] = useState('')
    const updateManjeeraConnectionCharge = (e) => {
        let value = e.target.value
        if (isNaN(value)) {
            return false
        }
        setManjeeraConnectionCharge(value)
        setManjeeraConnectionChargeError('')
        // Pass preserveManualTotal=true to keep the manually entered total cost intact
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, value, true);
    }

    const [maintenceCharge, setMaintenceCharge] = useState('')
    const [maintenceChargeError, setMaintenceChargeError] = useState('')
    const updateMaintenceCharge = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setMaintenceCharge(value)
        setMaintenceChargeError('')
    }

    const [documentationFee, setDocumentationFee] = useState('20000')
    const [documenationFeeError, setDocumenationFeeError] = useState('')
    // const updateDocumenationFee = (e) => {
    //     let value = e.target.value;
    //     if (isNaN(value)) {
    //         return false
    //     }
    //     setDocumentationFee(value)
    //     setDocumenationFeeError('')
    // }

    const [corpusFund, setCorpusFund] = useState('')
    const [corpusFundError, setCorpusFundError] = useState('')
    const updateCorpusFund = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setCorpusFund(value)
        setCorpusFundError('')
    }

    const [grandTotal, setGrandTotal] = useState('')
    const [grandTotalError, setGrandTotalError] = useState('')
    const updateGrandTotal = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setGrandTotal(value)
        setGrandTotalError('')
    }



    // 1️⃣ Load API data ONLY - no calculations

    const calculateAllValues = (
        newSaleableArea,
        newRatePerSqFt,
        newAmenities,
        newTotalCost,
        newFloorRise,
        newEastFacing,
        newCorner,
        newDiscount,
        newDocumentationFee,
        newManjeeraConnectionCharge,
        preserveManualTotal = false
    ) => {
        let saleableArea = newSaleableArea !== undefined ? newSaleableArea : saleableAreaSqFt;
        let rate = newRatePerSqFt !== undefined ? newRatePerSqFt : ratePerSqFt;
        let amenitiesCost = newAmenities !== undefined ? newAmenities : amenities;
        let floorRiseVal = newFloorRise !== undefined ? newFloorRise : floorRise;
        let eastFacingVal = newEastFacing !== undefined ? newEastFacing : eastFacing;
        let cornerVal = newCorner !== undefined ? newCorner : corner;
        let discountVal = newDiscount !== undefined ? newDiscount : discount;
        let documentationFeeVal = newDocumentationFee !== undefined ? newDocumentationFee : documentationFee;
        let manjeeraConnectionChargeVal = newManjeeraConnectionCharge !== undefined ? newManjeeraConnectionCharge : manjeeraConnectionCharge;

        // FIXED: Use existing totalCostofUnit if newTotalCost is not provided
        let totalCost = newTotalCost !== undefined ? newTotalCost : totalCostofUnit;

        let parseNum = (val) => (val && !isNaN(val) ? parseFloat(val) : 0);

        let gstValue = 0;
        let registerCharge = 0;

        if (saleableArea && rate) {
            // Base cost
            const newBaseCost = parseNum(saleableArea) * parseNum(rate);
            setTotalBaseCost(newBaseCost);

            // Discount (per sq.ft * area)
            const totalDiscountPrice = parseNum(saleableArea) * parseNum(discountVal);
            setTotalDiscount(totalDiscountPrice);

            // Final base cost after discount
            const finalBaseCost = newBaseCost - totalDiscountPrice;
            setBaseCostUnit(finalBaseCost);

            // Floor Rise (per sq.ft * area)
            let floorRiseTotal = 0;
            if (floorRiseVal) {
                floorRiseTotal = parseNum(floorRiseVal) * parseNum(saleableArea);
                setFloorRiseXPerSft(floorRiseTotal);
            } else {
                setFloorRiseXPerSft("");
            }

            // East Facing (per sq.ft * area)
            let eastFacingTotal = 0;
            if (eastFacingVal) {
                eastFacingTotal = parseNum(eastFacingVal) * parseNum(saleableArea);
                setEastFacingXPerSft(eastFacingTotal);
            } else {
                setEastFacingXPerSft("");
            }

            // Corner (per sq.ft * area)
            let cornerTotal = 0;
            if (cornerVal) {
                cornerTotal = parseNum(cornerVal) * parseNum(saleableArea);
                setCornerXPerSft(cornerTotal);
            } else {
                setCornerXPerSft("");
            }

            // FIXED: Handle total cost calculation based on context
            if (newTotalCost !== undefined) {
                // Explicit total cost provided - use it
                totalCost = newTotalCost;
            } else if (preserveManualTotal && totalCostofUnit) {
                // Preserve manually entered total cost
                totalCost = totalCostofUnit;
            } else {
                // Calculate from base components
                if (amenitiesCost && amenitiesCost !== "") {
                    totalCost = finalBaseCost + floorRiseTotal + eastFacingTotal + cornerTotal + parseNum(amenitiesCost);
                } else {
                    totalCost = finalBaseCost + floorRiseTotal + eastFacingTotal + cornerTotal;
                }
            }

            // Set total cost
            setTotalCostofUnit(totalCost);

            // Calculate dependent values if we have a valid totalCost
            if (totalCost && totalCost !== "") {
                // GST 5%
                gstValue = (parseNum(totalCost) * 0.05).toFixed(2);
                setGst(gstValue);

                // Cost with GST
                setCostofUnitWithTax(parseNum(totalCost) + parseNum(gstValue));

                // Registration 7.6% + 1050
                // registerCharge = ((parseFloat(totalCost) * 0.076) + 1050).toFixed(2);
                // setRegistrationCharge(parseFloat(registerCharge));
            } else {
                setGst("");
                setCostofUnitWithTax("");
                setRegistrationCharge("");
            }

            // Maintenance & Corpus
            if (saleableArea) {
                let maintainCharge = ((parseFloat(saleableArea) * 3) * 24).toFixed(2);
                setMaintenceCharge(parseFloat(maintainCharge));
                let corpusFund = (parseFloat(saleableArea) * 50).toFixed(2);
                setCorpusFund(parseFloat(corpusFund));

                // FIXED: Calculate grand total with current values
                const currentGstValue = parseNum(gstValue);
                // const currentRegisterCharge = parseNum(registerCharge);
                const currentMaintainCharge = parseNum(maintainCharge);
                const currentCorpusFund = parseNum(corpusFund);
                const currentDocFee = parseNum(documentationFeeVal);
                const currentManjeeraConnectionCharge = parseNum(manjeeraConnectionChargeVal);

                setGrandTotal(parseNum(totalCost) + currentGstValue + currentManjeeraConnectionCharge + currentMaintainCharge + currentCorpusFund + currentDocFee);
            }
        } else {
            // Reset all if no base values
            setBaseCostUnit("");
            setAmenties("");
            setFloorRiseXPerSft("");
            setEastFacingXPerSft("");
            setCornerXPerSft("");
            setTotalCostofUnit("");
            setGst("");
            setCostofUnitWithTax("");
            setRegistrationCharge("");
            setMaintenceCharge("");
            setCorpusFund("");
            setDiscount("");
            setTotalDiscount(0);
            setTotalBaseCost(0);
            setGrandTotal("");
        }
    };

    const updateSaleableAreaSqFt = (e) => {
        const value = e.target.value;
        setSaleableAreaSqFt(value);
        setSaleableAreaSqFtError("");
        calculateAllValues(value, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    };

    const updateRatePerSqFt = (e) => {
        const value = e.target.value;
        setRatePerSqFt(value);
        setRatePerSqFtError("");
        calculateAllValues(undefined, value, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    };

    const updateAmenities = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setAmenties(value);
        setAmentiesError("");
        calculateAllValues(undefined, undefined, value, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    };

    const updateTotalCostofUnit = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setTotalCostofUnit(value);
        setTotalCostofUnitError("");
        calculateAllValues(undefined, undefined, undefined, value, undefined, undefined, undefined, undefined, undefined, undefined);
    };

    const updateFloorRise = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setFloorRise(value);
        setFloorRiseError("");
        calculateAllValues(undefined, undefined, undefined, undefined, value, undefined, undefined, undefined, undefined, undefined);
    };

    const updateEastFacing = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setEastFacing(value);
        setEastFacingError("");
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, value, undefined, undefined, undefined, undefined);
    };

    const updateCorner = (e) => {
        const value = e.target.value;
        if (isNaN(value)) return false;
        setCorner(value);
        setCornerError("");
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, undefined, value, undefined, undefined, undefined);
    };

    const updateDiscount = (e) => {
        const value = e.target.value;
        setDiscount(value);
        setDiscountError("");
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, undefined, undefined, value, undefined, undefined);
    };

    const updateDocumenationFee = (e) => {
        let value = e.target.value;
        setDocumentationFee(value);
        setDocumenationFeeError('');
        // Pass preserveManualTotal=true to keep the manually entered total cost intact
        calculateAllValues(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, value, undefined, true);
    };

    useEffect(() => {
        if (customerFlatDetails) {
            setSelectedCustomer(customerFlatDetails?.customer?.uuid || null);
            setSelectedFlat(customerFlatDetails?.flat_id || null);
            setApplicationDate(new Date(customerFlatDetails?.application_date) || '');
            setSaleableAreaSqFt(customerFlatDetails?.saleable_area_sq_ft || "");
            setRatePerSqFt(customerFlatDetails?.rate_per_sq_ft || '');
            setDiscount(customerFlatDetails?.discount || '');
            setBaseCostUnit(customerFlatDetails?.base_cost_unit || '');
            setAmenties(customerFlatDetails?.amenities || '');
            setTotalCostofUnit(customerFlatDetails?.toatlcostofuint || '');
            setGst(customerFlatDetails?.gst || '');
            setCostofUnitWithTax(customerFlatDetails?.costofunitwithtax || '');
            setRegistrationCharge(customerFlatDetails?.registrationcharge || '');
            setMaintenceCharge(customerFlatDetails?.maintenancecharge || '');
            setDocumentationFee(customerFlatDetails?.documentaionfee || '');
            setCorpusFund(customerFlatDetails?.corpusfund || '');
            setManjeeraConnectionCharge(customerFlatDetails?.manjeera_connection_charge || '50000');
            setFloorRise(flatDetails?.floor_no >= 5 ? customerFlatDetails?.floor_rise_per_sq_ft : '');
            setFloorRiseXPerSft(flatDetails?.floor_no >= 5 ? customerFlatDetails?.total_floor_rise : '');
            setEastFacing(flatDetails?.facing === "East" ? customerFlatDetails?.east_facing_per_sq_ft : '');
            setEastFacingXPerSft(flatDetails?.facing === "East" ? customerFlatDetails?.total_east_facing : '');
            setCorner(flatDetails?.corner === true ? customerFlatDetails?.corner_per_sq_ft : '');
            setCornerXPerSft(flatDetails?.corner === true ? customerFlatDetails?.total_corner : '');
            setGrandTotal(customerFlatDetails?.grand_total || '');
        }
    }, [customerFlatDetails, flatDetails]);


    const handleSubmit = async () => {
        setIsLoadingEffect(true);

        if (selectedFlat === null) {
            setSelectedFlatError("Please select the flat");
            setIsLoadingEffect(false);
            return false;
        }

        if (selectedCustomer === null) {
            setSelectedCustomerError("Please select the customer");
            setIsLoadingEffect(false);
            return false;
        }

        if (applicationDate === '') {
            setApplicationDateError('Select application date')
            setIsLoadingEffect(false)
            return false
        }

        if (saleableAreaSqFt === '') {
            setSaleableAreaSqFtError("Saleable Area (sq.ft.) is required");
            setIsLoadingEffect(false);
            return false;
        }

        if (ratePerSqFt === '') {
            setRatePerSqFtError("Rate Per (sq.ft.) is required");
            setIsLoadingEffect(false);
            return false;
        }

        if (baseCostUnit === '') {
            setBaseCostUnitError("Base Cost Unit is required");
            setIsLoadingEffect(false);
            return false;
        }
        if (amenities === "") {
            setAmentiesError("Enter amenities")
            setIsLoadingEffect(false)
            return false
        }
        if (totalCostofUnit === '') {
            setTotalCostofUnitError('Enter Total cost of unit')
            setIsLoadingEffect(false)
            return false
        }
        if (gst === '') {
            setGstError('Enter GST')
            setIsLoadingEffect(false)
            return false
        }
        if (costofUnitWithTax === "") {
            setCostofUnitWithTaxtError('Enter cost of unit with tax')
            setIsLoadingEffect(false)
            return false
        }
        if (registartionCharge === "") {
            setRegistrationChargeError('Enter Registartion Charge')
            setIsLoadingEffect(false)
            return false
        }
        if (maintenceCharge === "") {
            setMaintenceChargeError('Enter Maintence Charge')
            setIsLoadingEffect(false)
            return false
        }
        if (documentationFee === "") {
            setDocumenationFeeError('Enter documenation Fee')
            setIsLoadingEffect(false)
            return false
        }
        if (corpusFund === "") {
            setCorpusFundError('Enter corpus fund')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.floor_no >= 5 && floorRise === "") {
            setFloorRiseError('Enter floor rise charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.floor_no >= 5 && floorRiseXPerSft === "") {
            setFloorRiseXPerSftError('Total floor rise is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.facing === "East" && eastFacing === "") {
            setEastFacingError('Enter east facing charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.facing === "East" && eastFacingXPerSft === "") {
            setEastFacingXPerSftError('Total east facing is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.corner === true && corner === "") {
            setCornerError('Enter corner charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (flatDetails?.corner === true && cornerXPerSft === "") {
            setCornerXPerSftError('Total corner is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (grandTotal === "") {
            setGrandTotalError('Grand total is required')
            setIsLoadingEffect(false)
            return false
        }

        try {
            const formatDateOnly = (date) => {
                if (!date) return null;
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
            };

            const apiEndpoint = selectedCustomer && "update-customer-flat";

            const response = await Customerapi.post(apiEndpoint, {
                customerFlatId: customerFlatDetails?.id,
                customerUuid: selectedCustomer,
                flat_id: selectedFlat,
                applicationdate: formatDateOnly(applicationDate),
                saleable_area_sq_ft: Number(saleableAreaSqFt),
                rate_per_sq_ft: Number(ratePerSqFt),
                discount: discount ? parseFloat(discount) : null,
                base_cost_unit: Number(baseCostUnit),
                amenities: parseFloat(amenities),
                toatlcostofuint: parseFloat(totalCostofUnit),
                gst: parseFloat(gst),
                costofunitwithtax: parseFloat(costofUnitWithTax),
                // registrationcharge: parseFloat(registartionCharge) || 0,
                manjeeraConnectionCharge: parseFloat(manjeeraConnectionCharge),
                maintenancecharge: parseFloat(maintenceCharge),
                documentaionfee: parseFloat(documentationFee),
                corpusfund: parseFloat(corpusFund),
                floor_rise_per_sq_ft: flatDetails?.floor_no >= 5 ? parseFloat(floorRise) : null,
                total_floor_rise: parseFloat(floorRiseXPerSft),
                east_facing_per_sq_ft: flatDetails?.facing === "East" ? parseFloat(eastFacing) : null,
                total_east_facing: parseFloat(eastFacingXPerSft),
                corner_per_sq_ft: flatDetails?.corner === true ? parseFloat(corner) : null,
                total_corner: parseFloat(cornerXPerSft),
                grand_total: parseFloat(grandTotal),
                employeeId: employeeId
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response?.data;

            if (data?.status === "error") {
                setErrorMessage({
                    message: data?.message,
                    server_res: data,
                });
                setIsLoadingEffect(false);
                return false;
            }

            setIsLoadingEffect(false);
            toast.success("Flat values updated to customer successfully");
            refreshUserDetails()
            closeFlatCostUpdate()
            return true;
        } catch (error) {
            let finalresponse;
            if (error.response !== undefined) {
                finalresponse = {
                    message: error.message,
                    server_res: error.response.data,
                };
            } else {
                finalresponse = {
                    message: error?.message,
                    server_res: null,
                };
            }
            setErrorMessage(finalresponse);
            setIsLoadingEffect(false);
            return false;
        }
    };


    return (
        <div className="w-full">
            <div className="flex justify-between items-center px-4 py-2">
                <div className="font-semibold text-lg">Flat Cost Update</div>
                <div onClick={closeFlatCostUpdate} className="cursor-pointer py-1.5 px-3 rounded-sm bg-red-300 text-black font-semibold">Close</div>
            </div>

            <hr className="border border-[#ebecef]" />

            <div className="px-4 py-2 flex flex-col gap-2">
                <div className="border border-[#ced4da] p-3 rounded-md">
                    <div className="grid grid-cols-3 gap-4">
                        <Datepicker
                            label="Application Date"
                            withAsterisk
                            value={applicationDate}
                            error={applicationDateError}
                            onChange={updateApplicationDate}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        />
                        <Textinput
                            placeholder="Enter Saleable Area (sq.ft.) (₹)"
                            label="Saleable Area (sq.ft.) (₹)"
                            withAsterisk
                            value={saleableAreaSqFt}
                            error={saleableAreaSqFtError}
                            onChange={updateSaleableAreaSqFt}
                            type="number"
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                            inputProps={{ disabled: true }}
                        />
                        <div className="flex flex-col gap-2">
                            <Textinput
                                placeholder="Enter Rate Per Sq.ft (₹)"
                                label="Rate Per Sq.ft (₹)"
                                withAsterisk
                                value={ratePerSqFt}
                                error={ratePerSqFtError}
                                onChange={updateRatePerSqFt}
                                type="number"
                                labelClassName="text-sm font-medium text-gray-600 mb-1"
                                inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                            />
                            {totalBaseCost > 0 && <p className="text-xs">Saleable Area (sq.ft.) * Rate Per Sq.ft = <span className="font-semibold">₹ {totalBaseCost}</span></p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Textinput
                                placeholder="Enter Discount Sq.ft (₹)"
                                label="Discount Rate Per Sq.ft (₹)"
                                // withAsterisk
                                value={discount}
                                error={discountError}
                                onChange={updateDiscount}
                                type="number"
                                labelClassName="text-sm font-medium text-gray-600 mb-1"
                                inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                            />
                            {totalDiscount > 0 && <p className="text-xs">Saleable Area (sq.ft.) * Discount Sq.ft = <span className="font-semibold">₹ {totalDiscount}</span></p>}
                        </div>
                        <Textinput
                            placeholder="Enter Base Cost of the Unit (₹)"
                            label="Base Cost of the Unit (₹)"
                            withAsterisk
                            value={baseCostUnit}
                            error={baseCostUnitError}
                            onChange={updateBaseCostUnit}
                            inputProps={{ disabled: true }}
                            type="number"
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                        />
                        {flatDetails?.floor_no >= 5 && (
                            <>
                                <Textinput
                                    placeholder="Enter Foor Rise Charge Per Sq.ft (₹)"
                                    label="Floor Rise Charge Per Sq.ft (₹)"
                                    withAsterisk
                                    value={floorRise}
                                    error={floorRiseError}
                                    onChange={updateFloorRise}
                                    type="number"
                                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                />
                                <Textinput
                                    placeholder="Total Charge of Floor Rise (₹)"
                                    label="Total Charge of Floor Rise (₹)"
                                    withAsterisk
                                    value={floorRiseXPerSft}
                                    error={floorRiseXPerSftError}
                                    onChange={updateFloorRiseXPerSft}
                                    type="number"
                                    inputProps={{ disabled: true, }}
                                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                                />
                            </>
                        )}
                        {flatDetails?.facing === "East" && (
                            <>
                                <Textinput
                                    placeholder="Enter East Facing Charge Per Sq.ft (₹)"
                                    label="East Facing Charge Per Sq.ft (₹)"
                                    withAsterisk
                                    value={eastFacing}
                                    error={eastFacingError}
                                    onChange={updateEastFacing}
                                    type="number"
                                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                />
                                <Textinput
                                    placeholder="Total Charge of East Facing (₹)"
                                    label="Total Charge of East Facing (₹)"
                                    withAsterisk
                                    value={eastFacingXPerSft}
                                    error={eastFacingXPerSftError}
                                    onChange={updateEastFacingXPerSft}
                                    type="number"
                                    inputProps={{ disabled: true, }}
                                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                                />
                            </>
                        )}

                        {flatDetails?.corner === true && (
                            <>
                                <Textinput
                                    placeholder="Enter Corner Charge Per Sq.ft (₹)"
                                    label="Corner Charge Per Sq.ft (₹)"
                                    withAsterisk
                                    value={corner}
                                    error={cornerError}
                                    onChange={updateCorner}
                                    type="number"
                                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                />
                                <Textinput
                                    placeholder="Total Charge of Corner (₹)"
                                    label="Total Charge of Corner (₹)"
                                    withAsterisk
                                    value={cornerXPerSft}
                                    error={cornerXPerSftError}
                                    onChange={updateCornerXPerSft}
                                    type="number"
                                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                                    inputProps={{ disabled: true, }}
                                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                                />
                            </>
                        )}
                        <Textinput
                            placeholder="Enter Amenities (₹)"
                            label="Amenities (₹)"
                            withAsterisk
                            value={amenities}
                            error={amenitiesError}
                            onChange={updateAmenities}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        />
                        <Textinput
                            placeholder="Enter total cost of flat (₹)"
                            label="Total Cost of Flat (₹)"
                            withAsterisk
                            value={totalCostofUnit}
                            error={totalCostofUnitError}
                            onChange={updateTotalCostofUnit}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        />
                        <Textinput
                            placeholder="Enter GST (₹)"
                            label="GST (5%) (₹)"
                            withAsterisk
                            inputProps={{ disabled: true }}
                            value={gst}
                            error={gstError}
                            onChange={updateGst}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                        />
                        <Textinput
                            placeholder="Enter cost of unit with tax (₹)"
                            label="Cost of Unit with Tax (₹)"
                            withAsterisk
                            inputProps={{ disabled: true }}
                            value={costofUnitWithTax}
                            error={costofUnitWithTaxError}
                            onChange={updateCostofUnitWithTax}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                        />
                        {/* <Textinput
                            placeholder="Enter registration charge (₹)"
                            label="Registration @ 7.6% + 1050/- (₹)"
                            withAsterisk
                            inputProps={{ disabled: true }}
                            value={registartionCharge}
                            error={registrationChargeError}
                            onChange={updateRegistrationCharge}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                        /> */}
                        <Textinput
                            placeholder="Enter Manjeera Connection Charge (₹)"
                            label="Manjeera Connection Charge (₹)"
                            withAsterisk
                            value={manjeeraConnectionCharge}
                            error={manjeeraConnectionChargeError}
                            onChange={updateManjeeraConnectionCharge}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        />
                        <Textinput
                            placeholder="Enter maintenance charge (₹)"
                            label="Maintenance @3/- per sqft for 2 Yrs (₹)"
                            withAsterisk
                            inputProps={{ disabled: true }}
                            value={maintenceCharge}
                            error={maintenceChargeError}
                            onChange={updateMaintenceCharge}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                        />
                        <Textinput
                            placeholder="Enter documenation fee (₹)"
                            label="Documentation Fee (₹)"
                            withAsterisk
                            value={documentationFee}
                            error={documenationFeeError}
                            onChange={updateDocumenationFee}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        />
                        <Textinput
                            placeholder="Enter Corpus Fund (₹)"
                            label="Corpus Fund (50 * SFT) (₹)"
                            withAsterisk
                            inputProps={{ disabled: true }}
                            value={corpusFund}
                            error={corpusFundError}
                            onChange={updateCorpusFund}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                        />
                        <Textinput
                            placeholder="Enter Grand Total (₹)"
                            label="Grand Total (₹)"
                            withAsterisk
                            inputProps={{ disabled: true }}
                            value={grandTotal}
                            error={grandTotalError}
                            onChange={updateGrandTotal}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                        />
                    </div>
                </div>

                {isLoadingEffect ?
                    isLoadingEffect && (
                        <div className='absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded'>
                            <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                        </div>
                    )
                    :
                    <div className="flex justify-end">
                        <div onClick={handleSubmit} className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-[#0083bf]">
                            Submit
                        </div>
                    </div>
                }
                <Updateactivities customerflat_id={customerFlatDetails?.id} />
            </div>

            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </div>
    );
}

export default Flatcostupdate;
