import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts";
import style from "./Header.module.css";
import { produtosService } from "../../services/ProdutosService";

export const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await produtosService.getCategoriasProdutos();
        setCategorias(data);
      } catch (err) {
        setError("Ocorreu um erro ao carregar as categorias.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  const handleLogout = () => {
    logout();
    handleOpenMenu();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Logica de busca");
  };

  const handleOpenMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return <p>Carregando categorias...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <header className={style.Header}>
      <section className={style.menuSuperior}>
        <div className={style.logo}>
          <Link to="/">
            <img src="/logo-branco.png" alt="Linha Especial" />
          </Link>
        </div>
        <div>
          <form onSubmit={handleSearch} className={style.formGroup}>
            <div className={style.formInput}>
              <input type="text" placeholder="O que você procura?" />
            </div>
            <div className={style.formButton}>
              <button type="submit">
                <img src="/magnifying-glass.png" alt="" />
              </button>
            </div>
          </form>
        </div>
        <div>
          {menuOpen && (
            <div className={style.containerMenu}>
              {!isLoggedIn ? (
                <Link to="/login">
                  <img src="/user.png" alt="" />
                  <p>Login</p>
                </Link>
              ) : (
                <div>
                  <Link to="/perfil" onClick={handleOpenMenu}>
                    <img src="/user.png" alt="" />
                    <p>Perfil</p>
                  </Link>
                  <button onClick={handleLogout}>Sair</button>
                </div>
              )}
              <Link to="/carrinho" onClick={handleOpenMenu}>
                <img src="/carrinho.png" alt="" />
                Carrinho
              </Link>
            </div>
          )}
          <div className={style.menuClose}>
            {isLoggedIn && <small>Olá, {user.nome.split(' ')[0]}</small>}
            <button onClick={handleOpenMenu}>
              <img src="/menu.png" alt="menu" />
            </button>
          </div>
        </div>
      </section>
      <section className={style.containerCategoria}>
        {categorias.map((categoria) => (
          <div key={categoria}>
            <Link className={style.link} to={`/categoria/${categoria}`}>
              {categoria}
            </Link>
          </div>
        ))}
      </section>
    </header>
  );
};
