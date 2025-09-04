import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lógica para verificar o token no localStorage ao carregar
  useEffect(() => {
    const loadAuthData = () => {
      const token = localStorage.getItem("jwt_token");
      const storedUserData = localStorage.getItem("user_data");

      if (token && storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          if (user && typeof user === "object") {
            setIsLoggedIn(true);
            setUser(user);
            // console.log("AuthContext: Dados do usuário carregados do localStorage. isLoggedIn:", true,);
          } else {
            console.error("AuthContext: Dados do usuário no localStorage inválidos ou não são um objeto.", storedUserData);
            // Limpeza em caso de dados inválidos
            localStorage.removeItem("jwt_token");
            localStorage.removeItem("user_data");
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("AuthContext: Erro ao parsear dados do usuário do localStorage:", error);
          // Limpeza em caso de erro no parse
          localStorage.removeItem("jwt_token");
          localStorage.removeItem("user_data");
        }
      } 
      setIsLoading(false); 
    };

    loadAuthData();
  }, []); // Dependência vazia para rodar apenas uma vez na montagem

  const login = async (token, userObjectFromBackendResponse) => {
    if (
      !token ||
      !userObjectFromBackendResponse ||
      typeof userObjectFromBackendResponse !== "object"
    ) {
      console.error(
        "AuthContext: Tentativa de login com dados inválidos. Token ou objeto de usuário ausente/inválido:",
        { token, userObjectFromBackendResponse }
      );
      return;
    }

    //salva o token no localStorage
    localStorage.setItem("jwt_token", token);
    //salva o objeto usuario como json
    localStorage.setItem("user_data", JSON.stringify(userObjectFromBackendResponse));
    //atualiza o estado da aplicação
    setIsLoggedIn(true);
    setUser(userObjectFromBackendResponse);
  };

  const logout = () => {
    //remove dados do usuario e token
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("authToken");

    //limpa o estado da aplicação
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateUser = (updatedUser) =>{
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  const value = {
    user,
    isLoading,
    isLoggedIn,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
