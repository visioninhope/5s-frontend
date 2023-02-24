import { Link } from "react-router-dom";
import {
  Algorithm,
  Camera,
  Company,
  Dashboard,
} from "../assets/svg/SVGcomponent";
import logo from "../assets/svg/icon.svg";
import { useState } from "react";

export const LeftMenu = () => {
  const [useless, setUseless] = useState(false);

  const send = () => {
    setUseless(!useless);
  };
  return (
    <aside className="leftMenu">
      <Link to="/" onClick={send}>
        <img src={logo} alt="logo" />
      </Link>
      <ul>
        <li
          className={
            window.location.pathname.includes("dashboard")
              ? "activeMenu"
              : "noActiveMenu"
          }
        >
          <Link to="dashboard" onClick={send}>
            <Dashboard />
            <span>Dashboard</span>
          </Link>
        </li>
        <li
          className={
            window.location.pathname.includes("camera")
              ? "activeMenu"
              : "noActiveMenu"
          }
        >
          <Link to="camera" onClick={send}>
            <Camera />
            <span>Camera</span>
          </Link>
        </li>
        <li
          className={
            window.location.pathname.includes("algorithm")
              ? "activeMenu"
              : "noActiveMenu"
          }
        >
          <Link to="/algorithm" onClick={send}>
            <Algorithm />
            <span>Algorithm</span>
          </Link>
        </li>
        <li
          className={
            window.location.pathname.includes("company")     
            ? "activeMenu"
            : "noActiveMenu"
          }
        >
          <Link to="/company" onClick={send}>
            <Company />
            <span>Company</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};
