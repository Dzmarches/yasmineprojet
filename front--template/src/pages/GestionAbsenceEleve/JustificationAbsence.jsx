import React, { useState } from 'react';
import axios from 'axios';

const JustificationAbsence = ({ eleveId, date, period, onUpload }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('eleveId', eleveId);
        formData.append('date', date);
        formData.append('period', period);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/presences/justifications',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            onUpload(response.data.path);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-3 border rounded mt-2">
            <h5>Justifier l'absence</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        accept="image/*, application/pdf"
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-sm btn-primary"
                    disabled={uploading}
                >
                    {uploading ? 'Envoi...' : 'Envoyer la justification'}
                </button>
            </form>
        </div>
    );
};

export default JustificationAbsence;