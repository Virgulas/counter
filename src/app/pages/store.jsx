import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import Confirmation from '../components/confirmation';
import {
  getDateKey,
  getUsersData,
  setUsersData,
  getTransactions,
  formatNumber,
  productData,
  getTime,
  discountData,
  debtData,
  getStoreOpenST,
} from './utils.mjs';

export default function Store() {
  const [date, setDate] = useState(getDateKey());
  const [store, setStore] = useState({});
  const [users, setUsers] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [productSeller, setProductSeller] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPaymentType, setProductPaymentType] = useState('');
  const [productValue, setProductValue] = useState('');
  const [showConfirmModalProduct, setShowConfirmModalProduct] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [debtor, setDebtor] = useState('');
  const [debtDesc, setDebtDesc] = useState('');
  const [debtType, setDebtType] = useState('');
  const [debtValue, setDebtValue] = useState('');
  const [showConfirmModalDebt, setShowConfirmModalDebt] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState(null);
  const [debtorDs, setDebtorDs] = useState('');
  const [debtDescDs, setDebtDescDs] = useState('');
  const [debtTypeDs, setDebtTypeDs] = useState('');
  const [debtValueDs, setDebtValueDs] = useState('');
  const [showConfirmModalDebtDs, setShowConfirmModalDebtDs] = useState(false);
  const [debtToDeleteDs, setDebtToDeleteDs] = useState(null);

  const paymentNames = { pix: 'pix', card: 'cartão', cash: 'dinheiro' };
  const paymentTypes = ['card', 'cash', 'pix'];
  const paymentNamesDs = {
    pix: 'pix',
    card: 'cartão',
    cash: 'dinheiro',
    product: 'produto',
  };
  const paymentTypesDs = ['card', 'cash', 'pix', 'product'];

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

      // Return in the format yyyy-MM-dd
      return formattedDate.replace(/\//g, '-');
    };
    const date = getDateKey();

    const fetchStore = async () => {
      if (getStoreOpenST() == 'false') return;
      try {
        const response = await fetch(`/api/store/process/${date}`, {
          method: 'GET',
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
    const fetchUsers = async () => {
      const sessionUsers = getUsersData();
      if (sessionUsers) {
        setUsers(sessionUsers);
        setProfessionals(getTransactions(sessionUsers, date));
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
        setProfessionals(getTransactions(data, date));
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchStore();
    fetchUsers();
  }, []);

  const insertStoreProduct = async () => {
    if (!productValue || !productSeller || !productPaymentType) return;
    const seller = users.find((u) => u.id === productSeller);
    try {
      const response = await fetch(
        `/api/store/action/insertStoreProduct/${date}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: productData(
              productValue,
              productDesc,
              productPaymentType,
              seller?.name,
              getTime()
            ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStore(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const confirmDeleteProduct = (id) => {
    setProductToDelete(id);
    setShowConfirmModalProduct(true);
  };

  const confirmDeleteDebt = (id) => {
    setDebtToDelete(id);
    setShowConfirmModalDebt(true);
  };

  const confirmDeleteDiscount = (id) => {
    setDebtToDeleteDs(id);
    setShowConfirmModalDebtDs(true);
  };

  const deleteProduct = async () => {
    if (!productToDelete || !store) return;

    const filterValue = store?.products.filter((p) => p.id != productToDelete);
    const storeNewValue = { products: [...filterValue] };

    try {
      const response = await fetch(`/api/store/process/${date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newValues: storeNewValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStore(data);
      setShowConfirmModalProduct(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteDebt = async () => {
    if (!debtToDelete || !store) return;

    const filterValue = store?.debts.filter((d) => d.id != debtToDelete);
    const storeNewValue = { debts: [...filterValue] };

    try {
      const response = await fetch(`/api/store/process/${date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newValues: storeNewValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStore(data);
      setShowConfirmModalDebt(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const discountDelete = async () => {
    if (!debtToDeleteDs || !store) return;

    const filterValue = store?.discounts.filter((d) => d.id != debtToDeleteDs);
    const storeNewValue = { discounts: [...filterValue] };

    try {
      const response = await fetch(`/api/store/process/${date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newValues: storeNewValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStore(data);
      setShowConfirmModalDebtDs(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const insertStoreDebt = async () => {
    if (!debtValue || !debtor || !debtType) return;
    const userDebtor = users.find((u) => u.id === debtor);
    try {
      const response = await fetch(
        `/api/store/action/insertStoreDebt/${date}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            debt: debtData(
              debtValue,
              debtDesc,
              debtType,
              userDebtor?.name,
              getTime()
            ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStore(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const insertStoreDiscount = async () => {
    if (!debtValueDs || !debtorDs || !debtTypeDs) return;
    const userDebtor = users.find((u) => u.id === debtorDs);
    try {
      const response = await fetch(
        `/api/store/action/insertStoreDiscount/${date}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            discount: discountData(
              debtValueDs,
              debtDescDs,
              debtTypeDs,
              userDebtor?.name,
              getTime()
            ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStore(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const calculateProfessionals = (items) => {
    const totals = { card: 0, cash: 0, pix: 0, all: 0 };
    items.forEach((item) => {
      if (item?.caca) return;
      totals[item.paymentType] += Number(item.value);
      totals.all += Number(item.value);
    });
    return totals;
  };

  const calculateProducts = (items) => {
    if (items == undefined) return;
    const totals = { card: 0, cash: 0, pix: 0, all: 0 };
    items.forEach((item) => {
      totals[item.type] += Number(item.value);
      totals.all += Number(item.value);
    });
    return totals;
  };

  return (
    <Container
      className="mt-4 text-light"
      style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
      }}
    >
      <Row className="">
        <Col>
          <div className="mt-3 text-start">
            <h4>Entradas</h4>
            <p className="font-monospace">
              <span className="fw-bold">Cartão: </span>
              {formatNumber(
                calculateProducts(store?.products)?.card +
                  calculateProfessionals(professionals).card
              )}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Dinheiro: </span>
              {formatNumber(
                calculateProducts(store?.products)?.cash +
                  calculateProfessionals(professionals).cash
              )}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Pix: </span>
              {formatNumber(
                calculateProducts(store?.products)?.pix +
                  calculateProfessionals(professionals).pix
              )}
            </p>
            <p className="font-monospace text-decoration-underline">
              <span className="fw-bold">Total: </span>
              {formatNumber(
                calculateProducts(store?.products)?.all +
                  calculateProfessionals(professionals).all
              )}
            </p>
          </div>
        </Col>
        <Col>
          <div className="mt-3 text-start">
            <h4>Saídas</h4>
            <p className="font-monospace">
              <span className="fw-bold">Cartão: </span>
              {formatNumber(-calculateProducts(store?.debts)?.card)}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Dinheiro: </span>
              {formatNumber(-calculateProducts(store?.debts)?.cash)}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Pix: </span>
              {formatNumber(-calculateProducts(store?.debts)?.pix)}
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        {/* Products */}
        <Col lg={6}>
          <h4>Produtos</h4>
          <Form className="mb-3">
            <Row>
              <Col>
                <Form.Control
                  type="number"
                  onChange={(e) => setProductValue(e.target.value)}
                  placeholder="R$"
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Descrição"
                />
              </Col>
              <Col>
                <Form.Select
                  onChange={(e) => setProductPaymentType(e.target.value)}
                >
                  <option value="">Forma de Pagamento</option>
                  {paymentTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {paymentNames[type]}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select onChange={(e) => setProductSeller(e.target.value)}>
                  <option value="">Vendedor</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Button onClick={insertStoreProduct} variant="success">
                  Adicionar
                </Button>
              </Col>
            </Row>
          </Form>
          <div
            className="overflow-scroll"
            style={{ maxHeight: '300px', minHeight: '300px' }}
          >
            <Table striped bordered hover variant="dark" className="mb-0">
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Pagamento</th>
                  <th>Forma</th>
                  <th>Descrição</th>
                  <th>Horário</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {store.products?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.seller}</td>
                    <td>{formatNumber(item.value)}</td>
                    <td>{paymentNames[item.type]}</td>
                    <td>{item.desc}</td>
                    <td>{item.time}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDeleteProduct(item.id)}
                      >
                        Apagar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="mt-3 text-start">
            <p className="font-monospace">
              <span className="fw-bold">Cartão: </span>
              {formatNumber(calculateProducts(store?.products)?.card)}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Dinheiro: </span>
              {formatNumber(calculateProducts(store?.products)?.cash)}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Pix: </span>
              {formatNumber(calculateProducts(store?.products)?.pix)}
            </p>
            <p className="font-monospace text-decoration-underline">
              <span className="fw-bold">Total: </span>
              {formatNumber(calculateProducts(store?.products)?.all)}
            </p>
          </div>
        </Col>

        {/* Debts */}
        <Col lg={6}>
          <h4>Débitos</h4>
          <Form className="mb-3">
            <Row>
              <Col>
                <Form.Control
                  type="number"
                  onChange={(e) => setDebtValue(e.target.value)}
                  placeholder="R$"
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  onChange={(e) => setDebtDesc(e.target.value)}
                  placeholder="Descrição"
                />
              </Col>
              <Col>
                <Form.Select onChange={(e) => setDebtType(e.target.value)}>
                  <option value="">Forma de Pagamento</option>
                  {paymentTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {paymentNames[type]}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select onChange={(e) => setDebtor(e.target.value)}>
                  <option value="">Devedor</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Button onClick={insertStoreDebt} variant="success">
                  Adicionar
                </Button>
              </Col>
            </Row>
          </Form>
          <div
            className="overflow-scroll"
            style={{ maxHeight: '300px', minHeight: '300px' }}
          >
            <Table striped bordered hover variant="dark" className="mb-0">
              <thead>
                <tr>
                  <th>Devedor</th>
                  <th>Pagamento</th>
                  <th>Forma</th>
                  <th>Descrição</th>
                  <th>Horário</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {store.debts?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.debtor}</td>
                    <td>{formatNumber(item.value)}</td>
                    <td>{paymentNames[item.type]}</td>
                    <td>{item.desc}</td>
                    <td>{item.time}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDeleteDebt(item.id)}
                      >
                        Apagar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="mt-3 text-start">
            <p className="font-monospace">
              <span className="fw-bold">Cartão: </span>
              {formatNumber(-calculateProducts(store?.debts)?.card)}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Dinheiro: </span>
              {formatNumber(-calculateProducts(store?.debts)?.cash)}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Pix: </span>
              {formatNumber(-calculateProducts(store?.debts)?.pix)}
            </p>
            <p className="font-monospace text-decoration-underline">
              <span className="fw-bold">Total: </span>
              {formatNumber(-calculateProducts(store?.debts)?.all)}
            </p>
          </div>
        </Col>
      </Row>

      {/* Professionals */}
      <Row className="mt-4">
        <Col lg={6}>
          <h4>Débitos fora do caixa</h4>
          <Form className="mb-3">
            <Row>
              <Col>
                <Form.Control
                  type="number"
                  onChange={(e) => setDebtValueDs(e.target.value)}
                  placeholder="R$"
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  onChange={(e) => setDebtDescDs(e.target.value)}
                  placeholder="Descrição"
                />
              </Col>
              <Col>
                <Form.Select onChange={(e) => setDebtTypeDs(e.target.value)}>
                  <option value="">Forma de Pagamento</option>
                  {paymentTypesDs.map((type, index) => (
                    <option key={index} value={type}>
                      {paymentNamesDs[type]}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select onChange={(e) => setDebtorDs(e.target.value)}>
                  <option value="">Devedor</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Button onClick={insertStoreDiscount} variant="success">
                  Adicionar
                </Button>
              </Col>
            </Row>
          </Form>
          <div
            className="overflow-scroll"
            style={{ maxHeight: '300px', minHeight: '300px' }}
          >
            <Table striped bordered hover variant="dark" className="mb-0">
              <thead>
                <tr>
                  <th>Devedor</th>
                  <th>Pagamento</th>
                  <th>Forma</th>
                  <th>Descrição</th>
                  <th>Horário</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {store.discounts?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.debtor}</td>
                    <td>{formatNumber(item.value)}</td>
                    <td>{paymentNamesDs[item.type]}</td>
                    <td>{item.desc}</td>
                    <td>{item.time}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDeleteDiscount(item.id)}
                      >
                        Apagar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h4>Profissionais</h4>
          <div className="overflow-scroll" style={{ maxHeight: '300px' }}>
            <Table striped bordered hover variant="dark" className="mb-0">
              <thead>
                <tr>
                  <th>Profissional</th>
                  <th>Pagamento</th>
                  <th>Forma</th>
                  <th>Tipo</th>
                  <th>Horário</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{formatNumber(item.value)}</td>
                    <td>{paymentNames[item.paymentType]}</td>
                    <td>{item?.caca ? 'C.A' : 'Padrão'}</td>
                    <td>{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="mt-3 text-start">
            <p className="font-monospace">
              <span className="fw-bold">Cartão: </span>
              {formatNumber(calculateProfessionals(professionals).card)}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Dinheiro: </span>
              {formatNumber(calculateProfessionals(professionals).cash)}
            </p>
            <p className="font-monospace">
              <span className="fw-bold">Pix: </span>
              {formatNumber(calculateProfessionals(professionals).pix)}
            </p>
            <p className="font-monospace text-decoration-underline">
              <span className="fw-bold">Total: </span>
              {formatNumber(calculateProfessionals(professionals).all)}
            </p>
          </div>
        </Col>
      </Row>
      <Confirmation
        message={`Tem certeza de que deseja deletar o produto?`}
        setShowConfirmModal={setShowConfirmModalProduct}
        confirmModal={showConfirmModalProduct}
        handleDelete={deleteProduct}
      />
      <Confirmation
        message={`Tem certeza de que deseja deletar o déibto?`}
        setShowConfirmModal={setShowConfirmModalDebt}
        confirmModal={showConfirmModalDebt}
        handleDelete={deleteDebt}
      />
      <Confirmation
        message={`Tem certeza de que deseja deletar o desconto?`}
        setShowConfirmModal={setShowConfirmModalDebtDs}
        confirmModal={showConfirmModalDebtDs}
        handleDelete={discountDelete}
      />
    </Container>
  );
}
