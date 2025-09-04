import { useAuth } from "../../contexts";
import { useState } from "react";
import { usePasswordValidation, useForm } from "../../hooks";
import { EditarUsuario, EditarSenha } from "../../services";
import style from "./PerfilPage.module.css";

export const PerfilPage = () => {
  const [loading, setLoading] = useState(false);
  const { user, isLoading, updateUser } = useAuth();
  const [edit, setEdit] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const { formData, setFormData, handleChange } = useForm({
    nome: user?.nome || '',
    email: user?.email || '',
  });
  const [senhaHash, setSenhaHash] = useState("");
  const [repeatSenhaHash, setRepeatSenhaHash] = useState("");
  const [repeatPasswordError, setRepeatSenhaHashError] = useState("");
  const { passwordRules, validateSenhaHashRules } = usePasswordValidation();

  if(isLoading){
    return <p>Carregando dados do usuário...</p>
  }

  if(!user){
    return <p>Por favor, faça o login.</p>
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);

    if (name === "senhaHash") {
        setSenhaHash(value);
      // Valida as regras da senha em tempo real
      validateSenhaHashRules(value);
      // Verifica a repetição da senha ao mesmo tempo
      if (repeatSenhaHash && value !== repeatSenhaHash) {
        setRepeatSenhaHashError("As senhas não conferem.");
      } else {
        setRepeatSenhaHashError("");
      }
    } else if (name === "repeatSenhaHash") {
      setRepeatSenhaHash(value);
      if (value !== senhaHash) {
        setRepeatSenhaHashError("As senhas não conferem.");
      } else {
        setRepeatSenhaHashError("");
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
        const updatedUser = await EditarUsuario( formData, user.id);
        updateUser(updatedUser)
        alert("Perfil atualizado com sucesso.");
    }catch(error){
        alert(`${error}`);
    } finally{
        setEdit(!edit);
        setLoading(false);
    }
  };

  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleEditPassword = () => {
    setEditPassword(!editPassword);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
        await EditarSenha(senhaHash, user.id);
        alert("Senha atualizada com sucesso.")
    }catch(error){
        alert(`erro: ${error}`)
    } finally{
        setEditPassword(!editPassword);
        setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dados do Usuário</h1>
      {!edit ? (
        <div className={style.container}>
          <h3>{user?.nome}</h3>
          <p>{user?.email}</p>
          <div className={style.buttonContainer}>
            <button onClick={handleEdit}>Editar Perfil</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={style.container}>
            <h2>1. Informações Pessoais</h2>
            <div className={style.formGroup}>
              <label htmlFor="nome">Nome completo:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className={style.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="contato@email.com.br"
                onChange={handleFormChange}
                value={formData.email}
                required
              />
            </div>

            <div className={style.buttonContainer}>
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.nome ||
                  !formData.email
                }
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </form>
      )}
      {editPassword ? (
        <div className={style.container}>
          <form onSubmit={handleSubmitPassword}>
            <div className={style.formGroup}>
              <label htmlFor="senhaHash">Nova Senha:</label>
              <input
                type="password"
                id="senhaHash"
                name="senhaHash"
                onChange={handleFormChange}
                value={senhaHash} 
                required
              />
              {/* Regras da senha */}
              <ul className={style.passwordRules}>
                <li
                  className={
                    passwordRules.minChars ? style.validRule : style.invalidRule
                  }
                >
                  Pelo menos 8 caracteres
                </li>
                <li
                  className={
                    passwordRules.oneUppercase
                      ? style.validRule
                      : style.invalidRule
                  }
                >
                  Pelo menos 1 letra maiúscula
                </li>
                <li
                  className={
                    passwordRules.oneLowercase
                      ? style.validRule
                      : style.invalidRule
                  }
                >
                  Pelo menos 1 letra minúscula
                </li>
                <li
                  className={
                    passwordRules.oneNumber
                      ? style.validRule
                      : style.invalidRule
                  }
                >
                  Pelo menos 1 número
                </li>
                <li
                  className={
                    passwordRules.oneSpecial
                      ? style.validRule
                      : style.invalidRule
                  }
                >
                  Pelo menos 1 caractere especial
                </li>
              </ul>
            </div>

            <div className={style.formGroup}>
              <label htmlFor="repeatSenhaHash">Repita a Senha:</label>
              <input
                type="password"
                id="repeatSenhaHash"
                name="repeatSenhaHash"
                onChange={handleFormChange}
                value={repeatSenhaHash}
                required
              />
              {repeatPasswordError && (
                <p className={style.errorText}>{repeatPasswordError}</p>
              )}
            </div>
            <div className={style.buttonContainer}>
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.senhaHash ||
                  !repeatSenhaHash
                }
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={style.buttonContainer}>
          <button onClick={handleEditPassword}>Editar Senha</button>
        </div>
      )}
    </div>
  );
};
