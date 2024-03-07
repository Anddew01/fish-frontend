import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const guestNav = [
  { to: "/", text: "เข้าสู่ระบบ" },
  { to: "/register", text: "สมัครสมาชิก" },
];

const userNav = [
  { to: "/home", text: "หน้าหลัก" },
  { to: "/bill", text: "เพิ่มบิล" },
  { to: "/billList", text: "รายการบิล" },
  { to: "/fish", text: "เพิ่มพันธุ์ปลา" },
  { to: "/fishList", text: "รายการปลา" },
  { to: "/member", text: "เพิ่มสมาชิก" },
  { to: "/memberList", text: "รายชื่อสมาชิก" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const finalNav = user?.id ? userNav : guestNav;
  const navigate = useNavigate();

  const hdlLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        {user?.id ? (
          <Link to="/home" className="btn btn-ghost text-xl">
            ยินดีต้อนรับ : {user.username}
          </Link>
        ) : (
          <Link to="/" className="btn btn-ghost text-xl">
            ยินดีต้อนรับ : {user?.id ? user.username : ""}
          </Link>
        )}
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {finalNav.map((el) => (
            <li key={el.to}>
              <Link to={el.to}>{el.text}</Link>
            </li>
          ))}
          {user?.id && (
            <li>
              <Link to="#" onClick={hdlLogout}>
                ออกระบบ
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
