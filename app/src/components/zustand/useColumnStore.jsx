import { create } from 'zustand';
import Settingsapi from '../api/Settingsapi.jsx';

let saveTimeout;

export const useColumnStore = create((set, get) => ({
    storedColumns: [],
    hasFetched: false,

    fetchColumns: async (employee_id, page_name) => {
        try {
            const params = { employee_id, page_name };
            const response = await Settingsapi.get("/get-column-store", {
                params,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response.data;
            if (data.status === "success") {
                set({
                    storedColumns: data.data || [],
                    hasFetched: true
                });
            } else {
                set({
                    storedColumns: [],
                    hasFetched: true
                });
            }
        } catch (error) {
            console.error("Error fetching columns:", error);
            set({
                storedColumns: [],
                hasFetched: true
            });
        }
    },

    handleColumnStore: (updatedColumns, employee_id, page_name) => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            const visibleColumnNames = Object.keys(updatedColumns).filter(
                (col) => updatedColumns[col]
            );

            try {
                await Settingsapi.post("/column-store", {
                    page_name,
                    employee_id,
                    columns: visibleColumnNames
                });

                set({ storedColumns: visibleColumnNames });
            } catch (error) {
                console.error("Error saving columns:", error);
            }
        }, 300);
    }
}));
