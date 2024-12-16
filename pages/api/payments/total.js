// File: pages/api/payments/total.js
import { getTotalByUser } from '../../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { user_id } = req.query;

        if (!user_id) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }

        try {
            const total = await getTotalByUser(user_id);
            res.status(200).json({ total });
        } catch (error) {
            console.error('Error fetching total:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
