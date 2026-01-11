import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Flatapi from "../api/Flatapi";
import Settingsapi from "../api/Settingsapi";
import Customerapi from "../api/Customerapi";
import Errorpanel from "../shared/Errorpanel";
import noImageStaticImage from "../../../public/assets/no_image.png"
import { toast } from "react-toastify";
import { Datepicker, Loadingoverlay, Textinput } from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Flattocustomer({ closeFlatToCustomer, refreshGetAllFlats }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerError, setSelectedCustomerError] = useState('');
    const [searchedCustomer, setSearchedCustomer] = useState("");
    const [customer, setCustomer] = useState([]);
    const [customerLoading, setCustomerLoading] = useState(false);
    const [showDropdownCustomer, setShowDropdownCustomer] = useState(false);
    const [debounceTimerCustomer, setDebounceTimerCustomer] = useState(null);



    const [manjeeraConnectionCharge, setManjeeraConnectionCharge] = useState("50000");
    const [manjeeraConnectionChargeError, setManjeeraConnectionChargeError] = useState('');



    const updateSearchedCustomer = (e) => {
        const value = e.target.value;
        setSearchedCustomer(value);

        if (debounceTimerCustomer) clearTimeout(debounceTimerCustomer);

        const timer = setTimeout(() => {
            if (value.trim().length > 0) {
                getCustomerForFlatsData(value);
                setShowDropdownCustomer(true);
            } else {
                setFlat([]);
                setShowDropdownCustomer(false);
            }
        }, 500);

        setDebounceTimerCustomer(timer);
    };

    const handleSelectCustomer = (customerValue) => {
        setSearchedCustomer(customerValue?.label);
        setSelectedCustomer(customerValue);
        setShowDropdownCustomer(false);
        setSelectedCustomerError('')
    };

    useEffect(() => {
        if (!searchedCustomer) {
            setSelectedCustomer(null);
        }
    }, [searchedCustomer]);

    const [selectedFlat, setSelectedFlat] = useState(null);
    const [selectedFlatError, setSelectedFlatError] = useState('');
    const [searchedFlat, setSearchedFlat] = useState("");
    const [flat, setFlat] = useState([]);
    const [flatLoading, setFlatLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);
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

    const handleSelectCity = (flat) => {
        setSearchedFlat(flat?.label);
        setSelectedFlat(flat);
        setSaleableAreaSqFt(flat?.square_feet)
        setShowDropdown(false);
        setSelectedFlatError('')
    };

    useEffect(() => {
        if (selectedFlat) {
            getAmenitiesData(selectedFlat?.type);
        }
        if (!searchedFlat) {
            setSelectedFlat(null);
            setAmenties('');
            setSaleableAreaSqFt('');
        }
        if (selectedFlat?.floor_no) {
            if (selectedFlat?.floor_no >= 5) {
                const floorsToCharge = selectedFlat.floor_no - 5 + 1;
                setFloorRise(floorsToCharge * 25);
            } else {
                setFloorRise(0);
            }
        }
    }, [searchedFlat, selectedFlat]);

    async function getFlatsData(flat) {
        try {
            setFlatLoading(true);

            const response = await Flatapi.get(`search-flats`, {
                params: {
                    flat_no: flat,
                    employeeId: employeeId,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response?.data;
            if (data?.status === "error") {
                let finalresponse = {
                    message: data.message,
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                setFlat([]);
                return false;
            }
            setFlat(data?.data || []);
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
                    message: error.message,
                    server_res: null,
                };
            }
            setErrorMessage(finalresponse);
            return false;
        } finally {
            setFlatLoading(false);
        }

    }

    async function getCustomerForFlatsData(customerValue) {
        try {
            setFlatLoading(true);

            const response = await Customerapi.get(`search-customers-for-flat`, {
                params: {
                    searchQuery: customerValue,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response?.data;
            if (data?.status === "error") {
                let finalresponse = {
                    message: data.message,
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                setFlatLoading(false);
                setFlat([]);
                return false;
            }
            setCustomer(data?.data || []);
            return true;
        } catch (error) {
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
        } finally {
            setFlatLoading(false);
        }

    }

    const infoItems = [
        { label: 'Name', value: `${capitalize(selectedCustomer?.first_name) || ''} ${capitalize(selectedCustomer?.last_name) || ''}` },
        { label: 'Email', value: selectedCustomer?.email },
        { label: 'Phone Number', value: `+${selectedCustomer?.phone_code} ${selectedCustomer?.phone_number}` },
        { label: 'Date of Birth', value: dayjs(selectedCustomer?.date_of_birth).format('DD/MM/YYYY') },
        { label: 'Mother Tongue', value: selectedCustomer?.mother_tongue },
        { label: 'Pan Card No.', value: selectedCustomer?.pan_card_no },
        { label: 'Aadhar Card No.', value: selectedCustomer?.aadhar_card_no?.replace(/(\d{4})(?=\d)/g, "$1-") },
    ];

    const [saleableAreaSqFt, setSaleableAreaSqFt] = useState("");
    const [saleableAreaSqFtError, setSaleableAreaSqFtError] = useState("");
    const updateSaleableAreaSqFt = (e) => {
        setSaleableAreaSqFt(e.target.value);
        setSaleableAreaSqFtError("");
    };

    const [ratePerSqFt, setRatePerSqFt] = useState("");
    const [ratePerSqFtError, setRatePerSqFtError] = useState("");
    const updateRatePerSqFt = (e) => {
        setRatePerSqFt(e.target.value);
        setRatePerSqFtError("");
    };

    const [discount, setDiscount] = useState('');
    const [discountError, setDiscountError] = useState("");
    const updateDiscount = (e) => {
        setDiscount(e.target.value);
        setDiscountError("");
    };

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
    const updateFloorRise = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setFloorRise(value)
        setFloorRiseError('')
    }

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
    const updateEastFacing = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setEastFacing(value)
        setEastFacingError('')
    }

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
    const updateCorner = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setCorner(value)
        setCornerError('')
    }

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
    const updateAmenities = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setAmenties(value)
        setAmentiesError('')
    }

    const [totalCostofUnit, setTotalCostofUnit] = useState('')
    const [totalCostofUnitError, setTotalCostofUnitError] = useState('')
    const updateTotalCostofUnit = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setTotalCostofUnit(value)
        setTotalCostofUnitError('')
    }

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
    const updateDocumenationFee = (e) => {
        let value = e.target.value;
        if (isNaN(value)) {
            return false
        }
        setDocumentationFee(value)
        setDocumenationFeeError('')
    }

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

    async function getAmenitiesData(flatType) {
        try {
            setIsLoadingEffect(true);

            const response = await Settingsapi.get(`get-list-amenities`, {
                params: {
                    flatType: flatType,
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response?.data;
            if (data?.status === "error") {
                let finalresponse = {
                    message: data.message,
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                setAmenties('');
                return false;
            }
            setAmenties(data?.amenities || '');
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
                    message: error.message,
                    server_res: null,
                };
            }
            setErrorMessage(finalresponse);
            return false;
        } finally {
            setIsLoadingEffect(false);
        }

    }

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
        if (selectedFlat?.floor_no >= 5 && area && flRise) {
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

            let registerCharge = ((parseFloat(totalCostofUnit) * 0.076) + 1050).toFixed(2);
            setRegistrationCharge(parseFloat(registerCharge));

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
            setRegistrationCharge("");
            setMaintenceCharge("");
            setCorpusFund("");
            setGrandTotal("");
        }
    }, [totalCostofUnit, saleableAreaSqFt, documentationFee]);


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

        if (amenities === '') {
            setAmentiesError("Enter amenities");
            setIsLoadingEffect(false);
            return false;
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

        if (selectedFlat?.floor_no >= 5 && floorRise === "") {
            setFloorRiseError('Enter floor rise charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.floor_no >= 5 && floorRiseXPerSft === "") {
            setFloorRiseXPerSftError('Total floor rise is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.facing === "East" && eastFacing === "") {
            setEastFacingError('Enter east facing charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.facing === "East" && eastFacingXPerSft === "") {
            setEastFacingXPerSftError('Total east facing is empty')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.corner === true && corner === "") {
            setCornerError('Enter corner charge per sq.ft.')
            setIsLoadingEffect(false)
            return false
        }

        if (selectedFlat?.corner === true && cornerXPerSft === "") {
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

            const apiEndpoint = selectedCustomer?.uuid && "add-customer-flat";

            const response = await Customerapi.post(apiEndpoint, {
                customerUuid: selectedCustomer?.uuid,
                flat_id: selectedFlat?.value,
                applicationdate: formatDateOnly(applicationDate),
                saleable_area_sq_ft: Number(saleableAreaSqFt),
                rate_per_sq_ft: Number(ratePerSqFt),
                discount: discount ? parseFloat(discount) : null,
                base_cost_unit: Number(baseCostUnit),
                amenities: parseFloat(amenities),
                flatType: selectedFlat?.type,
                toatlcostofuint: parseFloat(totalCostofUnit),
                gst: parseFloat(gst),
                costofunitwithtax: parseFloat(costofUnitWithTax),
                registrationcharge: parseFloat(registartionCharge),
                maintenancecharge: parseFloat(maintenceCharge),
                documentaionfee: parseFloat(documentationFee),
                corpusfund: parseFloat(corpusFund),
                floor_rise_per_sq_ft: selectedFlat?.floor_no >= 5 ? parseFloat(floorRise) : null,
                total_floor_rise: parseFloat(floorRiseXPerSft),
                east_facing_per_sq_ft: selectedFlat?.facing === "East" ? parseFloat(eastFacing) : null,
                total_east_facing: parseFloat(eastFacingXPerSft),
                corner_per_sq_ft: selectedFlat?.corner === true ? parseFloat(corner) : null,
                total_corner: parseFloat(cornerXPerSft),
                grand_total: parseFloat(grandTotal),
                employeeId: employeeId,
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
            toast.success("Flast assigned to customer successfully");
            refreshGetAllFlats();
            closeFlatToCustomer();
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
                    message: error.message,
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
                <div className="font-semibold text-lg">Assign Flat to Customer</div>
                <div onClick={closeFlatToCustomer} className="cursor-pointer py-1.5 px-3 rounded-sm bg-red-300 text-black font-semibold">Close</div>
            </div>

            <hr className="border border-[#ebecef]" />

            <div className="px-4 py-2 flex flex-col gap-2">
                <div className="flex justify-between gap-4">
                    <div className="flex flex-col gap-1 items-start w-full">
                        <div className="flex flex-col gap-2 relative w-full">
                            <div className="text-sm font-medium">Search for Flat</div>
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    placeholder="Search with Flats No"
                                    value={searchedFlat}
                                    onChange={updateSearchedLocation}
                                    className="w-full border border-[#ced4da] px-3 py-2 rounded-md outline-none placeholder:text-[14px] placeholder:text-black/50 text-[14px] text-black/60"
                                />
                            </div>

                            {showDropdown && (
                                <div className="absolute top-full left-0 w-full z-10 mt-1">
                                    <div className="bg-white border border-[#ced4da] rounded-md max-h-48  overflow-y-auto">
                                        {flatLoading ? (
                                            <div className="p-3 text-sm text-gray-500">Loading...</div>
                                        ) : flat.length > 0 ? (
                                            <ul>
                                                {flat.map((flat) => (
                                                    <li
                                                        key={flat?.value}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px] text-black/60"
                                                        onClick={() => handleSelectCity(flat)}
                                                    >
                                                        {flat?.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-3 text-sm text-gray-500">No Result</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedFlat && (
                            <div className="bg-white border border-[#ced4da] rounded-md max-h-96 overflow-y-auto w-full">
                                <div className="p-4 border-b last:border-none hover:bg-gray-50 transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-lg font-semibold text-gray-800">
                                            Flat No: {selectedFlat?.flat_no}
                                        </div>
                                        <div className="text-sm text-gray-600">{selectedFlat?.block_name}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                                        <div><span className="font-medium">Facing:</span> {selectedFlat?.facing}</div>
                                        <div><span className="font-medium">Floor:</span> {selectedFlat?.floor_no}</div>
                                        <div><span className="font-medium">Area:</span> {selectedFlat?.square_feet} sqft</div>
                                        <div><span className="font-medium">Furnished:</span> {selectedFlat?.furnished_status}</div>
                                        <div><span className="font-medium">Type:</span> {selectedFlat?.type}</div>
                                        <div><span className="font-medium">Bedrooms:</span> {selectedFlat?.bedrooms}</div>
                                        <div><span className="font-medium">Bathrooms:</span> {selectedFlat?.bathrooms}</div>
                                        <div><span className="font-medium">Balconies:</span> {selectedFlat?.balconies}</div>
                                        <div><span className="font-medium">Parking:</span> {selectedFlat?.parking ? "Yes" : "No"}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {selectedFlat !== '' && (
                            <p className="text-xs text-red-600 font-medium">{selectedFlatError}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 items-start w-full">
                        <div className="flex flex-col gap-2 relative w-full">
                            <div className="text-sm font-medium">Search for Customer</div>
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    placeholder="Search Customers"
                                    value={searchedCustomer}
                                    onChange={updateSearchedCustomer}
                                    className="w-full border border-[#ced4da] px-3 py-2 rounded-md outline-none placeholder:text-[14px] placeholder:text-black/50 text-[14px] text-black/60"
                                />
                            </div>

                            {showDropdownCustomer && (
                                <div className="absolute top-full left-0 w-full z-10 mt-1">
                                    <div className="bg-white border border-[#ced4da] rounded-md max-h-48  overflow-y-auto">
                                        {customerLoading ? (
                                            <div className="p-3 text-sm text-gray-500">Loading...</div>
                                        ) : customer.length > 0 ? (
                                            <ul>
                                                {customer.map((ele) => (
                                                    <li
                                                        key={ele?.value}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px] text-black/60"
                                                        onClick={() => handleSelectCustomer(ele)}
                                                    >
                                                        {ele?.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-3 text-sm text-gray-500">No Result</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedCustomer && (
                            <div className="bg-white border border-[#ced4da] rounded-md max-h-96 overflow-y-auto w-full p-4">
                                <div className="w-full flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-[120px] flex justify-center items-center">
                                        <img
                                            crossOrigin="anonymous"
                                            src={selectedCustomer?.profile_pic_url || noImageStaticImage}
                                            alt="Profile"
                                            className="w-full h-[130px] rounded-lg object-cover border border-gray-300"
                                        />
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {infoItems.map(({ label, value }) => (
                                            <div key={label} className="flex flex-col gap-y-1">
                                                <p className="text-sm text-gray-600">{label}</p>
                                                <p className="text-sm text-gray-900 font-semibold break-all">{value || '-'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {selectedCustomer !== '' && (
                            <p className="mt-1 text-xs text-red-600 font-medium">{selectedCustomerError}</p>
                        )}
                    </div>
                </div>

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
                        {selectedFlat?.floor_no >= 5 && (
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
                                    inputProps={{ disabled: true }}
                                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 cursor-not-allowed"
                                />
                            </>
                        )}
                        {selectedFlat?.facing === "East" && (
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

                        {selectedFlat?.corner === true && (
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
                            placeholder="Enter total cost of flat (₹"
                            label="Total Cost of Flat (₹)"
                            withAsterisk
                            value={totalCostofUnit}
                            error={totalCostofUnitError}
                            onChange={updateTotalCostofUnit}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        />
                        <Textinput
                            placeholder="Enter GST"
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

                        <div>
                            <Label>Manjeera Connection Charges</Label>
                            <Input
                                value={manjeeraConnectionCharge ? parseFloat(manjeeraConnectionCharge).toLocaleString('en-IN') : ''}
                                readOnly
                                onChange={(e) => setManjeeraConnectionCharge(e.target.value)}
                                className="bg-gray-50 border border-gray-300 rounded-[4px] focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-gray-300 focus:border-black"
                            />
                        </div>
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
                            label="Corpus Fund (50 * SFT) (₹) "
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



            </div>

            {/* {isLoadingEffect && (
                <div className="fixed inset-0 bg-[#f5f5f6] flex justify-center items-center z-50">
                    <Loadingoverlay visible={isLoadingEffect} overlayBg="bg-transparent" />
                </div>
            )} */}
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </div>
    );
}

export default Flattocustomer;
