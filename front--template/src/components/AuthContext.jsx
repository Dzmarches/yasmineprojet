import React, { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    return {
                        token,
                        username: localStorage.getItem("username"),
                        userId: localStorage.getItem("userId"),
                        ecoleId: localStorage.getItem("ecoleId"),
                        ecoleeId: decodedToken.ecoleeId || localStorage.getItem("ecoleeId"),
                        roles: decodedToken.roles || [],
                        roleIds: decodedToken.roleIds || [], // Récupérer les IDs des rôles
                        permissions: JSON.parse(localStorage.getItem("permissions")) || [], // Récupérer les permissions
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

    const login = (token, username, userId, ecoleId, ecoleeId, permissions) => {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", userId);
        localStorage.setItem("ecoleId", ecoleId);
        localStorage.setItem("ecoleeId", ecoleeId);
        localStorage.setItem("permissions", JSON.stringify(permissions)); // Stocker les permissions

        try {
            const decodedToken = jwtDecode(token);
            setUser({
                token,
                username,
                userId,
                ecoleId,
                ecoleeId: ecoleeId || decodedToken.ecoleeId,
                roles: decodedToken.roles,
                roleIds: decodedToken.roleIds,
                permissions: permissions || decodedToken.permissions, // Inclure les permissions
            });
            console.log('Utilisateur connecté :', {
                token,
                username,
                userId,
                ecoleId,
                ecoleeId: ecoleeId || decodedToken.ecoleeId,
                roles: decodedToken.roles,
                roleIds: decodedToken.roleIds,
                permissions: permissions || decodedToken.permissions,
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

// Créez un hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    return useContext(AuthContext);
};