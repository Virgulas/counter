export default function CreateStore() {
    function getTime() {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const brazilOffset = -3; // Brazil is UTC-3

      const hours = (utcHours + brazilOffset + 24) % 24; // Adjust for 24-hour format
      const minutes = utcMinutes; 

      return `${hours}:` + `${minutes}`.padStart(2, '0');
    }
    const getDateKey = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
  const addStore = async (id) => {
      try {
        const response = await fetch(`/api/store/process/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Created store:', data);
      } catch (err) {
        console.error('Error creating store:', err);
      }
    };

    const updateStore = async (newValues, id) => {
      try {
        const response = await fetch(`/api/store/process/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newValues: newValues }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Updated store:', data);
      } catch (err) {
        console.error('Error updating store:', err);
      }
    };

    const deleteStore = async (id) => {
      try {
        const response = await fetch(`/api/store/process/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Deleted store:', data);
      } catch (err) {
        console.error('Error deleting store:', err);
      }
    };

    const getStore = async (id) => {
      try {
        const response = await fetch(`/api/store/process/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Found store:', data);
      } catch (err) {
        console.error('Error finding store:', err);
      }
    };

    const insertStoreDebt = async (debt, id) => {
      try {
        const response = await fetch(`/api/store/action/insertStoreDebt/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ debt: debt })
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Inserted:', data);
      } catch (err) {
        console.error('Error inserting data:', err);
      }
    };

    const insertStoreProduct = async (product, id) => {
      try {
        const response = await fetch(`/api/store/action/insertStoreProduct/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: product }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Inserted product:', data);
      } catch (err) {
        console.error('Error inserting product:', err);
      }
    };

    return (
    <>
      <button onClick={() => addStore(getDateKey())}>Create store</button>
      <button onClick={() => updateStore({ pix: 10 }, getDateKey())}>Update store</button>
      <button onClick={() => getStore(getDateKey())}>Get store</button>
      <button onClick={() => deleteStore(getDateKey())}>Delete store</button>
      <button onClick={() => insertStoreDebt({ value: 10, debtor: '2', payment: 'cash', time: getTime()}, getDateKey())}>insert Debt</button>
      <button onClick={() => insertStoreProduct({value: 12, time: getTime(), payment: 'pix', type: 'clothes', seller: '2'}, getDateKey())}>Insert Product</button>
    </>
    )
}