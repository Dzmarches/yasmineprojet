import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Singup";
import DashboardAdmin from "./Administrateur/DashboardAdministrateur";
import { AuthProvider } from "./components/AuthContext";
import CycleScolaire from './Administrateur/gestion ecole/CycleScolaire.jsx'
import AnneeScolaire from './pages/Academiques/Anneescolaire.jsx';
import PrivateRoute from "./PrivateRoute";
import LayoutAdministrateur from "./Administrateur/Layout";
import EcolePrincipal from './Administrateur/gestion ecole/EcolePrincipal';
import EcoleAction from './Administrateur/gestion ecole/EcoleAction';
import Layoute from './pages/Layoute';
import Dashboard from './pages/Home';
import Ecole from './pages/parametres/Ecole';
import EcoleActionn from './pages/parametres/EcoleAction';
import Privilege from "./Administrateur/Gestion Privilège/privilège";
import Etudiants from './pages/Administration/Etudiants';
import Parents from './pages/Administration/Parents.jsx';
import Niveaux from "./pages/Academiques/Niveaux";
import Matiere from "./pages/Academiques/Matiere";
import Salles from "./pages/Academiques/Salles";
import Section from "./pages/Academiques/Section";
import Trimest from "./pages/Academiques/Trimest";
import Formulaire from './pages/Administration/Formulaire';
import Enseignant from './pages/Administration/Enseignant.jsx';
import ModifierEnseignant from './pages/Administration/ModifierEnseignant.jsx';
import ListUser from './pages/parametres/ListeUser.jsx';
import EditUser from './pages/parametres/EditUser.jsx';
import GestionEleves from './pages/Administration/GestionEleves.jsx';
import DisponibiliteEnseignants from "./pages/Administration/DisponibiliteEnseignants.jsx";
import GestionDesNotes from "./pages/Academiques/GestionDesNotes.jsx";
import Communication from "./pages/Communication/Communication.jsx";
import ListeDeSesEnfants from "./pages/interface parent et Eleve/ListeDeSesEnfants.jsx";
import GestionDevoire from './pages/Academiques/GestionDevoire.jsx';
import EmploiDuTemps from "./pages/Academiques/EmploiDuTemps.jsx"

import GestionNotesEnseignant from "./pages/Academiques/GestionNotesEnseignant.jsx";
import GestionAbsence from "./pages/GestionAbsenceEleve/GestionAbsence.jsx";
import JustificationAbsence from "./pages/GestionAbsenceEleve/JustificationAbsence.jsx";


import Employes from './pages/RH/Employes/Employes'
import AjouterEmploye from './pages/RH//Employes/AjouterEmploye';
import ModifierEmploye from './pages/RH//Employes/ModifierEmploye';
import Conges from './pages/RH/Conge/Conges';
import AjouterModifierConge from './pages/RH/Conge/AddEditConge';
import GTEmployesAddEdit from './pages/GestionTemps/gestionTempEmployes/GTEmployesAddEdit';
import PointageManuel from './pages/GestionTemps/gestionTempEmployes/PointageManuel';
import EmployeCA from './pages/RH/Conge/Employe/EmployeCA';

import GestionAbsenceEleve from './pages/GestionAbsenceEleve/gestionabsenceeleve.jsx';
import PointageLocalisation from './pages/GestionTemps/pointageLocalisation/PointageLocalisation';
import Justifications from './pages/justificationEleve/Justifications';
import MesJustifications from './pages//justificationEleve/MesJustifications';
import DocumentsEmployesAjouter from './pages/RH/GestionDocuments/DocumentsEmployesAjouter';
import DocumentsEmployes from './pages/RH/GestionDocuments/DocumentsEmployes';
import DocumentsEmployesModifier from './pages/RH/GestionDocuments/DocumentsEmployesModifier';
import DocumentsImprimer from './pages/RH/GestionDocuments/DocumentsImprimer'
import RapportPointage from "./pages/GestionTemps/RapportPointage";
import RessourcesHumaines from "./pages/RH/RessourcesHumaines";
import Prime from "./pages/RH/Paie/Prime.jsx"
import IRG from "./pages/RH/Paie/IRG.jsx";
import EnseignantClasses from "./pages/Administration/EnseignantClasses.jsx";
import AffecterPrimeEmploye from "./pages/RH/Paie/AffecterPrimeEmploye.jsx";
import Paie from "./pages/RH/Paie/Paie.jsx";
import PeriodesPaie from "./pages/RH/Paie/PeriodesPaie.jsx";
import Bulletins_paie from "./pages/RH/Paie/Bulletins_paie.jsx";
import JournalPaie from "./pages/RH/Paie/JournalPaie.jsx";
import HeureSup from "./pages/RH/HeureSup.jsx";
import GestionPaiement from "./pages/RH/GestionPaiement.jsx"
import VoirFichesPaie from "./pages/RH/Paie/VoirFichesPaie.jsx"
import ParametreRetard from "./pages/RH/Paie/ParametreRetard.jsx"
import Can from "./can.jsx";
import { PERMISSIONS } from "./permission.jsx";
import Forbidden from './Forbidden.jsx';
import ParentForm from "./pages/Administration/ParentForm.jsx";
import ProfileE from "./pages/ProfileE.jsx";


