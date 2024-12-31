import { NavLink, Outlet, useNavigate } from "react-router";
import { useStore } from "../lib/store";
import { useEffect } from "react";
import "../css/admin.css";
import HeaderAdmin from "../components/admin/AsideAdmin";
import useWindowDimensions from "../hooks/useWindowDimensions";

const Admin = () => {
  const navigate = useNavigate();
  const { token } = useStore();
  const { width } = useWindowDimensions();
  // console.log({ token });

  useEffect(() => {
    if (!token) {
      navigate("/connexion");
    }
  }, [token, navigate]);

  if (width < 768) {
    return (
      <div className="admin-small-screen">
        <p>
          Pour acceder à cette page, allez sur un grand écran (768px ou plus).
        </p>

        <NavLink
          className={"no-link"}
          to={"/"}
        >{`Retour a la page d’accueil`}</NavLink>
      </div>
    );
  }

  return (
    <main className="admin-main">
      <HeaderAdmin />

      {/* children */}
      <div className="admin-child">
        <div className="admin-child-container">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Admin;
