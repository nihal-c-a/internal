import { useState, useEffect } from 'react';
import { Container, Accordion, Table, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AllPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllPayments();
    }, []);

    const fetchAllPayments = async () => {
        setLoading(true);
        setError(null); // Reset error before fetching

        try {
            const response = await fetch('/api/payments/all');
            if (!response.ok) {
                throw new Error(`API returned error: ${response.status}`);
            }
            const data = await response.json();
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error.message);
            setError('Failed to load payments. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4">
            <h1 className="mb-4 text-center">All Payments by Users</h1>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert> // Display error message if there's a failure
            ) : payments.length > 0 ? (
                <Accordion defaultActiveKey={0}>
                    {payments.map((user, index) => (
                        <Accordion.Item eventKey={index} key={user.userId}>
                            <Accordion.Header>
                                {user.userName} - Total: ₹{user.total.toFixed(2)}
                            </Accordion.Header>
                            <Accordion.Body>
                                <Table responsive="sm" bordered>
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {user.payments.map((payment, idx) => (
                                            <tr key={payment.id}>
                                                <td>{idx + 1}</td>
                                                <td>₹{payment.amount.toFixed(2)}</td>
                                                <td>{new Date(payment.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            ) : (
                <Alert variant="warning">No payments found.</Alert>
            )}
        </Container>
    );
}
