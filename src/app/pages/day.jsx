import Professional from '../components/professional';
import Confirmation from '../components/confirmation';
import { CloseButton, Button, ListGroup, Badge } from 'react-bootstrap';
import { useState } from 'react';
import {
  pixFieldData,
  ccFieldData,
  getTime,
  updateUsersData,
  generateUniqueId,
} from './utils.mjs';
import '../styles/day.css';

const getPaymentsTotalValue = (user, date) => {
  return {
    pix: user.pix[date]?.reduce((p, n) => Number(p) + Number(n.value), 0),
    card: user.card[date]?.reduce((p, n) => Number(p) + Number(n.value), 0),
    cash: user.cash[date]?.reduce((p, n) => Number(p) + Number(n.value), 0),
  };
};

function Day({ user, date }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentValue, setValue] = useState(0);
  const [isCaca, setCaca] = useState(false);
  const [userLocal, setUserLocal] = useState(user);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [valueToDelete, setValueToDelete] = useState(null);
  const [paymentsTotalValue, setPaymentsTotalValue] = useState(
    getPaymentsTotalValue(user, date)
  );

  const insertFieldValue = async () => {
    if (!currentValue || currentValue <= 0 || !paymentMethod) {
      return;
    }
    try {
      const response = await fetch(
        `/api/user/action/insertFieldValue/${user.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            field: paymentMethod,
            value:
              paymentMethod == 'pix'
                ? pixFieldData(
                    currentValue,
                    getTime(),
                    generateUniqueId(),
                    isCaca
                  )
                : ccFieldData(
                    currentValue,
                    getTime(),
                    generateUniqueId(),
                    isCaca
                  ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      updateUsersData(data);
      setUserLocal(data);
      setPaymentsTotalValue(getPaymentsTotalValue(data, date));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const confirmDeleteValue = (value, type) => {
    setValueToDelete({ user: userLocal, value: value, type: type });
    setShowConfirmModal(true);
  };

  const deleteFieldValue = async () => {
    const { user, value, type } = valueToDelete;

    const filterValue = user[type][date].filter((ar) => ar.vId != value.vId);
    const userNewValue = { [type]: { ...user[type], [date]: filterValue } };

    try {
      const response = await fetch(`/api/user/process/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newValues: userNewValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateUsersData(data);
      setUserLocal(data);
      setPaymentsTotalValue(getPaymentsTotalValue(data, date));
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const setPathToTrue = async (value, type) => {
    const mapValue = userLocal[type][date].map((ar) => {
      if (ar?.vId === value?.vId) {
        let newV = Object.assign(value, { path: !value.path });
        return newV;
      } else {
        return ar;
      }
    });
    const userNewValue = { [type]: { ...user[type], [date]: mapValue } };

    try {
      const response = await fetch(`/api/user/process/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newValues: userNewValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateUsersData(data);
      setUserLocal(data);
      setPaymentsTotalValue(getPaymentsTotalValue(data, date));
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  function formatNumber(num) {
    if (!num) return;
    let str = num.toString();

    // Check if the string already ends with ",00"
    if (!str.includes(',')) {
      return str + ',00';
    }

    return str;
  }

  return (
    <>
      <div className="container-pday">
        <Professional
          setCaca={setCaca}
          isCaca={isCaca}
          formatNumber={formatNumber}
          paymentsTotalValue={paymentsTotalValue}
          user={user}
          paymentMethod={paymentMethod}
          insertFieldValue={insertFieldValue}
          setPaymentMethod={setPaymentMethod}
          setValue={setValue}
        />

        <ListGroup as="ol" className="list-gp" horizontal>
          {userLocal['pix'][date]
            ? userLocal['pix'][date].map((d, i) => (
                <ListGroup.Item
                  className="d-flex justify-content-between align-items-start list-gp-item--pix"
                  key={d.vId}
                >
                  <div data-bs-theme="dark" className="me-auto">
                    <CloseButton
                      onClick={() => confirmDeleteValue(d, 'pix')}
                      className="payment-delete-btn"
                    />
                    <Badge bg="primary ms-1 badge-pix" pill>
                      Pix
                    </Badge>
                    <div className="fw-bold value-pix">
                      R$ {formatNumber(d.value)}
                    </div>
                    <small className="fw-bold time-pix">{d.time}</small>
                    <Button
                      variant={`${d.path ? 'success' : 'danger'}`}
                      onClick={() => setPathToTrue(d, 'pix')}
                      className="btn-pix"
                    >
                      Comprovante
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            : ''}
        </ListGroup>
        <ListGroup as="ol" className="list-gp" horizontal>
          {userLocal.card[date]
            ? userLocal.card[date].map((d, i) => {
                return (
                  <ListGroup.Item
                    className="d-flex justify-content-between align-items-start list-gp-item"
                    key={d.vId}
                  >
                    <div data-bs-theme="dark" className="me-auto">
                      <CloseButton
                        onClick={() => confirmDeleteValue(d, 'card')}
                        className="payment-delete-btn"
                      />
                      <Badge bg="primary ms-1 badge" pill>
                        Cartão
                      </Badge>
                      <div className="fw-bold value">
                        R$ {formatNumber(d.value)}
                      </div>
                      <small className="fw-bold time">{d.time}</small>
                    </div>
                  </ListGroup.Item>
                );
              })
            : ''}
        </ListGroup>
        <ListGroup as="ol" className="list-gp" horizontal>
          {userLocal.cash[date]
            ? userLocal.cash[date].map((d, i) => {
                return (
                  <ListGroup.Item
                    className="d-flex justify-content-between align-items-start list-gp-item"
                    key={d.vId}
                  >
                    <div data-bs-theme="dark" className="me-auto">
                      <CloseButton
                        onClick={() => confirmDeleteValue(d, 'cash')}
                        className="payment-delete-btn"
                      />
                      <Badge bg="primary ms-1 badge" pill>
                        Dinheiro
                      </Badge>
                      <div className="fw-bold value">
                        R$ {formatNumber(d.value)}
                      </div>
                      <small className="fw-bold time">{d.time}</small>
                    </div>
                  </ListGroup.Item>
                );
              })
            : ''}
        </ListGroup>
      </div>
      <Confirmation
        message={`Tem certeza de que deseja deletar o pagamento de ${valueToDelete?.value?.value} reais no ${valueToDelete?.type}?`}
        setShowConfirmModal={setShowConfirmModal}
        confirmModal={showConfirmModal}
        handleDelete={deleteFieldValue}
      />
    </>
  );
}

export default Day;
