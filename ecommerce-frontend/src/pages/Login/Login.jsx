import React, { useState } from "react";
import { CadastroUsuario, LoginForm} from "../../components";

export const LoginPage = () => {
  const [isCadastrado, setIsCadastrado] = useState(true);

  return (
    <main>
      {isCadastrado ? (
        <LoginForm setIsCadastrado={setIsCadastrado} />
      ) : (
        <CadastroUsuario setIsCadastrado={setIsCadastrado} />
      )}
    </main>
  );
};