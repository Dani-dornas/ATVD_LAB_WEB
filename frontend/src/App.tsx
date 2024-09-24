import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
}

function App() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editedUsers, setEditedUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Inicializa 'editedUsers' apenas quando 'users' mudar, e apenas uma vez
    setEditedUsers(users);
  }, [users]);

  const handleInputChange = (id: string, field: string, value: string) => {
    setEditedUsers(
      editedUsers.map((user) =>
        user._id === id ? { ...user, [field]: value } : user
      )
    );
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/users", {
        name: nome,
        email: email,
      });
      setUsers([...users, response.data]);
      setNome("");
      setEmail("");
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleEditUser = async (id: string) => {
    try {
      // Encontra o usuário editado no estado 'editedUsers'
      const editedUser = editedUsers.find((user) => user._id === id);
  
      if (!editedUser) {
        console.error("Usuário não encontrado");
        return;
      }
  
      const { name, email } = editedUser;
  
      // Valida se os dados necessários estão presentes
      if (!id || !name || !email) {
        console.error("Missing required fields: id, name, or email");
        return;
      }
  
      // Envia os dados atualizados para o backend
      const response = await axios.put(`http://localhost:5000/api/users/${id}`, {
        name,
        email,
      });
  
      const updatedUser = response.data;
  
      // Atualiza a lista de usuários no estado com os dados atualizados
      setUsers(users.map((user) => (user._id === id ? updatedUser : user)));
  
      console.log("Usuário atualizado com sucesso");
    } catch (error) {
      console.error("Error updating user", error);
    }
  };
  

  return (
    <div className="App">
      <h1>Clientes</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleAddUser}>Cadastrar</button>
      </div>

      <div className="user-list">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <p>
              <strong>Nome:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Status:</strong> {user.status || "ATIVO"}
            </p>
            <button
              onClick={() => handleDeleteUser(user._id)}
              className="delete-btn"
            >
              <span role="img" aria-label="delete">
                ❌
              </span>
            </button>
          </div>
        ))}
      </div>

      <div className="user-list">
        {editedUsers.map((user) => (
          <div key={user._id} className="user-card">
            <input
              type="text"
              value={user.name}
              onChange={(e) =>
                handleInputChange(user._id, "name", e.target.value)
              }
            />
            <input
              type="text"
              value={user.email}
              onChange={(e) =>
                handleInputChange(user._id, "email", e.target.value)
              }
            />

            <button
              onClick={() => handleEditUser(user._id)}
              className="update-btn"
            >
              Atualizar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
