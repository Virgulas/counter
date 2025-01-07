import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Day from './day';
import {
  updateUsersData,
  getDateKey,
  setUsersData,
  getUsersData,
  setStoreOpenST,
} from './utils.mjs';

function DayNav() {
  const [date, setDate] = useState(getDateKey());
  const [store, setStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [isStoreOpen, setStoreOpen] = useState(true);
  const [displayUsers, setDisplayUsers] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getDateKey = () => {
      const today = new Date();
      const options = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };

      const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(
        today
      );

      return formattedDate.replace(/\//g, '-');
    };
    const date = getDateKey();

    const fetchStores = async () => {
      try {
        const response = await fetch(`/api/store/action/getAllStores`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStores(data);
        if (data) {
          const todayStore = data.find((d) => d.id === date);
          if (todayStore) {
            setStore(todayStore);
            setStoreOpen(true);
            setStoreOpenST(true);
            setDisplayUsers(true);
          } else {
            setStoreOpen(false);
            setStoreOpenST(false);
          }
        } else {
          setStoreOpen(false);
          setStoreOpenST(false);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchUsers = async () => {
      const sessionUsers = getUsersData();
      if (sessionUsers) {
        setUsers(sessionUsers);
        return;
      }
      try {
        const response = await fetch(`/api/user/action/getAllUsers`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setUsersData(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
    fetchStores();
  }, []);

  const addNewStore = async (id) => {
    try {
      const response = await fetch(`/api/store/process/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStore(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const checkStore = async () => {
    if (!store) {
      await addNewStore(date);
      if (users) {
        users.forEach(async (u) => {
          if (!u.pix[date]) {
            await createDateEntries(u.id);
          }
        });
      }
      setStoreOpen(true);
      setStoreOpenST(true);
      setDisplayUsers(true);
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
      console.log('Created Entries for:', data);

      setUsers((prevUsers) => prevUsers.map((u) => (u.id === id ? data : u)));
      updateUsersData(data);
    } catch (error) {
      console.error('Error creating entries for user:', error);
    }
  };

  const startButton = (
    <Button onClick={() => checkStore()} variant="secondary">
      Iniciar dia{' '}
      {(() => {
        const [ano, mês, dia] = date.split('-');
        return dia + '/' + mês;
      })()}
    </Button>
  );

  const professionals = users
    .filter((u) => u.available)
    .map((u) => <Day user={u} date={date} key={u.id} />);

  const chunkedProfessionals = [];
  for (let i = 0; i < professionals.length; i += 2) {
    chunkedProfessionals.push(professionals.slice(i, i + 2));
  }

  return (
    <>
      {isStoreOpen ? '' : startButton}
      {displayUsers && chunkedProfessionals.length > 0 ? (
        <Tabs defaultActiveKey={0} id="professionals-tabs">
          {chunkedProfessionals.map((group, index) => {
            const tabTitle =
              group
                .map(
                  (professional) =>
                    users.find((u) => u.id === professional.key)?.name
                )
                .join(' & ') || `Tab ${index + 1}`;
            return (
              <Tab eventKey={index} title={tabTitle} key={index}>
                {group}
              </Tab>
            );
          })}
        </Tabs>
      ) : (
        ''
      )}
    </>
  );
}

export default DayNav;
