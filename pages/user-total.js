import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserTotal() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchingTotal, setFetchingTotal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotal = async () => {
        if (!selectedUserId) return;

        setFetchingTotal(true);
        try {
            const response = await fetch(`/api/payments/total?user_id=${selectedUserId}`);
            const data = await response.json();
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching total:', error);
        } finally {
            setFetchingTotal(false);
        }
    };

    return (
        <Container className="py-4">
            <h1 className="mb-4 text-center">User Payment Total</h1>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : users.length > 0 ? (
                <>
                    <Form>
                        <Form.Group className="mb-3" controlId="formUserSelect">
                            <Form.Label>Select User</Form.Label>
                            <Form.Select
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                required
                            >
                                <option value="">-- Select User --</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Button
                            variant="primary"
                            onClick={fetchTotal}
                            className="w-100"
                            disabled={!selectedUserId || fetchingTotal}
                        >
                            {fetchingTotal ? 'Fetching...' : 'View Total'}
                        </Button>
                    </Form>

                    {total !== null && (
                        <Alert variant="info" className="mt-4 text-center">
                            Total Payment: <strong>₹{total.toFixed(2)}</strong>
                        </Alert>
                    )}
                </>
            ) : (
                <Alert variant="warning">No users found. Please add users first.</Alert>
            )}
        </Container>
    );
}
