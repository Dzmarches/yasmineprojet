import axios from "axios";
import { archiveremployes } from './ApiListeArchives.js';


//-----------------------ACTION RESSOURCE HUMAINES-----------------------------
export const RestaurerEmploye = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/employes/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverEmploye = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/employes/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
export const SupprimerEmploye = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.delete(`http://localhost:5000/archives/supprimer/employes/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      alert('supprimer avec success');
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//-----------------------ACTION Conges Absences-----------------------------
export const RestaurerCA = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/congeAbsences/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverCAs = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/congeAbsences/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//-----------------------ACTION Primes-----------------------------
export const RestaurerPrime = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/primes/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverPrime = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/primes/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//-----------------------ACTION HEURES SUPPLIMENTAIRES-----------------------------
export const RestaurerHS = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/heureSup/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverHS = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/heureSup/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//-----------------------ACTION HEURES Retards-----------------------------
export const RestaurerHR = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/heureRetard/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverHR = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/heureRetard/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//-----------------------CONGE ANNUEL----------------------------
export const RestaurerCAnnuel = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/congeAnnuel/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverCAnnuel = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/congeAnnuel/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//----------------------- JournalDePaie ----------------------------
export const RestaurerJP = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/journalpaie/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverJP = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/journalpaie/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//-----------------------Periode Paie----------------------------
export const RestaurerPP = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/periodepaie/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverPP = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/periodepaie/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//------------------Pointages------------
export const RestaurerPoint = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/pointages/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverPoint = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/pointages/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//------------------POSTE------------
export const RestaurerPost = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/poste/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverPost = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/poste/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//------------------SERVICE------------
export const RestaurerService = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/service/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverService  = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/service/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
//------------------COMPTABILITE------------
export const RestaurerTR = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/typeRevenu/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverTR  = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/typeRevenu/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
export const RestaurerR = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/revenus/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverR  = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/revenus/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
export const RestaurerTD = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/typeDepense/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverTD  = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/typeDepense/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
export const RestaurerD = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/depense/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverD  = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/depense/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}
export const RestaurerContrat = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/restaurer/contrat/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('Restauré avec succès', 3000);
    }

  } catch (error) {
    console.log("Erreur", error)
  }
}
export const ArchiverPlanning = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const response = await axios.patch(`http://localhost:5000/archives/archiver/palnningC/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      showAlert('archiver avec succès', 3000);
    }
  } catch (error) {
    console.log("Erreur", error)
  }
}









// Fonction pour afficher une alerte personnalisée
const showAlert = (message, duration = 3000) => {
  const alertDiv = document.createElement('div');
  alertDiv.textContent = message;
  // Appliquer des styles pour l'alerte
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '50px';
  alertDiv.style.right = '30px';
  alertDiv.style.padding = '15px';
  alertDiv.style.backgroundColor = '#4e73df'; // Vert pour succès
  alertDiv.style.color = '#fff';
  alertDiv.style.borderRadius = '5px';
  alertDiv.style.zIndex = '9999';
  alertDiv.style.fontSize = '20px';
  alertDiv.style.minWidth = '500px';
  // Ajouter le div à l'élément body
  document.body.appendChild(alertDiv);
  // Supprimer l'alerte après le délai spécifié (3000 ms par défaut)
  setTimeout(() => {
    alertDiv.remove();
  }, duration);
};