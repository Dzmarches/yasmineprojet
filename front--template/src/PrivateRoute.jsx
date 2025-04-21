import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./components/AuthContext";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, role }) => {
    const { user } = React.useContext(AuthContext);
    const location = useLocation();

    // Vérifier si l'utilisateur est connecté
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Vérifier la validité du token
    try {
        const decodedToken = jwtDecode(user.token);
        if (decodedToken.exp * 1000 < Date.now()) {
            return <Navigate to="/login" state={{ from: location }} />; // Rediriger si le token est expiré
        }
    } catch (error) {
        return <Navigate to="/login" state={{ from: location }} />; // Rediriger en cas d'erreur de décodage
    }

    // Vérifier si l'utilisateur a le rôle requis
    if (role && !user.roles.includes(role)) {
        return <Navigate to="/" />; // Rediriger si l'utilisateur n'a pas le rôle requis
    }

    // Autoriser l'accès à la route protégée
    return children;
};

export default PrivateRoute;