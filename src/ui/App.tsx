import "./App.css";
import { useNavigate } from "react-router";
import trophy from "./assets/images/trophy1.png";
import { useStore } from "./lib/store";
import { useEffect, useState } from "react";

type userType = {
  id: string;
  name: string;
  email: string;
  role: string;
};
function App() {
  const { token, setToken } = useStore();
  const navigate = useNavigate();
  const [user, setUser] = useState<userType | null>(null);

  useEffect(() => {
    const getUser = async () => {
      fetch(`http://${window.location.hostname}:3000/api/auth/list`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data.user);
          // console.log(data);
        })
        .catch((error) => console.error("Erreur:", error));
    };
    getUser();
  }, []);

  // useEffect(() => {
  //   const getToken = () => {
  //     const tok = localStorage.getItem("token");
  //     if (tok) {
  //       setToken(tok);
  //       // navigate("/admin");
  //     } else {
  //       setToken(null);
  //     }
  //   };
  //   getToken();
  // }, [setToken]);

  // console.log({ token });

  const logOut = async () => {
    localStorage.removeItem("token");
    setToken(null);
    // navigate("/");
  };

  return (
    <main className="home-main">
      {/* header */}
      <header className="home-header">
        <div className="home-header-container">
          <h1 className="logo">Nahoot!</h1>

          <div className="nav-links">
            <button onClick={() => navigate("/admin/dashboard")} type="button">
              Admin
            </button>

            <button onClick={() => navigate("/test")} type="button">
              Test
            </button>
            <button onClick={() => navigate("/about")} type="button">
              A propos
            </button>

            {token ? (
              <button
                onClick={() => logOut()}
                type="button"
                className="btn-log logout"
              >
                Déconnexion
              </button>
            ) : (
              <button
                onClick={() => navigate("/connexion")}
                type="button"
                className="btn-log login"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </header>

      {/* main */}
      <div className="home-main-container">
        {/* div1 text */}
        <div className="div1">
          <h2>Bienvenue sur Nahoot!</h2>
          <p>
            Créer, gérer des competitions en mode locale, avec vos amis,
            familles ou collègues. {user?.name}
          </p>

          <div>
            <button onClick={() => navigate("/admin/dashboard")} type="button">
              Créer une competition
            </button>
            <button onClick={() => navigate("/test")} type="button">
              Joindre une competition
            </button>
          </div>
        </div>

        {/* div2 img */}
        <div className="div2">
          <img src={trophy} alt="Logo Nahoot" />
        </div>
      </div>

      {/* footer */}
    </main>
  );
}

export default App;
