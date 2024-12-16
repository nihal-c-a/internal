import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Container, Row, Col, Table, Alert, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter(); // Use useRouter hook for navigation

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Querying the 'date' column instead of 'created_at'
        const { data, error } = await supabase
          .from('payments')
          .select('id, amount, date, user_id, users(name)')
          .order('date', { ascending: false }); // Ordering by 'date' column

        if (error) {
          throw error; // If there's an error, throw it to be caught in the catch block
        }

        console.log('Fetched payments:', data); // Debugging log
        setPayments(data);
      } catch (err) {
        console.error('Error fetching payments:', err.message);
        setError('Failed to fetch payment history. Please try again later.');
      }
    };

    fetchPayments();
  }, []);

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={8}>
          <h2 className="text-center">Payment History</h2>

          {/* Back Button */}
          <Button variant="secondary" onClick={() => router.push('/')} className="mb-4">
            Back
          </Button>

          {error && <Alert variant="danger">{error}</Alert>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">No payments found.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.users?.name || 'Unknown'}</td>
                    <td>{payment.amount}</td>
                    <td>
                      {/* Format date to 12-hour format */}
                      {new Date(payment.date).toLocaleString('en-US', {
                        hour12: true,
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
