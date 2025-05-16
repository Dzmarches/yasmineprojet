// context/AuthProvider.js
import React, { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import CryptoJS from 'crypto-js';

export const AuthContext = createContext();

// Clé de chiffrement (à stocker de manière sécurisée en production)
const SECRET_KEY = '3565kjfj455hlkjkdkjk45lk';

// Fonctions de chiffrement/déchiffrement
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error("Erreur de déchiffrement", e);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          // Déchiffrer les permissions si elles existent
          const encryptedPermissions = localStorage.getItem("permissions");
          const permissions = encryptedPermissions 
            ? decryptData(encryptedPermissions) 
            : [];
            
          return {
            token,
            username: localStorage.getItem("username"),
            userId: localStorage.getItem("userId"),
            ecoleId: localStorage.getItem("ecoleId"),
            ecoleeId: decodedToken.ecoleeId || localStorage.getItem("ecoleeId"),
            roles: decodedToken.roles || JSON.parse(localStorage.getItem("roles")),
            roleIds: decodedToken.roleIds || [],
            permissions: permissions,
          };
        } else {
          localStorage.clear();
          return null;
        }
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        localStorage.clear();
        return null;
      }
    }
    return null;
  });

  const fetchUserPermissions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/permissions/perm/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      return response.data.permissions;
    } catch (error) {
      console.error("Erreur lors de la récupération des permissions:", error);
      return [];
    }
  };

  const login = async (token, username, userId, ecoleId, ecoleeId, roles) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
    localStorage.setItem("ecoleId", ecoleId);
    localStorage.setItem("ecoleeId", ecoleeId);
    localStorage.setItem("roles", JSON.stringify(roles));

    try {
      const decodedToken = jwtDecode(token);
      const permissions = await fetchUserPermissions(userId);
      
      // Chiffrer les permissions avant de les stocker
      const encryptedPermissions = encryptData(permissions);
      localStorage.setItem("permissions", encryptedPermissions);

      setUser({
        token,
        username,
        userId,
        ecoleId,
        ecoleeId: ecoleeId || decodedToken.ecoleeId,
        roles: decodedToken.roles || roles,
        roleIds: decodedToken.roleIds,
        permissions,
      });
      
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};