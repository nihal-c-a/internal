import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Import supabase client
import { Container, Row, Col, Table, Alert, Button, Card, Modal, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function PaymentsByUsers() {
  const [payments, setPayments] = useState([]); // State to store payments data
  const [users, setUsers] = useState([]); // State to store users data
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // Error state
  const [expenses, setExpenses] = useState([]); // State to store expenses
  const [totalSpend, setTotalSpend] = useState(0); // State for total spend
  const [totalCollection, setTotalCollection] = useState(0); // State for total collection
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [newExpense, setNewExpense] = useState(''); // State for new expense amount
  const router = useRouter(); // For Back button functionality

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('users').select('id, name');
        if (error) throw error;
        setUsers(data); // Set users data
      } catch (err) {
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  // Fetch Payments and group them by user_id
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true); // Set loading state
      try {
        const { data, error } = await supabase.from('payments').select('user_id, amount');
        if (error) throw error;

        // Group payments by user_id and calculate the total amount for each user
        const paymentsGrouped = data.reduce((acc, payment) => {
          const { user_id, amount } = payment;
          if (!acc[user_id]) {
            acc[user_id] = 0; // Initialize if the user_id is not in the accumulator
          }
          acc[user_id] += amount; // Add the payment amount to the user's total
          return acc;
        }, {});

        // Convert the grouped payments to an array of objects with user_id and totalAmount
        const groupedPayments = Object.keys(paymentsGrouped).map(user_id => ({
          user_id: parseInt(user_id), // Ensure user_id is an integer
          totalAmount: paymentsGrouped[user_id],
        }));

        setPayments(groupedPayments); // Set the grouped payments data
      } catch (err) {
        setError('Failed to load payments');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPayments();
  }, []);

  // Fetch Expenses and calculate total spend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data, error } = await supabase.from('expenses').select('amount');
        if (error) throw error;
        setExpenses(data); // Set expenses data

        // Calculate total spend from expenses
        const total = data.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalSpend(total);
      } catch (err) {
        setError('Failed to load expenses');
      }
    };

    fetchExpenses();
  }, []);

  // Calculate total collection from payments
  useEffect(() => {
    const total = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
    setTotalCollection(total);
  }, [payments]);

  // Handle adding new expense
  const handleAddExpense = async () => {
    if (!newExpense) {
      setError('Please enter a valid amount for the expense');
      return;
    }

    try {
      const { error } = await supabase
        .from('expenses')
        .insert([{ amount: parseFloat(newExpense) }]);

      if (error) throw error;

      // Fetch updated expenses
      const { data, error: fetchError } = await supabase.from('expenses').select('amount');
      if (fetchError) throw fetchError;
      setExpenses(data);

      // Close modal and reset input
      setShowModal(false);
      setNewExpense('');
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  // Back button functionality
  const handleBack = () => {
    router.push('/'); // Navigate back to the home page
  };

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={10}>
          <h2 className="text-center">Overall Payment</h2>

          {/* Back Button */}
          <Button variant="secondary" onClick={handleBack} className="mb-4">
            Back
          </Button>

          {error && <Alert variant="danger">{error}</Alert>} {/* Show error if any */}

          {/* Total Spend and Total Collection */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="p-4">
                <Card.Body>
                  <h4>Total Spend: ₹{totalSpend.toFixed(2)}</h4>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="p-4">
                <Card.Body>
                  <h4>Total Collection: ₹{totalCollection.toFixed(2)}</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Loading or Displaying Payments */}
          {loading ? (
            <p>Loading payments...</p> // Loading message while fetching data
          ) : (
            <Card className="p-4">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Total Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Display payments if there is any */}
                  {payments.length > 0 && users.length > 0 ? (
                    payments.map((payment) => {
                      // Find the user corresponding to the payment's user_id
                      const user = users.find(u => u.id === payment.user_id);

                      // Ensure the user is found before rendering
                      if (user) {
                        return (
                          <tr key={payment.user_id}>
                            <td>{user.name}</td>
                            <td>₹{payment.totalAmount.toFixed(2)}</td>
                          </tr>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <tr>
                      <td colSpan="2">No payments found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          )}

          {/* Button to add new expense */}
          <Button variant="success" onClick={() => setShowModal(true)} className="mt-4">
            Add New Expense
          </Button>

          {/* Modal for adding new expense */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="expenseAmount">
                  <Form.Label>Expense Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={newExpense}
                    onChange={(e) => setNewExpense(e.target.value)}
                    placeholder="Enter expense amount"
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleAddExpense}>
                  Add Expense
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}
