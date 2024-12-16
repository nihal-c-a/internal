import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function UserTransactions() {
  const [users, setUsers] = useState([]); // List of users
  const [selectedUser, setSelectedUser] = useState(''); // Selected user
  const [transactions, setTransactions] = useState([]); // User's transactions
  const [message, setMessage] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newAmount, setNewAmount] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, name');
      if (error) {
        setMessage(`Error fetching users: ${error.message}`);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  // Fetch transactions of the selected user
  useEffect(() => {
    if (!selectedUser) return;

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('id, amount, date, user_id')
        .eq('user_id', selectedUser)
        .order('date', { ascending: false });

      if (error) {
        setMessage(`Error fetching transactions: ${error.message}`);
      } else {
        setTransactions(data);
      }
    };

    fetchTransactions();
  }, [selectedUser]);

  // Handle selecting a user
  const handleUserSelect = (e) => {
    setSelectedUser(e.target.value);
    setMessage('');
  };

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
      setEditingTransaction(null); // Close the edit form
    }
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = async (transactionId) => {
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
          <h2 className="text-center">User Payment Transactions</h2>

          {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}

          {/* User Select Dropdown */}
          <Form.Group controlId="userSelect" className="mb-4">
            <Form.Label>Select User</Form.Label>
            <Form.Control as="select" value={selectedUser} onChange={handleUserSelect}>
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Display Transactions Table */}
          {selectedUser && transactions.length > 0 ? (
            <Table striped bordered hover responsive>
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

          {/* Back Button */}
          <Button variant="secondary" onClick={() => router.push('/')} className="mt-3">
            Back to Dashboard
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
