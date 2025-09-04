import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts";
import { FazerLogin } from '../../services';

import style from "./LoginForm.module.css";

export const LoginForm = ({ setIsCadastrado }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", senhaHash: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.(com|com\.br)$/;
    return regex.test(email);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError("E-mail inválido. Use um e-mail com @ e termine com .com ou .com.br");
      return;
    }

    setLoading(true);
    try {
      const responseData = await FazerLogin(formData); 
      
        login(responseData.token, responseData.usuario); 
        navigate('/');

    } catch (err) {
      setError(err.message || "Ocorreu um erro de rede. Tente novamente.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <form className={style.container} onSubmit={handleLogin}>
      <h1>Login</h1>
      <div className={style.formGroup}>
        <label>Email: </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className={style.formGroup}>
        <label>Senha: </label>
        <input
          type="password"
          name="senhaHash"
          value={formData.senhaHash}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p style={{ color: "red" }}>Erro ao fazer login: Email ou senha invalidos</p>}
      <div className={style.buttonContainer}> 
        <button type="submit" disabled={loading || !formData.email || !formData.senhaHash}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
      <div className={style.formGroup}>
        <Link className={style.cadastrar} onClick={() => setIsCadastrado(false)}>Ainda não é cadastrado? <small>clique aqui</small></Link>
      </div>
    </form>
  );
};
