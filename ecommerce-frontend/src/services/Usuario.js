import axios from "axios";

const USERS_API_URL = `${import.meta.env.VITE_API_URL}usuarios`;

export const CadastrarUsuario = async (data) => {
    try {
        const response = await axios.post(`${USERS_API_URL}/cadastro`, data);
        return response.data;
    } catch (error) {
        console.error("Erro no serviço de cadastro de usuário:", error);
        throw error;
    }
};

export const FazerLogin = async (formData) =>{
    try{
        const email = formData.email;
        const senhaHash = formData.senhaHash;

        const response = await axios.post(`${USERS_API_URL}/login`, { email, senhaHash });
        return response.data;
    } catch (error){
        console.error(`Erro no serviço de login: ${error}`);
        throw error;
    }
};

export const EditarUsuario = async ( formData, id ) =>{
    try{
        const response = await axios.put(`${USERS_API_URL}/editar/${id}`, formData);
        return response.data;
    } catch (error){
        console.error(`Erro no serviço de editar o usuário: ${error}`);
        throw error;
    }
}

export const EditarSenha = async (senhaHash, id) =>{
    try{
        const response = await axios.put(`${USERS_API_URL}/editar_senha/${id}`, senhaHash);
        return response.data;
    } catch (error){
        console.error(`Erro ao editar senha. ${error}`);
        throw error;
    }
}