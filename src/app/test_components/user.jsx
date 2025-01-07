export default function CreateUser() {
      function getTime() {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const brazilOffset = -3; // Brazil is UTC-3

        const hours = (utcHours + brazilOffset + 24) % 24; // Adjust for 24-hour format
        const minutes = utcMinutes; 

        return `${hours}:` + `${minutes}`.padStart(2, '0');
      }

    const addUser = async (name, id) => {
        try {
          const response = await fetch(`/api/user/process/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Created user:', data);
        } catch (err) {
          console.error('Error creating user:', err);
        }
      };

      const updateUser = async (newValues, id) => {
        try {
          const response = await fetch(`/api/user/process/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newValues: newValues }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Updated user:', data);
        } catch (err) {
          console.error('Error updating user:', err);
        }
      };

      const deleteUser = async (id) => {
        try {
          const response = await fetch(`/api/user/process/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Deleted user:', data);
        } catch (err) {
          console.error('Error deleting user:', err);
        }
      };

      const getUser = async (id) => {
        try {
          const response = await fetch(`/api/user/process/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Found user:', data);
        } catch (err) {
          console.error('Error finding user:', err);
        }
      };

      const getAllUsers = async () => {
        try {
          const response = await fetch(`/api/user/action/getAllUsers`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Found users:', data);
        } catch (err) {
          console.error('Error finding users:', err);
        }
      };

      const createDateEntries = async (id) => {
        try {
          const response = await fetch(`/api/user/action/createDateEntries/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Created to:', data);
        } catch (err) {
          console.error('Error creating data:', err);
        }
      };

      const insertFieldValue = async (id, field, value) => {
        try {
          const response = await fetch(`/api/user/action/insertFieldValue/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: field, value: value }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Updated user:', data);
        } catch (err) {
          console.error('Error updating user:', err);
        }
      };

      return (
      <>
        <button onClick={() => addUser('test', '2')}>Create User</button>
        <button onClick={() => updateUser({ name: 'tested' }, '2')}>Update User</button>
        <button onClick={() => getUser('2')}>Get User</button>
        <button onClick={() => deleteUser('2')}>Delete User</button>
        <button onClick={() => createDateEntries('2')}>Create Entries</button>
        <button onClick={() => insertFieldValue('2', 'pix', {value: 12, time: getTime(), path: '/path/image'})}>Insert values</button>
      </>
      )
}