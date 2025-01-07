import { useState, useEffect, useRef } from 'react';
import {
  Form,
  Button,
  ListGroup,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from 'react-bootstrap';
import {
  updateUsersData,
  removeUsersData,
  addUsersData,
  setUsersData,
  getUsersData,
  encodeEmailToAscii,
  isValidEmail,
} from './utils.mjs';
import ImageUpload from '../components/upload';
import Confirmation from '../components/confirmation';
import '../styles/register.css';

const RegistrationPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [keyU, setKeyUp] = useState(0);

  // Fetch all users when the component loads
  useEffect(() => {
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
  }, []);

  const resetForm = () => {
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setFile(null);
    setImageUrl('');
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

  const createUser = async () => {
    if (!email || !name) {
      setError('Você precisa inserir o email e o nome.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Coloque um endereço de email válido.');
      return;
    }

    let proceed = true;

    users.forEach((u) => {
      if (u.id === encodeEmailToAscii(email)) {
        setError('Endereço de email já existe no sistema.');
        proceed = false;
        return;
      }
      if (u.name.toLowerCase() === name.toLowerCase()) {
        setError('Use nomes únicos para cada profissional.');
        proceed = false;
        return;
      }
    });

    if (!proceed) {
      return;
    }

    const id = encodeEmailToAscii(email);
    let picture = '/empty.jpg';

    if (imageUrl) {
      picture = imageUrl;
      resetForm();
      setKeyUp((prevKey) => prevKey + 1);
    }

    try {
      const response = await fetch(`/api/user/process/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, picture }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);
      addUsersData(newUser);
      await createDateEntries(newUser.id);
      setName('');
      setEmail('');
      setError(null);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const toggleAvailability = async (user) => {
    const updatedUser = { ...user, available: !user.available };

    try {
      const response = await fetch(`/api/user/process/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newValues: updatedUser }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
      );
      updateUsersData(updatedUser);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/user/process/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Deleted user:', data);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );
      removeUsersData(data);
      console.log(getUsersData());
      setUserToDelete(null);
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      <Form className="mb-4 register form">
        <Row className="align-items-center form-row">
          <Col xs={12} md={3} className="mb-2 mb-md-0">
            <ImageUpload
              setImageUrl={setImageUrl}
              fileInputRef={fileInputRef}
              file={file}
              setFile={setFile}
              imageUrl={imageUrl}
              key={keyU}
            />
          </Col>
          <Col xs={12} md={3} className="mb-2 mb-md-0">
            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={2} className="mb-2 mb-md-0">
            <Form.Group controlId="formName">
              <Form.Control
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={2}>
            <Button
              variant="primary"
              className="w-100 p-1"
              onClick={createUser}
            >
              Cadastrar
            </Button>
          </Col>
        </Row>
      </Form>
      <h2 className="mb-3 title">Profissionais</h2>
      {users.length === 0 ? (
        <p className="emptylist">Nenhum profissional adicionado ainda.</p>
      ) : (
        <ListGroup className="users">
          {users.map((user) => (
            <ListGroup.Item
              key={user.id}
              className="d-flex justify-content-between align-items-center user-container"
            >
              <div>
                <strong>{user.name}</strong> -{' '}
                <span
                  className={user.available ? 'text-success' : 'text-danger'}
                >
                  {user.available ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
              <div>
                <Button
                  variant={user.available ? 'danger' : 'success'}
                  className="me-2"
                  onClick={() => toggleAvailability(user)}
                >
                  {user.available ? 'Desativar' : 'Reativar'}
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => confirmDeleteUser(user)}
                >
                  Deletar
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Confirmation
        message={`Tem certeza de que deseja deletar ${userToDelete?.name}?`}
        setShowConfirmModal={setShowConfirmModal}
        confirmModal={showConfirmModal}
        handleDelete={handleDeleteUser}
      />
    </Container>
  );
};

export default RegistrationPage;
