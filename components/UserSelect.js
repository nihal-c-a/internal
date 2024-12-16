import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Form } from 'react-bootstrap';

export default function UserSelect({ value, onChange }) {
  const [users, setUsers] = useState([]);

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
  }, []);

  return (
    <Form.Group controlId="userSelect">
      <Form.Label>Select Member</Form.Label>
      <Form.Control as="select" value={value} onChange={onChange}>
        <option value="">Choose a member</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}
