import '../styles/professional.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'next/image';

function Professional({
  user,
  setPaymentMethod,
  setCaca,
  isCaca,
  setValue,
  paymentMethod,
  insertFieldValue,
  paymentsTotalValue,
  formatNumber,
}) {
  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <>
      <div className="professional">
        <Image
          src={user.picture}
          alt="A description of the image"
          width={40}
          height={40}
          className="p-img"
        />
        <h1 className="p-name">{user.name}</h1>
        <ul className="payments">
          <li className="payment ">
            <span className="fw-bold payments-name">Pix:</span>
            <span className="payments-total">
              R${' '}
              {paymentsTotalValue.pix
                ? formatNumber(paymentsTotalValue.pix)
                : '0'}
            </span>
          </li>
          <li className="payment">
            <span className="fw-bold payments-name">Cartão:</span>
            <span className="payments-total">
              R${' '}
              {paymentsTotalValue.card
                ? formatNumber(paymentsTotalValue.card)
                : '0'}
            </span>
          </li>
          <li className="payment">
            <span className="fw-bold payments-name">Dinhero:</span>
            <span className="payments-total">
              R${' '}
              {paymentsTotalValue.cash
                ? formatNumber(paymentsTotalValue.cash)
                : '0'}
            </span>
          </li>
          <li className="payment">
            <span className="fw-bold payments-name">Total:</span>
            <span className="payments-total">
              R${' '}
              {formatNumber(
                paymentsTotalValue.cash +
                  paymentsTotalValue.card +
                  paymentsTotalValue.pix
              )}
            </span>
          </li>
        </ul>
        <Form>
          <Form.Group className="fieldChoices">
            <Form.Select
              aria-label="Default select example"
              className="payment-select"
              data-bs-theme="dark"
              value={paymentMethod}
              onChange={handleChange}
            >
              <option value="">Forma de Pagamento</option>
              <option value="pix">Pix</option>
              <option value="card">Cartão</option>
              <option value="cash">Dinheiro</option>
            </Form.Select>
            <Form.Select
              aria-label="Default select example"
              className="payment-select"
              data-bs-theme="dark"
              onChange={(e) => setCaca(e.target.value)}
              value={isCaca}
            >
              <option value={false}>Padrão</option>
              <option value={true}>C.A</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Control
              className="payment-input"
              data-bs-theme="dark"
              type="number"
              placeholder="R$"
              onChange={(e) => setValue(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="payment-button"
            onClick={insertFieldValue}
          >
            Adicionar
          </Button>
        </Form>
      </div>
    </>
  );
}

export default Professional;
