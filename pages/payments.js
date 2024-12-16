import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import UserSelect from '../components/UserSelect';

export default function RecordPayment() {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !amount) {
      setMessage('Please select a member and enter an amount.');
      return;
    }

    const { data, error } = await supabase.from('payments').insert([
      { user_id: userId, amount: parseFloat(amount) },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Payment recorded successfully!');
      setUserId('');
      setAmount('');
      setTimeout(() => router.push('/'), 2000); // Redirect to home after success
    }
  };

  // Back button handler
  const handleBack = () => {
    router.push('/'); // You can replace '/' with the desired page
  };

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={6}>
          <h2 className="text-center">Record New Payment</h2>

          {message && (
            <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>
              {message}
            </Alert>
          )}

          {/* Back Button */}
          <Button variant="secondary" className="mb-3" onClick={handleBack}>
            Back
          </Button>

          <Form onSubmit={handleSubmit}>
            <UserSelect value={userId} onChange={(e) => setUserId(e.target.value)} />
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Record Payment
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
