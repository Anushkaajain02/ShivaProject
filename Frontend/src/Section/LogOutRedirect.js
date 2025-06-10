// components/LogoutRedirect.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    navigate("/");
  }, [navigate]);

  return null;
}
