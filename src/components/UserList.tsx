// src/UserList.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../queries/supabaseClient';

interface User {
  id: string;
  username: string;
  name?: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from('users').select('id, username, name');

    if (error) {
      console.error("Error fetching users:", error);
      setError('Error loading users');
    } else {
      console.log("Fetched users:", data); // Debugging log
      setUsers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2 flex items-center space-x-4 bg-gray-100 p-2 rounded">
            <div className="text-lg font-medium">{user.name || user.username}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
