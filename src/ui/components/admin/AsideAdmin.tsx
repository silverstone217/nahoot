import { useMemo } from "react";
import { NavLink, useLocation } from "react-router";
import {
  AlignVerticalSpaceBetween,
  LayoutList,
  ArrowUpRight,
  SquarePlus,
} from "lucide-react";

const DATA_LINKS = [
  {
    label: "Dashboard",
    value: "/admin/dashboard",
    icon: AlignVerticalSpaceBetween,
  },
  { label: "Competitions", value: "/admin/competitions", icon: LayoutList },
  { label: "Nouvelle", value: "/admin/nouvelle", icon: SquarePlus },
];

const HeaderAside = () => {
  const location = useLocation();
  const pathname = useMemo(() => location.pathname, [location]);

  return (
    <header className="aside-header">
      {/* logo */}
      <NavLink to={"/"} className="logo-link">
        <h3>Nahoot!</h3>
      </NavLink>

      <hr />

      {/* nav */}
      <div className="aside-nav">
        {DATA_LINKS.map(({ label, value, icon: Icon }) => (
          <NavLink
            key={label}
            to={value}
            className={` ${
              pathname === value ? "nav-link-act" : "nav-link-no"
            } nav-link`}
          >
            <Icon className="nav-icon" size={24} />
            {label}
          </NavLink>
        ))}
      </div>

      <hr />

      {/* user */}
      <div className="left-aside-part">
        <NavLink to="#">
          <span>A propos</span>
          <ArrowUpRight color="gray" size={15} />
        </NavLink>

        <div className="user-info">
          <span>Admin</span>
        </div>

        <button type="button" className="aside-btn-nav logout">
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default HeaderAside;
