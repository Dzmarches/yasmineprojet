import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, Circle, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import person from '../../../assets/imgs/person.png';
import axios from 'axios';

const Cart = ({ lat, lon, showcart, setShowcart, EcolePosition, color,id }) => {
    const [address, setAddress] = useState("Chargement de l'adresse..."); // État pour stocker l'adresse
    const closeModal = () => {
        setShowcart(false);
    };

    // Fonction pour récupérer l'adresse à partir des coordonnées
    const getAddressFromLatLong = async (lat, long) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`);
            return response.data.display_name;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'adresse", error);
            return "Adresse non trouvée";
        }
    };

    // Utiliser useEffect pour récupérer l'adresse lorsque lat ou lon change
    useEffect(() => {
        const fetchAddress = async () => {
            const adresse = await getAddressFromLatLong(lat, lon);
            setAddress(adresse); // Mettre à jour l'état avec l'adresse récupérée
        };

        fetchAddress();
    }, [lat, lon]); // Déclencher l'effet lorsque lat ou lon change

    const PersonIcon = new L.Icon({
        iconUrl: person,
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
        iconSize: [50, 50],
    });

    const fillBlueOptions = { fillColor: 'blue' };

    let circleOptions;
    if (color === 'green') {
        circleOptions = { color: 'green', fillColor: 'green' };
    } else {
        circleOptions = { color: 'red', fillColor: 'red' };
    }


    // Calculer le centre du polygone (EcolePosition)
    const calculateCenter = (polygon) => {
        const latitudes = polygon.map(point => point[0]);
        const longitudes = polygon.map(point => point[1]);
        const centerLat = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
        const centerLon = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
        return [centerLat, centerLon];
    };

    const center = calculateCenter(EcolePosition);
    return (
        <div className='cart'>
            {person}
            <div
                className={`modal fade ${showcart ? 'show' : 'modal-inert'}`}
                id="staticBackdrop"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                style={{ display: showcart ? 'block' : 'none' }}
            >
                <div className="modal-dialog modal-lg" id="local">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title" id="staticBackdropLabel">Position du pointage</h6>
                            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <MapContainer
                                center={center} // Centrer la carte sur le polygone
                                zoom={18}
                                style={{ height: "400px", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                    attribution='&copy; Google Maps'
                                />

                                {/* Zone de l'école (Polygon) */}
                                <Polygon
                                    positions={EcolePosition}
                                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                                />

                                {/* Cercle pour la position du pointage */}
                                <LayerGroup>
                                    <Circle
                                        center={[lat, lon]}
                                        pathOptions={circleOptions}
                                        radius={2}
                                    />
                                </LayerGroup>

                                {/* Marqueur pour la position du pointage */}
                                <Marker position={[lat, lon]} icon={PersonIcon}>
                                    <Popup>
                                        <strong>Position du pointage</strong><br />
                                        {address} 
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Fermer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;