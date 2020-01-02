import { useEffect } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import jwt from 'jsonwebtoken';

function useProtected() {
  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    try {
      let token = localStorage.getItem("authapp");
      if (!token) throw Error("no token");

      let decodedToken = jwt.decode(token);
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        return;
      } else {
        throw Error("token expired");
      }
    } catch (err) {
      if (location.pathname !== "/sign-in") {
        history.replace("/sign-in");
      }
    }
  }, [location, history])
}

export default useProtected;
