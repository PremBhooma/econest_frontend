import React from "react";
import { format } from "date-fns";

export const CostSheetPrint = React.forwardRef(({ data, leadData, selectedFlat }, ref) => {
    if (!data || !selectedFlat) return null;

    console.log("sheet:", selectedFlat)
    console.log("sheet_data:", data)

    const {
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
    } = data;

    const formatCurrency = (val) => {
        const num = Number(val);
        return isNaN(num) ? "0" : num.toLocaleString('en-IN');
    };

    const basicRate = Number(ratePerSqFt);
    const discountVal = Number(discount) || 0;
    const discountedRate = basicRate - discountVal;

    const floorNo = Number(selectedFlat.floor_no);
    const showFloorRise = floorNo >= 6;
    const isEastFacing = selectedFlat.facing === "East";
    const isCorner = selectedFlat.corner === true; // Assuming boolean true based on code

    // Calculations for display
    const totalFloorRiseCost = Number(floorRiseXPerSft) || 0;
    const totalEastFacingCost = Number(eastFacingXPerSft) || 0;
    const totalCornerCost = Number(cornerXPerSft) || 0;
    const amenitiesCost = Number(amenities) || 0;

    // Base Price Calculation for the table (Sum of all per-sft/fixed components before tax)
    // Formula based on screenshot seems to be: (Area * Rate) + FloorRise + Corner + EastFacing + Amenities
    // Wait, screenshot shows "Base Price" at the bottom of the first section.
    const basePrice = (Number(saleableAreaSqFt) * discountedRate) + totalFloorRiseCost + totalCornerCost + totalEastFacingCost + amenitiesCost;

    return (
        <div ref={ref} className="p-8 bg-white text-black text-sm font-sans print:p-0">
            <style type="text/css" media="print">
                {`
            @page { size: A4; margin: 10mm; }
            body { -webkit-print-color-adjust: exact; }
            `}
            </style>
            <div className="border-2 border-black">
                {/* Header */}
                <div className="bg-yellow-300 border-b border-black text-center py-2 font-bold text-xl uppercase">
                    {selectedFlat?.project_name}
                </div>

                {/* Table Grid */}
                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Unit ID</div>
                    <div className="col-span-6 p-1 text-center font-bold text-red-600 bg-yellow-100">
                        {selectedFlat?.project_name} flat No {selectedFlat.flat_no}
                    </div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Configuration</div>
                    <div className="col-span-6 p-1 text-center font-bold">{selectedFlat.type}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Floor</div>
                    <div className="col-span-6 p-1 text-center font-bold">{selectedFlat.floor_no}th Floor</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Orientation</div>
                    <div className="col-span-6 p-1 text-center font-bold text-red-600">{selectedFlat.facing} Facing</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Status</div>
                    <div className="col-span-6 p-1 text-center font-bold">{status}</div>
                </div>

                {/* Notes / Description from Form if available */}
                {description && (
                    <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-6 border-r border-black p-1 pl-2">Note / Description</div>
                        <div className="col-span-6 p-1 text-center pl-2 font-bold text-red-600">{description}</div>
                    </div>
                )}

                {/* Column Headers */}
                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Description</div>
                    <div className="col-span-3 border-r border-black p-1 text-center">Discounted Value</div>
                    <div className="col-span-3 p-1 text-center">Actual Value</div>
                </div>

                {/* Rows */}
                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Super Built-up Area (in sft)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{saleableAreaSqFt}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{saleableAreaSqFt}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Basic Rate (per sft)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2"></div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(basicRate)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black bg-yellow-300 font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2 text-red-600">Discounted Basic Rate (per sft)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2 text-red-600">{formatCurrency(discountedRate)}</div>
                    <div className="col-span-3 p-1 text-right pr-2"></div>
                </div>

                {showFloorRise && (
                    <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-6 border-r border-black p-1 pl-2">Floor Rise Charges (₹ {floorRise} per sft)</div>
                        <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(totalFloorRiseCost)}</div>
                        <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(totalFloorRiseCost)}</div>
                    </div>
                )}

                {isCorner && (
                    <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-6 border-r border-black p-1 pl-2">Corner Facing Premium (₹ {corner} per sft)</div>
                        <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(totalCornerCost)}</div>
                        <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(totalCornerCost)}</div>
                    </div>
                )}

                {isEastFacing && (
                    <div className="grid grid-cols-12 border-b border-black">
                        <div className="col-span-6 border-r border-black p-1 pl-2">East Facing Premium (₹ {eastFacing} per sft)</div>
                        <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(totalEastFacingCost)}</div>
                        <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(totalEastFacingCost)}</div>
                    </div>
                )}

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Amenities Charges</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(amenitiesCost)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(amenitiesCost)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Base Price</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(basePrice)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(Number(totalCostofUnit) + (Number(discount) * Number(saleableAreaSqFt)))}</div>
                    {/* Note: Actual Value Base Price logic might differ, using derived calculation */}
                </div>

                {/* Spacer Row */}
                <div className="grid grid-cols-12 border-b border-black h-6">
                    <div className="col-span-6 border-r border-black"></div>
                    <div className="col-span-3 border-r border-black"></div>
                    <div className="col-span-3"></div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2"></div>
                    <div className="col-span-3 border-r border-black p-1 text-center">Amount</div>
                    <div className="col-span-3 p-1 text-center">Amount</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Total Cost (A)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(basePrice)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(Number(totalCostofUnit) + (Number(discount) * Number(saleableAreaSqFt)))}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">GST 5% (A)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(gst)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency((Number(totalCostofUnit) + (Number(discount) * Number(saleableAreaSqFt))) * 0.05)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Corpus Fund (₹ 50 per sft)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(corpusFund)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(corpusFund)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Maintenance Charges (₹ 3 for 24 months)</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(maintenceCharge)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(maintenceCharge)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Documentation Fee</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(documentationFee)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(documentationFee)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Manjeera connection</div>
                    <div className="col-span-3 border-r border-black p-1 text-right pr-2">{formatCurrency(manjeeraConnectionCharge)}</div>
                    <div className="col-span-3 p-1 text-right pr-2">{formatCurrency(manjeeraConnectionCharge)}</div>
                </div>

                {/* Notes / Description from Form if available */}


                {/* <div className="grid grid-cols-12 border-b border-black">
          <div className="col-span-6 border-r border-black p-1 pl-2">Manjeera connection Metere</div>
           <div className="col-span-3 border-r border-black p-1 text-right pr-2">15,000</div>
           <div className="col-span-3 p-1 text-right pr-2">15,000</div>
        </div> */}

                <div className="grid grid-cols-12 border-b border-black h-6">
                    <div className="col-span-6 border-r border-black p-1 pl-2 font-bold">Total Cost (B)</div>
                    <div className="col-span-3 border-r border-black"></div>
                    <div className="col-span-3"></div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Final Summary</div>
                    <div className="col-span-6 p-1 text-center">Amount</div>
                </div>

                {/* Grand Totals */}
                <div className="grid grid-cols-12 border-b border-black font-bold">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Grand Total</div>
                    <div className="col-span-6 p-1 text-right bg-green-400 pr-2">{formatCurrency(Number(grandTotal) + (Number(discount) * Number(saleableAreaSqFt) * 1.05))}</div> {/* Approximating Actual Grand Total */}
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold bg-yellow-300">
                    <div className="col-span-6 border-r border-black p-1 pl-2 text-red-600">Discounted Grand Total</div>
                    <div className="col-span-6 p-1 text-right pr-2 text-red-600">{formatCurrency(grandTotal)}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black font-bold bg-yellow-300">
                    <div className="col-span-6 border-r border-black p-1 pl-2">Discount Amount</div>
                    {/* Discount calculation is (Area * Discount) + (Area * Discount * 0.05 GST) approx? or just Area * Discount. Based on structure, it's difference between Actual and Discounted */}
                    <div className="col-span-6 p-1 text-right pr-2 text-red-600 font-bold">{formatCurrency((Number(grandTotal) + (Number(discount) * Number(saleableAreaSqFt) * 1.05)) - Number(grandTotal))}</div>
                </div>

            </div>
        </div>
    );
});

CostSheetPrint.displayName = "CostSheetPrint";
