import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawerCostSheet";

const CostSheetDrawer = ({ open, onOpenChange }) => {
    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="!fixed !inset-y-0 !right-0 !left-auto !mt-0 !w-[80%] !h-full !rounded-none !border-l bg-white [&>div.bg-muted]:hidden">
                <DrawerHeader className="mb-6">
                    <DrawerTitle>Cost Sheet</DrawerTitle>
                    <DrawerDescription>
                        View and manage cost sheet details here.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-4">
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-lg font-medium">Cost Sheet Module</p>
                        <p className="text-sm">Content to be implemented</p>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default CostSheetDrawer;
