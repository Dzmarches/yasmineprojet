import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const PermissionGuard = ({ requiredPermission, children }) => {
    const { user } = useContext(AuthContext);

    // Vérifier si l'utilisateur a la permission requise
    if (user && user.permissions.includes(requiredPermission)) {
        return children;
    }

    // Si l'utilisateur n'a pas la permission, ne rien afficher
    return null;
};

export default PermissionGuard;