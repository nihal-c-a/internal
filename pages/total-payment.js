import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Container, Row, Col, Form, Button, Alert, Table, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function UserTransactionsWithTotalPayment() {
  const [users, setUsers] = useState([]); // List of users
  const [selectedUser, setSelectedUser] = useState(''); // Selected user
  const [transactions, setTransactions] = useState([]); // User's transactions
  const [totalPayment, setTotalPayment] = useState(0); // Total payment for selected user
  const [newAmount, setNewAmount] = useState('');
  const [message, setMessage] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [error, setError] = useState(null); // Error state for handling issues
  const router = useRouter();

  useEffect(() => {
    // Fetch users to populate the dropdown
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('users').select('id, name');
        if (error) throw error;
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err.message);
        setError('Failed to load users. Please try again later.');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch transactions when a user is selected
    if (!selectedUser) return;

    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('id, amount, date, user_id')
          .eq('user_id', selectedUser)
          .order('date', { ascending: false });

        if (error) throw error;
        setTransactions(data);

        // Calculate total payment
        const total = data.reduce((sum, payment) => sum + payment.amount, 0);
        setTotalPayment(total);
      } catch (err) {
        console.error('Error fetching transactions:', err.message);
        setError('Failed to fetch transactions. Please try again later.');
      }
    };

    fetchTransactions();
  }, [selectedUser]);

  // Handle editing a transaction
  const handleEditTransaction = async (e, transactionId) => {
    e.preventDefault();

    if (!newAmount) {
      setMessage('Please enter a valid amount.');
      return;
    }

    const { error } = await supabase
      .from('payments')
      .update({ amount: parseFloat(newAmount) })
      .eq('id', transactionId);

    if (error) {
      setMessage(`Error updating transaction: ${error.message}`);
    } else {
      setMessage('Transaction updated successfully!');
      setNewAmount('');
      setEditingTransaction(null);
    }
  };

  // Handle deleting a transaction with confirmation
  const handleDeleteTransaction = async (transactionId) => {
    const confirmed = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', transactionId);

    if (error) {
      setMessage(`Error deleting transaction: ${error.message}`);
    } else {
      setMessage('Transaction deleted successfully!');
      setTransactions(transactions.filter((transaction) => transaction.id !== transactionId));
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={8}>
          <h2 className="text-center">Total payment by a member</h2>

          {/* Back Button */}
          <Button variant="secondary" onClick={() => router.push('/')} className="mb-4">
            Back 
          </Button>

          {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="p-4">
            <Form>
              {/* User Selection Dropdown */}
              <Form.Group controlId="userSelect">
                <Form.Label>Select Member</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedUser || ''}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select a Member</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Card>

          {/* Display Total Payment */}
          {selectedUser && totalPayment >= 0 && (
            <Card className="mt-4">
              <Card.Body>
                <h4 className="text-center">Total Payment: ₹{totalPayment}</h4>
              </Card.Body>
            </Card>
          )}

          {/* Display Transactions Table */}
          {selectedUser && transactions.length > 0 ? (
            <Table striped bordered hover responsive className="mt-4">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.amount}</td>
                    <td>{new Date(transaction.date).toLocaleString()}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="mr-2"
                        onClick={() => {
                          setEditingTransaction(transaction.id);
                          setNewAmount(transaction.amount);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteTransaction(transaction.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            selectedUser && <p>No transactions found for this user.</p>
          )}

          {/* Edit Transaction Form */}
          {editingTransaction && (
            <Form onSubmit={(e) => handleEditTransaction(e, editingTransaction)} className="mt-4">
              <Form.Group controlId="newAmount">
                <Form.Label>New Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Enter new amount"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditingTransaction(null)}
                className="ml-3"
              >
                Cancel
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}
