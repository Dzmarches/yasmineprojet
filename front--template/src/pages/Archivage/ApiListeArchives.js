import React, { useEffect, useState } from 'react';
import axios from "axios";


//RESSOURCE HUMAINES
export const archiveremployes = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/employes', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération des employes", error)
  }
}
export const archiveCongeAnnuel = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/congeAnnuel', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const archiverCA = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/congeAbsences', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      console.log('archiverCA', response.data)
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération cA", error)
  }
}
export const archiverPrimes = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/primes', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const archiverHeureSup = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/heureSup', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération ", error)
  }
}
export const archiverheureRetard = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/heureRetard', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const archiverJournalpaie = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/journalpaie', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const archiverPeriodePaie = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/periodepaie', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const archiverPointages = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/pointages', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const archiverPostes = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/poste', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
       console.log('poste',response.data);
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const archiverServices = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/service', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const listeTR = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/typeRevenu', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const listeTD = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/typeDepense', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const listeR = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/revenus', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const listeD = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/depenses', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const listeContrat = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/contrat', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}
export const listePlanning = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.get('http://localhost:5000/archives/palnningC', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Erreur lors de la récupération", error)
  }
}