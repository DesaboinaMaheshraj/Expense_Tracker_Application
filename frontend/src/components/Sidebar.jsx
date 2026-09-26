import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/expenses">Expenses</NavLink>
      <NavLink to="/income">Income</NavLink>
      <NavLink to="/budget">Budget</NavLink>
      <NavLink to="/reports">Reports</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </aside>
  );
}

export default Sidebar;
