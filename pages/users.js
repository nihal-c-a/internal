import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Table, Container, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import { useRouter } from 'next/router'; // Importing useRouter for navigation

export default function Users() {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [userToDelete, setUserToDelete] = useState(null); // Store the user to delete
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('Error fetching users:', error.message);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, [message]);

  const handleCreateUser = async () => {
    if (!newUserName) {
      setMessage('Please enter a user name.');
      return;
    }

    const { data, error } = await supabase.from('users').insert([{ name: newUserName }]);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('User added successfully!');
      setNewUserName('');
    }
  };

  const handleEditUser = async () => {
    if (!editingUser.name) {
      setMessage('Please enter a user name.');
      return;
    }

    const { error } = await supabase.from('users').update({ name: editingUser.name }).eq('id', editingUser.id);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('User updated successfully!');
      setShowModal(false);
    }
  };

  const handleDeleteUser = async () => {
    const { error } = await supabase.from('users').delete().eq('id', userToDelete.id);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('User deleted successfully!');
      setShowDeleteModal(false); // Close the delete confirmation modal
    }
  };

  // Handle the back button click
  const handleBack = () => {
    router.push('/'); // Go back to the home page
  };

  return (
    <Container fluid>
      <Row className="justify-content-center my-4">
        <Col md={8}>
          <h2 className="text-center">Manage Members</h2>

          {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}

          {/* Back button with increased margin-right */}
          <Button variant="secondary" className="mb-3 mr-4" onClick={handleBack}>
            Back
          </Button>

          {/* Add New User button with larger gap */}
          <Button variant="primary" className="mb-3 mr-4" onClick={() => setShowModal(true)}>
            Add New Member
          </Button>

          <DataTable
            columns={['Member Name', 'Actions']}
            data={users.map((user) => ({
              name: user.name,
              actions: (
                <>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setEditingUser(user);
                      setShowModal(true);
                    }}
                    className="mr-3"  // Add margin-right to separate buttons
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => {
                      setUserToDelete(user); // Store the user to delete
                      setShowDeleteModal(true); // Show the delete confirmation modal
                    }} 
                    className="mr-3"
                  >
                    Delete
                  </Button>
                </>
              ),
            }))}
          />

          {/* Modal for editing user */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="userName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingUser ? editingUser.name : newUserName}
                    onChange={(e) =>
                      editingUser
                        ? setEditingUser({ ...editingUser, name: e.target.value })
                        : setNewUserName(e.target.value)
                    }
                    placeholder="Enter user name"
                  />
                </Form.Group>
                <Button variant="primary" onClick={editingUser ? handleEditUser : handleCreateUser}>
                  {editingUser ? 'Save Changes' : 'Add User'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Modal for confirming user deletion */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to delete this user?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteUser}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}
