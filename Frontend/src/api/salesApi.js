import axios from 'axios';

const API_URL = 'http://localhost:5000/sales';

export const fetchSales = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching sales:", error);
    }
};

export const addSale = async (sale) => {
    try {
        const response = await axios.post(API_URL, sale);
        return response.data;
    } catch (error) {
        console.error("Error adding sale:", error);
    }
};
