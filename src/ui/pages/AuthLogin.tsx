import { useEffect, useState } from "react";
import "../css/auth.css";
import { EyeOff, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { useStore } from "../lib/store";

const AuthLogin = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, setToken } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  const loginUser = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://${window.location.hostname}:3000/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim().toLowerCase(), password }),
        }
      );

      const data = await response.json();

      // console.log({ data });

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token); // Stocke le token
        console.log("token", data.token);
        setToken(data.token); // Update le state du store
        navigate("/admin");
      }
    } catch (error) {
      console.error(error);
      const err = error as Error;
      setError(err.message);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="login-main">
        {/* welcome */}
        <div className="title">
          <h1>Connection au compte</h1>
          <p>Pour continuer ou gérer de competitions, il faut se connecter</p>
        </div>

        {/* form */}
        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}
        >
          {/* name */}
          <div className="input-container">
            <label htmlFor="name">{`Nom d'utilisateur`}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect="none"
              autoComplete="username"
            />
          </div>

          {/* password */}
          <div className="input-pass-container">
            <label htmlFor="password">{`Mot de passe`}</label>
            <div className="password-container">
              <input
                type={isVisible ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                maxLength={12}
                autoCapitalize="none"
                autoCorrect="none"
                autoComplete="current-password"
              />
              <button onClick={() => setIsVisible(!isVisible)} type="button">
                {isVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          {/* error */}
          {error && <div className="error">{error}</div>}

          {/* submit */}
          <div className="btn-div-last">
            <button type="submit" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
            <p>
              {`Mot de passe oublie?`} <a href="#">Réinitialiser.</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthLogin;