import RapportConges from "./pages/RH/Conge/RapportConges.jsx";
import SoldeCompte from "./pages/RH/Paie/soldeTTcompte/SoldeCompte.jsx";
import ListeNonEmploye from "./pages/RH/Paie/soldeTTcompte/ListeNonEmploye.jsx";
import JoursFeries from "./pages/parametres/JoursFeries.jsx";
import Typerevenue from "./pages/comptabilite/Typerevenue.jsx";
import Typedepense from "./pages/comptabilite/Typedepense.jsx";
import RevenusC from "./pages/comptabilite/RevenusC.jsx";
import DepensesC from "./pages/comptabilite/DepensesC.jsx";
import Parameterpaie from "./pages/RH/Paie/Parameterpaie.jsx"
import Comptabilite from "./pages/comptabilite/Comptabilite.jsx";
import PaiementEtudiants from "./pages/comptabilite/paiementEtudiants/PaiementEtudiants.jsx";
import RapportComptabilite from "./pages/comptabilite/RapportComptabilite.jsx";
import { Archive } from "react-bootstrap-icons";
import Archiver from "./pages/Archivage/Archiver.jsx";
import ArchiverModule from "./pages/Archivage/ArchiverModule.jsx";

import InterfaceEleve from "./pages/interface parent et Eleve/interfaceEleve.jsx";
import EleveInterface from "./pages/interface parent et Eleve/EleveInterface.jsx";
import DevoireEleve from "./pages/interface parent et Eleve/DevoirEleve.jsx";
import ListeAbsences from "./pages/GestionAbsenceEleve/ListeAbsences.jsx";
import GestionDevoir from "./pages/Academiques/PlaningDevoirs.jsx";
import EmploiDuTempsV2 from "./pages/Academiques/EmploiDuTempsV2.jsx";
import EmploiDuTempEnseignant from "./pages/Academiques/EmploiDuTempEnseignant.jsx";
import GestionCategorie from "./pages/GestionStocks/GestionCategorie.jsx";
import GestionArticle from "./pages/GestionStocks/GestionArticle.jsx";
import Founisseur from './pages/GestionStocks/Fournisseur.jsx';
import GestionAchat from "./pages/GestionStocks/GestionAchat.jsx";
import PlanificationAcadémique from './pages/Academiques/PlanificationAcadémique.jsx';
import ParamtreEntiteeScolaire from './pages/Academiques/ParametreEntiteeScolaire.jsx';
import GestionStock from "./pages/GestionStocks/GestionStock.jsx";
import MagasinPédagogique from './pages/GestionStocks/MagasinPédagogique.jsx';
import MagasinRestauration from './pages/GestionStocks/MagasinRestauration.jsx';
import MagasinDivers from './pages/GestionStocks/MagasinDivers.jsx';
import NotesEleve from "./pages/interface parent et Eleve/NoteEleve.jsx";
import EmploiEleve from "./pages/interface parent et Eleve/EmploiEleve.jsx";





