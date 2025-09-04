import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { CadastrarUsuario } from '../../services';
import { usePasswordValidation, useForm } from '../../hooks';
import style from './cadastroUsuario.module.css';

export const CadastroUsuario = ({ setIsCadastrado }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { formData, setFormData, handleChange } = useForm({
        nome: "",
        email: "",
        senhaHash: ""
    });
    const [repeatSenhaHash, setRepeatSenhaHash] = useState("");
    const [repeatPasswordError, setRepeatSenhaHashError] = useState(""); 

    const {passwordRules, validateSenhaHashRules} = usePasswordValidation();

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        handleChange(e);

        if (name === "senhaHash") {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
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
            if (value !== formData.senhaHash) { 
                setRepeatSenhaHashError("As senhas não conferem.");
            } else {
                setRepeatSenhaHashError("");
            }
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação final de todas as regras da senha
        const isPasswordValid = validateSenhaHashRules(formData.senhaHash);
        if (!isPasswordValid) {
            alert("Por favor, preencha todos os requisitos da senha.");
            return;
        }

        // Validar se as senhas conferem
        if (formData.senhaHash !== repeatSenhaHash) {
            setRepeatSenhaHashError("As senhas não conferem.");
            return;
        } else {
            setRepeatSenhaHashError("");
        }

        setLoading(true);
        try {
            await CadastrarUsuario(formData);
            setFormData({
                 nome: "",
                 email: "",
                 senhaHash: "",
            });
            setRepeatSenhaHash("");
            setIsCadastrado(true);
            navigate('/login')
        } catch (error) {
            alert(`Erro ao cadastrar usuário: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={style.container}>
                <form onSubmit={handleSubmit}>
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

                    <div className={style.formGroup}>
                        <label htmlFor="senhaHash">Senha:</label>
                        <input
                            type="password"
                            id="senhaHash"
                            name="senhaHash"
                            onChange={handleFormChange}
                            value={formData.senhaHash} // Corrigido para 'formData.senhaHash'
                            required
                        />
                        {/* Regras da senha */}
                        <ul className={style.passwordRules}>
                            <li className={passwordRules.minChars ? style.validRule : style.invalidRule}>
                                Pelo menos 8 caracteres
                            </li>
                            <li className={passwordRules.oneUppercase ? style.validRule : style.invalidRule}>
                                Pelo menos 1 letra maiúscula
                            </li>
                            <li className={passwordRules.oneLowercase ? style.validRule : style.invalidRule}>
                                Pelo menos 1 letra minúscula
                            </li>
                            <li className={passwordRules.oneNumber ? style.validRule : style.invalidRule}>
                                Pelo menos 1 número
                            </li>
                            <li className={passwordRules.oneSpecial ? style.validRule : style.invalidRule}>
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
                        {repeatPasswordError && <p className={style.errorText}>{repeatPasswordError}</p>}
                    </div>

                    <div className={style.buttonContainer}>
                        <button type="submit" disabled={loading || !formData.nome || !formData.email || !formData.senhaHash || !repeatSenhaHash}>
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </form>
                <div className={style.formGroup}>
                    <Link className={style.cadastrar} onClick={() => setIsCadastrado(true)}>Ja é cadastrado? <small>clique aqui</small></Link>
                </div>
            </div>

        </>
    );
};