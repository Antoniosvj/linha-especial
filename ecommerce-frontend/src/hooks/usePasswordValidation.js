import { useState } from 'react';

export const usePasswordValidation = () =>{
    // Novo estado para o status de cada regra da senha
    const [passwordRules, setPasswordRules] = useState({
        minChars: false,
        oneUppercase: false,
        oneLowercase: false,
        oneNumber: false,
        oneSpecial: false,
    });

    // Função para validar a senha em tempo real e atualizar o status das regras
    const validateSenhaHashRules = (password) => {
        const rulesStatus = {
            minChars: password.length >= 8,
            oneUppercase: /[A-Z]/.test(password),
            oneLowercase: /[a-z]/.test(password),
            oneNumber: /[0-9]/.test(password),
            oneSpecial: /[^A-Za-z0-9\s]/.test(password), // Caractere especial
        };
        setPasswordRules(rulesStatus); // Corrigido para 'setPasswordRules'

        // Retorna true se todas as regras forem cumpridas, false caso contrário
        return Object.values(rulesStatus).every(rule => rule === true);
    };

    return { passwordRules, validateSenhaHashRules };

}