function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboardadministrateur" element={<PrivateRoute role="Administrateur"><LayoutAdministrateur><DashboardAdmin /></LayoutAdministrateur></PrivateRoute>} />
          <Route path="/annees" element={<PrivateRoute role="Administrateur"><LayoutAdministrateur><AnneeScolaire /></LayoutAdministrateur></PrivateRoute>} />
          <Route path="/Trimeste" element={<PrivateRoute role="Administrateur"><LayoutAdministrateur><Trimest /></LayoutAdministrateur></PrivateRoute>} />
          <Route path="/privilege" element={<PrivateRoute role="Administrateur"><LayoutAdministrateur><Privilege /></LayoutAdministrateur></PrivateRoute>} />
          <Route path="/ecole" element={<PrivateRoute role="Administrateur"><LayoutAdministrateur><EcolePrincipal /></LayoutAdministrateur></PrivateRoute>} />
          <Route path="/ecole/:action" element={<PrivateRoute role="Administrateur"><LayoutAdministrateur><EcoleAction /></LayoutAdministrateur></PrivateRoute>} />
          <Route path="/cyclescolaire" element={<PrivateRoute role="Administrateur"><LayoutAdministrateur><CycleScolaire /></LayoutAdministrateur></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Layoute><Dashboard /></Layoute></PrivateRoute>} />
          <Route path="/listeUser" element={<PrivateRoute><Layoute><ListUser /></Layoute></PrivateRoute>} />
          <Route path="/edit-user/:userId" element={<PrivateRoute><Layoute><EditUser /></Layoute></PrivateRoute>} />
          <Route path="/niveaux" element={<PrivateRoute><Layoute><Niveaux /></Layoute></PrivateRoute>} />
          <Route path="/annee" element={<PrivateRoute><Layoute><AnneeScolaire /></Layoute></PrivateRoute>} />
          <Route path="/disponibilites-enseignants" element={<PrivateRoute><Layoute><DisponibiliteEnseignants /></Layoute></PrivateRoute>} />
          <Route path="/GestionDesNotes" element={<PrivateRoute><Layoute><GestionDesNotes /></Layoute></PrivateRoute>} />
          <Route path="/GestionDesNotesEnseignant" element={<PrivateRoute><Layoute><GestionNotesEnseignant /></Layoute></PrivateRoute>} />
          <Route
            path="/matiere"
            element={
              <PrivateRoute>
                <Can
                  permission={PERMISSIONS.SUBJECT_VIEW}
                  fallback={
                    <Layoute>
                      <Forbidden />
                    </Layoute>
                  } >
                  <Layoute>
                    <Matiere />
                  </Layoute>
                </Can>
              </PrivateRoute>
            }
          />
          <Route path="/salle" element={<PrivateRoute><Layoute><Salles /></Layoute></PrivateRoute>} />
          <Route path="/sections" element={<PrivateRoute><Layoute><Section /></Layoute></PrivateRoute>} />
          <Route path="/trimest" element={<PrivateRoute><Layoute><Trimest /></Layoute></PrivateRoute>} />
          <Route path="/ecoles" element={<PrivateRoute><Layoute><Ecole /></Layoute></PrivateRoute>} />
          <Route path="/eleves" element={<PrivateRoute><Layoute><Etudiants /></Layoute></PrivateRoute>} />
          <Route path="/affecterclasse" element={<PrivateRoute><Layoute><GestionEleves /></Layoute></PrivateRoute>} />
          <Route path="/parents" element={<PrivateRoute><Layoute><Parents /></Layoute></PrivateRoute>} />
          <Route path="/parents/modifier/:id" element={<PrivateRoute><Layoute><ParentForm isEditing={true} /></Layoute></PrivateRoute>} />
          <Route path="/ecoles/:action" element={<PrivateRoute><Layoute><EcoleActionn /></Layoute></PrivateRoute>} />
          <Route path="/etudiants/formulaire" element={<PrivateRoute><Layoute><Formulaire /></Layoute></PrivateRoute>} />
          <Route path="/etudiants/modifiereleve/:id" element={<PrivateRoute><Layoute><Formulaire /></Layoute></PrivateRoute>} />
          <Route path="/enseignant" element={<PrivateRoute><Layoute><Enseignant /></Layoute></PrivateRoute>} />
          <Route path="/enseignant/modifier/:id" element={<PrivateRoute><Layoute><ModifierEnseignant /></Layoute></PrivateRoute>} />
          <Route path="/listClasse/enseignant/classes/:enseignantId" element={<PrivateRoute><Layoute><EnseignantClasses /></Layoute></PrivateRoute>} />
          <Route path="/EmploiDuTemps" element={<PrivateRoute><Layoute><EmploiDuTemps /></Layoute></PrivateRoute>} />
          <Route path="/EmploiDuTempsv2" element={<PrivateRoute><Layoute><EmploiDuTempsV2 /></Layoute></PrivateRoute>} />
          <Route path="/absenceeleve" element={<PrivateRoute><Layoute><GestionAbsenceEleve /></Layoute></PrivateRoute>} />
          <Route path="/gestionabsence" element={<PrivateRoute><Layoute><GestionAbsence /></Layoute></PrivateRoute>} />
          <Route path="/justificationeleve" element={<PrivateRoute><Layoute><JustificationAbsence /></Layoute></PrivateRoute>} />
          <Route path="/communication" element={<PrivateRoute><Layoute><Communication /></Layoute></PrivateRoute>} />
          <Route path="/listeenfants" element={<PrivateRoute><Layoute><ListeDeSesEnfants /></Layoute></PrivateRoute>} />
          <Route path="/GestionDevoire" element={<PrivateRoute><Layoute><GestionDevoire /></Layoute></PrivateRoute>} />
          <Route path="/elevess" element={<PrivateRoute><Layoute><InterfaceEleve /></Layoute></PrivateRoute>} />
          <Route path="/listeabsence" element={<PrivateRoute><Layoute><ListeAbsences /></Layoute></PrivateRoute>} />
          <Route path="/planingdevoir" element={<PrivateRoute><Layoute><GestionDevoir /></Layoute></PrivateRoute>} />
          <Route path="/EmploiDuTempsEnseignant" element={<PrivateRoute><Layoute><EmploiDuTempEnseignant /></Layoute></PrivateRoute>} />
          <Route path="/elevesinterface" element={<PrivateRoute><Layoute><EleveInterface /></Layoute></PrivateRoute>} />
          <Route path="/devoireleve" element={<PrivateRoute><Layoute><DevoireEleve /></Layoute></PrivateRoute>} />
          <Route path="/noteeleve" element={<PrivateRoute><Layoute><NotesEleve /></Layoute></PrivateRoute>} />
          <Route path="/emploieleve" element={<PrivateRoute><Layoute><EmploiEleve /></Layoute></PrivateRoute>} />


          {/* Gestion stocks */}
          <Route path="/categorie" element={<PrivateRoute><Layoute><GestionCategorie /></Layoute></PrivateRoute>} />
          <Route path="/article" element={<PrivateRoute><Layoute><GestionArticle /></Layoute></PrivateRoute>} />
          <Route path="/fournisseur" element={<PrivateRoute><Layoute><Founisseur /></Layoute></PrivateRoute>} />
          <Route path="/achat" element={<PrivateRoute><Layoute><GestionAchat /></Layoute></PrivateRoute>} />
          <Route path="/PlanificationAcadémique" element={<PrivateRoute><Layoute><PlanificationAcadémique /></Layoute></PrivateRoute>} />
          <Route path="/ParametreEntiteeScolaire" element={<PrivateRoute><Layoute><ParamtreEntiteeScolaire /></Layoute></PrivateRoute>} />
          <Route path="/gestionstock" element={<PrivateRoute><Layoute><GestionStock /></Layoute></PrivateRoute>} />
          <Route path="/magasinpedagogique" element={<PrivateRoute><Layoute><MagasinPédagogique /></Layoute></PrivateRoute>} />
          <Route path="/magasinrestauration" element={<PrivateRoute><Layoute><MagasinRestauration /></Layoute></PrivateRoute>} />
          <Route path="/magasindivers" element={<PrivateRoute><Layoute><MagasinDivers /></Layoute></PrivateRoute>} />



          <Route path="/RessourcesHumaines" element={<PrivateRoute><Layoute><RessourcesHumaines /></Layoute></PrivateRoute>} />
          <Route path="/Gpaiement" element={<PrivateRoute><Layoute><GestionPaiement /></Layoute></PrivateRoute>} />
          <Route path="/employes" element={<PrivateRoute><Layoute><Employes /></Layoute></PrivateRoute>} />
          <Route path="/employes/ajouter" element={<PrivateRoute><Layoute><AjouterEmploye /></Layoute></PrivateRoute>} />
          <Route path="/employes/modifier/:id" element={<PrivateRoute><Layoute><ModifierEmploye /></Layoute></PrivateRoute>} />
          <Route path="/Conges" element={<PrivateRoute><Layoute><Conges /></Layoute></PrivateRoute>} />
          <Route path="/conges/AjouterModifierConge" element={<PrivateRoute><Layoute><AjouterModifierConge /></Layoute></PrivateRoute>} />
          <Route path="/gestiontemps" element={<PrivateRoute><Layoute><PointageManuel /></Layoute></PrivateRoute>} />
          <Route path="/gestiontemps/ajouter" element={<PrivateRoute><Layoute><GTEmployesAddEdit /></Layoute></PrivateRoute>} />
          <Route path="/mesDemandes" element={<PrivateRoute><Layoute><EmployeCA /></Layoute></PrivateRoute>} />
          <Route path="/pointage/localisation" element={<PrivateRoute><Layoute><PointageLocalisation /></Layoute></PrivateRoute>} />
          <Route path="/rapportPointage" element={<PrivateRoute><Layoute><RapportPointage /></Layoute></PrivateRoute>} />
          <Route path="/justifications" element={<PrivateRoute><Layoute><Justifications /></Layoute></PrivateRoute>} />
          <Route path="/MesJustifications" element={<PrivateRoute><Layoute><MesJustifications /></Layoute></PrivateRoute>} />
          <Route path="/documents" element={<PrivateRoute><Layoute><DocumentsEmployes /></Layoute></PrivateRoute>} />
          <Route path="/employes/document/modifier/:id" element={<PrivateRoute><Layoute><DocumentsEmployesModifier /></Layoute></PrivateRoute>} />
          <Route path="/employes/document/ajouter" element={<PrivateRoute><Layoute><DocumentsEmployesAjouter /></Layoute></PrivateRoute>} />
          <Route path="/documentImprimer" element={<PrivateRoute><Layoute><DocumentsImprimer /></Layoute></PrivateRoute>} />
          <Route path="/primes" element={<PrivateRoute><Layoute><Prime /></Layoute></PrivateRoute>} />
          <Route path="/IRG" element={<PrivateRoute><Layoute><IRG /></Layoute></PrivateRoute>} />

          <Route path="/affecterPE" element={<PrivateRoute><Layoute><AffecterPrimeEmploye/></Layoute></PrivateRoute>} />
          <Route path="/periodes_paie" element={<PrivateRoute><Layoute><PeriodesPaie/></Layoute></PrivateRoute>} />
          <Route path="/paiement" element={<PrivateRoute><Layoute><Paie/></Layoute></PrivateRoute>} />
          <Route path="/bulletins_paie/:id" element={<PrivateRoute><Layoute><Bulletins_paie/></Layoute></PrivateRoute>} />
          <Route path="/JournalPaie" element={<PrivateRoute><Layoute><JournalPaie/></Layoute></PrivateRoute>} />
          <Route path="/heuresSup" element={<PrivateRoute><Layoute><HeureSup/></Layoute></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Layoute><ProfileE/></Layoute></PrivateRoute>} />
          <Route path="/VoirFichesPaie" element={<PrivateRoute><Layoute><VoirFichesPaie/></Layoute></PrivateRoute>} />
          <Route path="/parametreRetard" element={<PrivateRoute><Layoute><ParametreRetard/></Layoute></PrivateRoute>} />
          <Route path="/rapportConges" element={<PrivateRoute><Layoute><RapportConges/></Layoute></PrivateRoute>} />
          <Route path="/soldeCompte" element={<PrivateRoute><Layoute><SoldeCompte/></Layoute></PrivateRoute>} />
          <Route path="/bulletins_paie/NonEmploye/:id" element={<PrivateRoute><Layoute><ListeNonEmploye/></Layoute></PrivateRoute>} />
          <Route path="/parameterepaie" element={<PrivateRoute><Layoute><Parameterpaie/></Layoute></PrivateRoute>} />

         {/* comptabilite */}
          {/* <Route path="/revenus" element={<PrivateRoute><Layoute><Typerevenue/></Layoute></PrivateRoute>} />
          <Route path="/depenses" element={<PrivateRoute><Layoute><Typedepense/></Layoute></PrivateRoute>} />
          <Route path="/revenusC" element={<PrivateRoute><Layoute><RevenusC/></Layoute></PrivateRoute>} />
          <Route path="/depensesC" element={<PrivateRoute><Layoute><DepensesC/></Layoute></PrivateRoute>} /> */}
          <Route path="/comptabilite" element={<PrivateRoute><Layoute><Comptabilite/></Layoute></PrivateRoute>} />
          <Route path="/paiementEleves" element={<PrivateRoute><Layoute><PaiementEtudiants/></Layoute></PrivateRoute>} />
          <Route path="/rapportComptabilite" element={<PrivateRoute><Layoute><RapportComptabilite/></Layoute></PrivateRoute>} />
          <Route path="/joursferies" element={<PrivateRoute><Layoute><JoursFeries/></Layoute></PrivateRoute>} />
          <Route path="/archives" element={<PrivateRoute><Layoute><Archiver/></Layoute></PrivateRoute>} />
          <Route path="/archivemodule/:module" element={<PrivateRoute><Layoute>
            <ArchiverModule/></Layoute>
            </PrivateRoute>} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;