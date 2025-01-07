import { Table, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Confirmation from '../components/confirmation';
import {
  setUsersData,
  getUsersData,
  getWeekdayInPortuguese,
  setStoreOpenST,
} from './utils.mjs';
import ExportToPDF from '../components/export';

export default function Week() {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [daysDate, setDaysDate] = useState([]);
  const [days, setDays] = useState([]);
  const [professionalsData, setProfessionalsData] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [totalSumCa, setTotalSumCa] = useState(0);
  const [productsByUser, setProductsByUser] = useState({});
  const [debtsByUser, setDebtsByUser] = useState({});
  const [discountsByUser, setDiscountsByUser] = useState({});
  const [showConfirmCleanData, setShowConfirmCleanData] = useState(false);

  useEffect(() => {
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
        const daysDate = data.map((s) => s.id);
        const daysNames = data.map((s) => getWeekdayInPortuguese(s.id));
        setDaysDate(daysDate);
        setDays(daysNames);
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
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
        setUsersData(data);
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
    fetchStores();
  }, []);

  useEffect(() => {
    if (users.length && daysDate.length) {
      const calculateProfessionals = (user, date) => {
        const items = [
          ...(user.pix[date] || []),
          ...(user.card[date] || []),
          ...(user.cash[date] || []),
        ];

        let totals = { ca: 0, all: 0 };
        items.forEach((item) => {
          if (item?.caca) {
            totals.ca += Number(item.value);
            return;
          }
          totals.all += Number(item.value);
        });

        return totals;
      };

      const professionals = {};
      let overallSum = 0;
      let overallSumCa = 0;

      for (const user of users) {
        let userTotal = 0;
        let userTotalCa = 0;
        professionals[user.id] = daysDate.map((date) => {
          const value = calculateProfessionals(user, date);
          userTotal += value.all;
          userTotalCa += value.ca;
          return { all: value.all, ca: value.ca };
        });
        professionals[user.id].push({ all: userTotal, ca: userTotalCa }); // Add total for user
        overallSum += userTotal;
        overallSumCa += userTotalCa;
      }

      setProfessionalsData(professionals);
      setTotalSum(overallSum);
      setTotalSumCa(overallSumCa);
    }
  }, [users, daysDate]);

  useEffect(() => {
    if (stores.length) {
      const products = {};
      const debts = {};
      const discounts = {};

      for (const store of stores) {
        const date = store.id;

        // Organize products by seller
        for (const product of store.products || []) {
          if (!products[product.seller]) products[product.seller] = [];
          products[product.seller].push({ ...product, date });
        }

        // Organize debts by debtor
        for (const debt of store.debts || []) {
          if (!debts[debt.debtor]) debts[debt.debtor] = [];
          debts[debt.debtor].push({ ...debt, date });
        }

        // Organize discounts by debtor
        for (const discount of store.discounts || []) {
          if (!discounts[discount.debtor]) discounts[discount.debtor] = [];
          discounts[discount.debtor].push({ ...discount, date });
        }
      }

      setProductsByUser(products);
      setDebtsByUser(debts);
      setDiscountsByUser(discounts);
    }
  }, [stores]);

  const cleanStoresData = async (id) => {
    try {
      const response = await fetch(`/api/store/action/clean`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setStoreOpenST(false);
      setStores([]);
      setShowConfirmCleanData(false);
    } catch (error) {
      console.error('Error creating entries for user:', error);
    }
  };

  const confirmCleanData = () => {
    setShowConfirmCleanData(true);
  };

  return (
    <Container className="mt-4">
      <ExportToPDF />
      <Button variant="danger" onClick={() => confirmCleanData()}>
        Limpar dados
      </Button>
      <Row>
        <Col>
          <h4 className="text-center">Serviços padrão</h4>
          <Table striped bordered hover size="sm" className="table-dark">
            <thead>
              <tr>
                <th>Nome</th>
                {days.map((day, index) => (
                  <th key={index}>
                    {daysDate[index]} - {day}
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  {professionalsData[user.id]?.map((value, index) => (
                    <td key={index}>{value.all}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={daysDate.length + 1} className="text-end">
                  Total
                </td>
                <td>{totalSum}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4 className="text-center">Serviços CA</h4>
          <Table striped bordered hover size="sm" className="table-dark">
            <thead>
              <tr>
                <th>Nome</th>
                {days.map((day, index) => (
                  <th key={index}>
                    {daysDate[index]} - {day}
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  {professionalsData[user.id]?.map((value, index) => (
                    <td key={index}>{value.ca}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={daysDate.length + 1} className="text-end">
                  Total
                </td>
                <td>{totalSumCa}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4 className="text-center">Comissões</h4>
          <Table striped bordered hover size="sm" className="table-dark">
            <thead>
              <tr>
                <th>Nome</th>
                {days.map((day, index) => (
                  <th key={index}>
                    {daysDate[index]} - {day}
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  {professionalsData[user.id]?.map((value, index) => (
                    <td key={index}>{(value.all + value.ca) * 0.4}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4 className="text-center">Débitos</h4>
          <Table striped bordered hover size="sm" className="table-dark">
            <thead>
              <tr>
                <th>Devedor</th>
                {days.map((day, index) => (
                  <th key={index}>
                    {daysDate[index]} - {day}
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(debtsByUser).map(([debtorId, debts]) => {
                const user = { name: debtorId };
                const debtByDate = daysDate.map((date) =>
                  debts
                    .filter((debt) => debt.date === date)
                    .reduce((sum, d) => sum + Number(d.value), 0)
                );
                const totalDebt = debtByDate.reduce(
                  (sum, value) => sum + value,
                  0
                );

                return (
                  <tr key={debtorId}>
                    <td>{user.name}</td>
                    {debtByDate.map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                    <td>{totalDebt}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4 className="text-center">Débitos fora do caixa</h4>
          <Table striped bordered hover size="sm" className="table-dark">
            <thead>
              <tr>
                <th>Devedor</th>
                {days.map((day, index) => (
                  <th key={index}>
                    {daysDate[index]} - {day}
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(discountsByUser).map(([debtorId, debts]) => {
                const user = { name: debtorId };
                const debtByDate = daysDate.map((date) =>
                  debts
                    .filter((debt) => debt.date === date)
                    .reduce((sum, d) => sum + Number(d.value), 0)
                );
                const totalDebt = debtByDate.reduce(
                  (sum, value) => sum + value,
                  0
                );

                return (
                  <tr key={debtorId}>
                    <td>{user.name}</td>
                    {debtByDate.map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                    <td>{totalDebt}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4 className="text-center">Produtos por vendedor</h4>
          {Object.entries(productsByUser).map(([userId, products]) => {
            const user = { name: userId };
            return (
              <div key={userId} className="mb-4">
                <h5>{user.name}</h5>
                <Table striped bordered hover size="sm" className="table-dark">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index}>
                        <td>{product.date}</td>
                        <td>{product.desc}</td>
                        <td>{product.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            );
          })}
        </Col>
      </Row>
      <Confirmation
        message={`Tem certeza de que deseja limpar todos os dados?`}
        setShowConfirmModal={setShowConfirmCleanData}
        confirmModal={showConfirmCleanData}
        handleDelete={cleanStoresData}
      />
    </Container>
  );
}
