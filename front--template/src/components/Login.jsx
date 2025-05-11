import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./login.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("La géolocalisation n'est pas supportée par votre navigateur."));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            }
        });
    };

    const Auth = async (e) => {
        e.preventDefault();
        console.log("Tentative de connexion...");

        try {
            let location = null;
            try {
                location = await getLocation();
            } catch (geoError) {
                console.warn("La géolocalisation n'est pas disponible:", geoError.message);
                // On continue sans la localisation
            }

            const response = await axios.post('http://localhost:5000/Login', {
                username,
                password,
                latitude: location?.latitude || null,
                longitude: location?.longitude || null,
            });

            const { token, redirectTo, username: responseUsername, userId, ecoleId, ecoleeId, permissions } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('username', responseUsername);
            localStorage.setItem('userId', userId);
            localStorage.setItem('ecoleId', ecoleId);
            localStorage.setItem('ecoleeId', ecoleeId);
            localStorage.setItem('permissions', JSON.stringify(permissions));

            login(token, responseUsername, userId, ecoleId, ecoleeId, permissions);
            console.log("Permissions stockées :", permissions);

            navigate(redirectTo);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Erreur lors de la connexion";
            console.error("Erreur lors de la connexion :", errorMsg);
            setMsg(errorMsg);
        }

    };

    return (
        <div className="login_container">
            <div className="login_form_container">
                <div className="right">
                    <form onSubmit={Auth} className="form_container">
                        <h1>Connectez-vous à votre compte</h1>
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                        {msg && <div className="error_msg">{msg}</div>}
                        <button type="submit" className="green_btn">Se connecter</button>
                    </form>
                </div>
                <div className="left">
                    <h1>Nouveau ici ?</h1>
                    <a href="/signup">
                        <button type="button" className="white_btn">S'inscrire</button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;