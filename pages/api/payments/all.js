import { getAllPaymentsGroupedByUser } from '../../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Call the function to get all payments grouped by user
            const groupedPayments = await getAllPaymentsGroupedByUser();
            // Send the correct JSON response
            res.status(200).json(groupedPayments);
        } catch (error) {
            console.error('Error fetching grouped payments:', error);
            // Send a JSON error response if there's a failure
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Handle method not allowed for non-GET requests
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
