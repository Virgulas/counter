import { Modal, Button } from 'react-bootstrap';

export default function Confirmation({
  message,
  setShowConfirmModal,
  confirmModal,
  handleDelete,
}) {
  return (
    <Modal
      className=""
      show={confirmModal}
      onHide={() => setShowConfirmModal(false)}
    >
      <Modal.Header closeButton className="modal-style">
        <Modal.Title>Confirmação</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-style">{message}</Modal.Body>
      <Modal.Footer className="modal-style">
        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Deletar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
