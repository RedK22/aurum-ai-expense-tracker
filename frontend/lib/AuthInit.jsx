"use client";

import {useEffect} from "react";
import {tryAutoLogin} from "./api";

const AuthInit = () => {
  useEffect(() => {
    tryAutoLogin();
  }, []);

  return null;
};

export default AuthInit;
