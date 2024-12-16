import { fetchAllPayments } from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetch all payments from the database
            const payments = await fetchAllPayments();
            res.status(200).json(payments); // Return payments as JSON response
        } catch (error) {
            console.error('Error fetching payments:', error);
            res.status(500).json({ error: 'Internal Server Error' }); // Handle server error
        }
    } else {
        // Handle unsupported HTTP methods
        res.status(405).json({ error: 'Method Not Allowed' }); // Method not allowed for non-GET requests
    }
}
