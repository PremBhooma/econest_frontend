import React, { useEffect, useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerClose,
} from "@/components/ui/drawerCostSheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import Flatapi from "../api/Flatapi";
import Settingsapi from "../api/Settingsapi";
import Customerapi from "../api/Customerapi";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Errorpanel from "../shared/Errorpanel";
import { CloudCog } from 'lucide-react';

const CostSheetDrawer = ({ open, onOpenChange, leadData, refreshLeadDetails }) => {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

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

    const [totalCostofUnit, setTotalCostofUnit] = useState("");
    const [totalCostofUnitError, setTotalCostofUnitError] = useState('');

    const [gst, setGst] = useState("");
    const [gstError, setGstError] = useState('');

    const [costofUnitWithTax, setCostofUnitWithTax] = useState("");
    const [costofUnitWithTaxError, setCostofUnitWithTaxError] = useState('');

    const [registartionCharge, setRegistrationCharge] = useState("");
    const [registrationChargeError, setRegistrationChargeError] = useState('');

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
            if (selectedFlat?.floor_no >= 5) {
                const floorsToCharge = selectedFlat.floor_no - 5 + 1;
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

                setGrandTotal(parseFloat(totalCostofUnit) + parseFloat(gstValue) + parseFloat(registerCharge) + parseFloat(maintainCharge) + parseFloat(corpusFund) + parseFloat(documentationFee))
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

        // Using leadData instead of selectedCustomer
        if (!leadData) {
            toast.error("Lead data missing");
            setIsLoadingEffect(false);
            return false;
        }

        if (applicationDate === "") {
            setApplicationDateError('Select application date');
            setIsLoadingEffect(false);
            return false;
        }

        if (saleableAreaSqFt === "") {
            setSaleableAreaSqFtError("Saleable Area (sq.ft.) is required");
            setIsLoadingEffect(false);
            return false;
        }

        if (ratePerSqFt === "") {
            setRatePerSqFtError("Rate Per (sq.ft.) is required");
            setIsLoadingEffect(false);
            return false;
        }

        if (grandTotal === "") {
            setGrandTotalError('Grand total is required');
            setIsLoadingEffect(false);
            return false;
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

            const apiEndpoint = leadData?.lead_uuid && "add-customer-flat"; // Using same endpoint? Assuming it handles leads or leads->customers

            const response = await Customerapi.post(apiEndpoint, {
                customerUuid: leadData?.lead_uuid || leadData?.id, // Using lead UUID/ID
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
                employeeId: employeeId
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
            toast.success("Cost Sheet saved successfully");
            if (refreshLeadDetails) refreshLeadDetails();
            onOpenChange(false);
            return true;
        } catch (error) {
            console.error(error);
            setErrorMessage({
                message: error.message,
                server_res: error.response?.data,
            });
            setIsLoadingEffect(false);
            return false;
        }
    };


    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="!fixed !inset-y-0 !right-0 !left-auto !mt-0 !w-[80%] !h-full !rounded-none !border-l bg-white [&>div.bg-muted]:hidden">
                <DrawerHeader className="flex justify-between items-center border-b pb-4 px-6 mb-0">
                    <div>
                        <DrawerTitle>Cost Sheet</DrawerTitle>
                        <DrawerDescription>
                            Generate cost sheet for {leadData?.first_name} {leadData?.last_name}
                        </DrawerDescription>
                    </div>
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <IconX size={20} />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-6 pt-6 scrollbar-hide">
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
                            className="mt-1"
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
                            <div>
                                <Label>Application Date *</Label>
                                <Input
                                    type="date"
                                    value={applicationDate}
                                    onChange={(e) => {
                                        setApplicationDate(e.target.value);
                                        setApplicationDateError('');
                                    }}
                                />
                                {applicationDateError && <p className="text-red-500 text-xs mt-1">{applicationDateError}</p>}
                            </div>

                            <div>
                                <Label>Saleable Area (sq.ft) *</Label>
                                <Input
                                    type="number"
                                    value={saleableAreaSqFt}
                                    onChange={(e) => {
                                        setSaleableAreaSqFt(e.target.value);
                                        setSaleableAreaSqFtError('');
                                    }}
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
                                />
                                {ratePerSqFtError && <p className="text-red-500 text-xs mt-1">{ratePerSqFtError}</p>}
                            </div>

                            <div>
                                <Label>Discount Per sq.ft</Label>
                                <Input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Base Cost</Label>
                                <Input
                                    value={baseCostUnit}
                                    readOnly
                                    className="bg-gray-50"
                                />
                            </div>

                            {selectedFlat?.floor_no >= 5 && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label>Floor Rise (Per sq.ft)</Label>
                                        <Input
                                            value={floorRise}
                                            onChange={(e) => setFloorRise(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Total Floor Rise</Label>
                                        <Input value={floorRiseXPerSft} readOnly className="bg-gray-50" />
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
                                        />
                                    </div>
                                    <div>
                                        <Label>Total East Facing</Label>
                                        <Input value={eastFacingXPerSft} readOnly className="bg-gray-50" />
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
                                        />
                                    </div>
                                    <div>
                                        <Label>Total Corner</Label>
                                        <Input value={cornerXPerSft} readOnly className="bg-gray-50" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <Label>Amenities</Label>
                                <Input
                                    value={amenities}
                                    onChange={(e) => setAmenities(e.target.value)}
                                />
                                {amenitiesError && <p className="text-red-500 text-xs mt-1">{amenitiesError}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Total Cost of Unit</Label>
                                <Input
                                    value={totalCostofUnit}
                                    readOnly
                                    className="bg-gray-50 font-bold"
                                />
                            </div>

                            <div>
                                <Label>GST (5%)</Label>
                                <Input
                                    value={gst}
                                    readOnly
                                    className="bg-gray-50"
                                />
                            </div>

                            <div>
                                <Label>Cost of Unit with Tax</Label>
                                <Input
                                    value={costofUnitWithTax}
                                    readOnly
                                    className="bg-gray-50 font-semibold"
                                />
                            </div>

                            <div>
                                <Label>Registration Charges</Label>
                                <Input
                                    value={registartionCharge}
                                    onChange={(e) => setRegistrationCharge(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Maintenance Charges</Label>
                                <Input
                                    value={maintenceCharge}
                                    onChange={(e) => setMaintenceCharge(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Documentation Fee</Label>
                                <Input
                                    value={documentationFee}
                                    onChange={(e) => setDocumentationFee(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Corpus Fund</Label>
                                <Input
                                    value={corpusFund}
                                    onChange={(e) => setCorpusFund(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 border-t">
                                <Label className="text-lg text-primary">Grand Total</Label>
                                <Input
                                    value={grandTotal}
                                    onChange={(e) => setGrandTotal(e.target.value)}
                                    className="text-lg font-bold bg-green-50 border-green-200 text-green-700 h-14"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-white p-4 items-center border-t">
                        <div className="flex-1">
                            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
                        </div>
                        <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
                        <Button onClick={handleSubmit} className="bg-[#931f42] hover:bg-[#a6234b]">Save Cost Sheet</Button>
                    </div>

                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default CostSheetDrawer;
