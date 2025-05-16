// relations.js
import User from './User.js';
import Role from './Role.js';
import UserRole from './UserRole.js';
import Ecole_SEcole_Role from './Ecole_SEcole_Role.js';
import EcolePrincipal from './EcolePrincipal.js';
import Ecole from './Admin/Ecole.js';
import UserEcole from './Admin/UserEcole.js';
import CycleScolaire from './CycleScolaire.js';
import Employe from './RH/employe.js';
import Poste from './RH/poste.js';
import Service from './RH/service.js';
import Ecole_SEcole_Postes from './RH/Ecole_SEcole_Postes.js';
import Ecole_SEcole_Services from './RH/Ecole_SEcole_Services.js';
import Enseignant from './Admin/Enseignant.js';
import CongeAnnuel from './RH/congeAnnuel.js';
import CongeAbsence from './RH/congeAbsence.js';
import Eleve from './Admin/Eleve.js';
import Parent from './Admin/Parent.js';
import Niveaux from './Admin/Niveaux.js';
import EcoleNiveau from './Admin/EcoleNiveau.js';
import EcoleMatiere from './Admin/EcoleMatiere.js';
import Matiere from './Admin/Matiere.js';
import Permission from './Permission.js';
import Prime from './RH/paie/Prime.js';
import Prime_Employe from './RH/paie/Prime_Employe.js';
import Section from './Admin/Section.js';
import EcoleSections from './Admin/EcoleSections.js';
import EnseignantClasse from './Admin/EnseignantClasse.js';
import PeriodePaie from './RH/paie/PeriodesPaie.js';
import JournalPaie from './RH/paie/JournalPaie.js';
import HeuresSup from './RH/HeuresSup.js';
import Attestation from './Attestation.js';
import Pointage from './RH/pointage.js';
import NiveauxMatieres from './Admin/NiveauxMatieres.js';
import EmploiDuTemps from './Admin/EmploiDuTemps.js';
import ParametereRetard from './RH/paie/parametereRetard.js';
import Note from './Admin/Note.js';
import PeriodeNote from './Admin/periodenote.js';
import Remarque from './Admin/Remarque.js';
import EcoleRemarque from './Admin/EcoleRemarque.js';
import JoursFeries from './RH/paie/JoursFeries.js';
import TypeRevenue from './comptabilite/TypeRevenue.js';
import TypeDepense from './comptabilite/TypeDepense.js';
import Revenu from './comptabilite/Revenu.js';
import Depense from './comptabilite/Depense.js';
import Contrat from './comptabilite/PaimentEtudiant/Contrat.js';
import PlanningPaiement from './comptabilite/PaimentEtudiant/PlanningPaiement.js';

import Anneescolaire from './Admin/Anneescolaires.js';
import trimest from './Admin/Trimest.js';
import Trimest from './Admin/Trimest.js';
import MoyenneGenerale from './Admin/MoyenneGenerale.js';
import Devoire from './Admin/Devoire.js';
import TravailRendu from './Admin/TravailRendu.js';
import Categorie from './Stocks/Categorie.js';
import EcoleCategorie from './Stocks/EcoleCategorie.js';
import Article from './Stocks/Article.js';
import EcoleArticle from './Stocks/EcoleArticle.js';
import Fournisseur from './Stocks/Fournisseur.js';
import EcoleFournisseur from './Stocks/EcoleFournisseur.js';
import Achat from './Stocks/Achat.js';
import EcoleAchat from './Stocks/EcoleAchat.js';



Niveaux.hasMany(Section, { foreignKey: 'niveauxId' });
Section.belongsTo(Niveaux, { foreignKey: 'niveauxId' });
// User and Role Many-to-Many Relationship
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

//relation entre EcolePrincipal et Ecole et Role
EcolePrincipal.belongsToMany(Role, {  through: Ecole_SEcole_Role, foreignKey: 'ecoleId', otherKey: 'roleId'});
Role.belongsToMany(EcolePrincipal, { through: Ecole_SEcole_Role, foreignKey: 'roleId',  otherKey: 'ecoleId'});
Ecole.belongsToMany(Role, { through: Ecole_SEcole_Role, foreignKey: 'ecoleeId',  otherKey: 'roleId'});
Role.belongsToMany(Ecole, { through: Ecole_SEcole_Role, foreignKey: 'roleId',  otherKey: 'ecoleeId'});
EcolePrincipal.hasMany(Ecole_SEcole_Role, {foreignKey: 'ecoleId'});
Ecole_SEcole_Role.belongsTo(EcolePrincipal,{foreignKey:'ecoleId'})
Role.hasMany(Ecole_SEcole_Role, {foreignKey: 'roleId'});
Ecole_SEcole_Role.belongsTo(Role,{foreignKey:'roleId'});
Ecole.hasMany(Ecole_SEcole_Role, {foreignKey: 'ecoleeId'});
Ecole_SEcole_Role.belongsTo(Ecole,{foreignKey:'ecoleeId'});


// Role and Permission Many-to-Many Relationship
Role.belongsToMany(Permission, { through: UserRole, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: UserRole, foreignKey: 'permissionId' });

// User and Permission Many-to-Many Relationship
User.belongsToMany(Permission, { through: UserRole, foreignKey: 'userId' });
Permission.belongsToMany(User, { through: UserRole, foreignKey: 'permissionId' });

// UserRole associations
UserRole.belongsTo(User, { foreignKey: 'userId' });
UserRole.belongsTo(Role, { foreignKey: 'roleId' });
UserRole.belongsTo(Permission, { foreignKey: 'permissionId' });


// EcolePrincipal and User One-to-Many Relationship
EcolePrincipal.hasMany(User, { foreignKey: 'ecoleId' });
User.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });
// EcolePrincipal and Ecole One-to-Many Relationship
Ecole.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });
EcolePrincipal.hasMany(Ecole, { foreignKey: 'ecoleId' });

//relation role et permission 
// Définition de la relation Many-to-Many


// (Optionnel) Pour accéder directement aux enregistrements dans la table d'association :
// Role.hasMany(RolePermission, { foreignKey: 'roleId' });
// RolePermission.belongsTo(Role, { foreignKey: 'roleId' });
// Permission.hasMany(RolePermission, { foreignKey: 'permissionId' });
// RolePermission.belongsTo(Permission, { foreignKey: 'permissionId' });


// User and Ecole Many-to-Many Relationship (via UserEcole)
User.belongsToMany(Ecole, { through: UserEcole, foreignKey: 'userId' });
Ecole.belongsToMany(User, { through: UserEcole, foreignKey: 'ecoleeId' });
User.hasMany(UserEcole, { foreignKey: 'userId' });
UserEcole.belongsTo(User, { foreignKey: 'userId' });
Ecole.hasMany(UserEcole, { foreignKey: 'ecoleeId' });
UserEcole.belongsTo(Ecole, { foreignKey: 'ecoleeId' });

// Eleve.belongsTo(User, { foreignKey: 'userId' });
// User.hasMany(Eleve, { foreignKey: 'userId' });

User.hasOne(Parent, { foreignKey: 'userId', });
Parent.belongsTo(User, { foreignKey: 'userId',  });

User.hasOne(Eleve, { foreignKey: 'userId', });
Eleve.belongsTo(User, { foreignKey: 'userId',  });

Ecole.belongsToMany(Niveaux, { through: EcoleNiveau, foreignKey: "ecoleeId" });
Niveaux.belongsToMany(Ecole, { through: EcoleNiveau, foreignKey: "niveauId" });
EcolePrincipal.belongsToMany(Niveaux, { through: EcoleNiveau, foreignKey: "ecoleId" });
Niveaux.belongsToMany(EcolePrincipal, { through: EcoleNiveau, foreignKey: "niveauId" });
// Relations directes pour accéder à la table de jointure
Niveaux.hasMany(EcoleNiveau, { foreignKey: "niveauId" });
EcoleNiveau.belongsTo(Niveaux, { foreignKey: "niveauId" });
Ecole.hasMany(EcoleNiveau, { foreignKey: "ecoleeId" });
EcoleNiveau.belongsTo(Ecole, { foreignKey: "ecoleeId" });
EcolePrincipal.hasMany(EcoleNiveau, { foreignKey: "ecoleId" });
EcoleNiveau.belongsTo(EcolePrincipal, { foreignKey: "ecoleId" });

Ecole.belongsToMany(Matiere, { through: EcoleMatiere, foreignKey: "ecoleeId" });
Matiere.belongsToMany(Ecole, { through: EcoleMatiere, foreignKey: "matiereId" });
EcolePrincipal.belongsToMany(Matiere, { through: EcoleMatiere, foreignKey: "ecoleId" });
Matiere.belongsToMany(EcolePrincipal, { through: EcoleMatiere, foreignKey: "matiereId" });
// Relations directes pour accéder à la table de jointure
Matiere.hasMany(EcoleMatiere, { foreignKey: "matiereId" });
EcoleMatiere.belongsTo(Matiere, { foreignKey: "matiereId" });
Ecole.hasMany(EcoleMatiere, { foreignKey: "ecoleeId" });
EcoleMatiere.belongsTo(Ecole, { foreignKey: "ecoleeId" });
EcolePrincipal.hasMany(EcoleMatiere, { foreignKey: "ecoleId" });
EcoleMatiere.belongsTo(EcolePrincipal, { foreignKey: "ecoleId" });


Ecole.belongsToMany(Section, { through: EcoleSections, foreignKey: "ecoleeId" });
Section.belongsToMany(Ecole, { through: EcoleSections, foreignKey: "sectionId" });
EcolePrincipal.belongsToMany(Section, { through: EcoleSections, foreignKey: "ecoleId" });
Section.belongsToMany(EcolePrincipal, { through: EcoleSections, foreignKey: "sectionId" });
// Relations directes pour accéder à la table de jointure
Section.hasMany(EcoleSections, { foreignKey: "sectionId" });
EcoleSections.belongsTo(Section, { foreignKey: "sectionId" });
Ecole.hasMany(EcoleMatiere, { foreignKey: "ecoleeId" });
EcoleSections.belongsTo(Ecole, { foreignKey: "ecoleeId" });
EcolePrincipal.hasMany(EcoleSections, { foreignKey: "ecoleId" });
EcoleSections.belongsTo(EcolePrincipal, { foreignKey: "ecoleId" });

// Définition des relations dans UNE SEULE table au lieu de deux

Enseignant.belongsToMany(Section, { through: EnseignantClasse, foreignKey: "enseignantId" });
Section.belongsToMany(Enseignant, { through: EnseignantClasse, foreignKey: "classeId" });
Enseignant.belongsToMany(Matiere, { through: EnseignantClasse, foreignKey: "enseignantId" });
Matiere.belongsToMany(Enseignant, { through: EnseignantClasse, foreignKey: "matiereId" });
Enseignant.belongsToMany(Niveaux, { through: EnseignantClasse, foreignKey: "enseignantId" });
Niveaux.belongsToMany(Enseignant, { through: EnseignantClasse, foreignKey: "niveauId" });

EnseignantClasse.belongsTo(Enseignant, { foreignKey: 'enseignantId'});
EnseignantClasse.belongsTo(Matiere, { foreignKey: 'matiereId' });
EnseignantClasse.belongsTo(Section, { foreignKey: 'classeId' });
EnseignantClasse.belongsTo(Niveaux, { foreignKey: 'niveauId'});

Enseignant.hasMany(EnseignantClasse, { foreignKey: 'enseignantId' });
Matiere.hasMany(EnseignantClasse, { foreignKey: 'matiereId' });
Section.hasMany(EnseignantClasse, { foreignKey: 'classeId' });
Niveaux.hasMany(EnseignantClasse, { foreignKey: 'niveauId' });



// définition des relation de l'emploi de temps et (niveau, section,matiere,enseignant)
EmploiDuTemps.belongsTo(Enseignant, { foreignKey: 'enseignantId'});
EmploiDuTemps.belongsTo(Matiere, { foreignKey: 'matiereId' });
EmploiDuTemps.belongsTo(Section, { foreignKey: 'sectionId' });
EmploiDuTemps.belongsTo(Niveaux, { foreignKey: 'niveauId' });

Enseignant.hasMany(EmploiDuTemps, { foreignKey: 'enseignantId' });
Matiere.hasMany(EmploiDuTemps, { foreignKey: 'matiereId' });
Section.hasMany(EmploiDuTemps, { foreignKey: 'sectionId' });
Niveaux.hasMany(EmploiDuTemps, { foreignKey: 'niveauId' });




Niveaux.belongsToMany(Matiere, { through: NiveauxMatieres, foreignKey: 'niveauId' });
Matiere.belongsToMany(Niveaux, { through: NiveauxMatieres, foreignKey: 'matiereId' });
Enseignant.belongsToMany(Matiere, { through: NiveauxMatieres, foreignKey: "enseignantId" });
Matiere.belongsToMany(Enseignant, { through: NiveauxMatieres, foreignKey: "matiereId" });
// Relations directes pour accéder à la table de jointure
Matiere.hasMany(NiveauxMatieres, { foreignKey: "matiereId" });
NiveauxMatieres.belongsTo(Matiere, { foreignKey: "matiereId" });
Niveaux.hasMany(NiveauxMatieres, { foreignKey: "niveauId" });
NiveauxMatieres.belongsTo(Niveaux, { foreignKey: "niveauId" });
Enseignant.hasMany(NiveauxMatieres, { foreignKey: "enseignantId" });
NiveauxMatieres.belongsTo(Enseignant, { foreignKey: "enseignantId" });


// Dans votre fichier où vous définissez les associations
Note.belongsTo(User, { as: 'Eleve', foreignKey: 'EleveId' });
Note.belongsTo(User, { as: 'Enseignant', foreignKey: 'enseignantId' });
Note.belongsTo(Matiere, { foreignKey: 'matiereId' });
Note.belongsTo(Section, { foreignKey: 'sectionId' });
Note.belongsTo(PeriodeNote, { foreignKey: 'periodeId' });
Note.belongsTo(Anneescolaire, { foreignKey: 'annescolaireId' });
Note.belongsTo(Trimest, { foreignKey: 'trimestId' });

MoyenneGenerale.belongsTo(User, { as: 'Eleve', foreignKey: 'EleveId' });
MoyenneGenerale.belongsTo(User, { as: 'Enseignant', foreignKey: 'enseignantId' });
MoyenneGenerale.belongsTo(Matiere, { foreignKey: 'matiereId' });
MoyenneGenerale.belongsTo(Niveaux, { foreignKey: 'niveauId' });
MoyenneGenerale.belongsTo(Section, { foreignKey: 'sectionId' });
MoyenneGenerale.belongsTo(PeriodeNote, { foreignKey: 'periodeId' });
MoyenneGenerale.belongsTo(Anneescolaire, { foreignKey: 'annescolaireId' });
MoyenneGenerale.belongsTo(Trimest, { foreignKey: 'trimestId' });




Ecole.belongsToMany(Remarque, { through: EcoleRemarque, foreignKey: "ecoleeId" });
Remarque.belongsToMany(Ecole, { through: EcoleRemarque, foreignKey: "remarqueId" });
EcolePrincipal.belongsToMany(Remarque, { through: EcoleRemarque, foreignKey: "ecoleId" });
Remarque.belongsToMany(EcolePrincipal, { through: EcoleRemarque, foreignKey: "remarqueId" });
// Relations directes pour accéder à la table de jointure
Remarque.hasMany(EcoleRemarque, { foreignKey: "remarqueId" });
EcoleRemarque.belongsTo(Remarque, { foreignKey: "remarqueId" });
Ecole.hasMany(EcoleRemarque, { foreignKey: "ecoleeId" });
EcoleRemarque.belongsTo(Ecole, { foreignKey: "ecoleeId" });
EcolePrincipal.hasMany(EcoleRemarque, { foreignKey: "ecoleId" });
EcoleRemarque.belongsTo(EcolePrincipal, { foreignKey: "ecoleId" });


Devoire.belongsTo(User, { as: 'Enseignant', foreignKey: 'enseignantId' });
Devoire.belongsTo(Matiere, { foreignKey: 'matiereId' });
Devoire.belongsTo(Niveaux, { foreignKey: 'niveauId' });
Devoire.belongsTo(Section, { foreignKey: 'sectionId' });
Devoire.belongsTo(PeriodeNote, { foreignKey: 'periodeId' });
Devoire.belongsTo(Anneescolaire, { foreignKey: 'annescolaireId' });
Devoire.belongsTo(Trimest, { foreignKey: 'trimestId' });

Devoire.hasMany(TravailRendu, { foreignKey: 'devoirId' });
TravailRendu.belongsTo(Devoire, { foreignKey: 'devoirId' });

TravailRendu.belongsTo(Eleve, { foreignKey: 'eleveId' });



// gestion Stocks
Ecole.belongsToMany(Categorie, { through: EcoleCategorie, foreignKey: "ecoleeId" });
Categorie.belongsToMany(Ecole, { through: EcoleCategorie, foreignKey: "categorieId" });
EcolePrincipal.belongsToMany(Categorie, { through: EcoleCategorie, foreignKey: "ecoleId" });
Categorie.belongsToMany(EcolePrincipal, { through: EcoleCategorie, foreignKey: "categorieId" });
// Relations directes pour accéder à la table de jointure
Categorie.hasMany(EcoleCategorie, { foreignKey: "categorieId" });
EcoleCategorie.belongsTo(Categorie, { foreignKey: "categorieId" });
Ecole.hasMany(EcoleCategorie, { foreignKey: "ecoleeId" });
EcoleCategorie.belongsTo(Ecole, { foreignKey: "ecoleeId" });
EcolePrincipal.hasMany(EcoleCategorie, { foreignKey: "ecoleId" });
EcoleCategorie.belongsTo(EcolePrincipal, { foreignKey: "ecoleId" });

Ecole.belongsToMany(Article, { through: EcoleArticle, foreignKey: "ecoleeId" });
Article.belongsToMany(Ecole, { through: EcoleArticle, foreignKey: "articleId" });
EcolePrincipal.belongsToMany(Article, { through: EcoleArticle, foreignKey: "ecoleId" });
Article.belongsToMany(EcolePrincipal, { through: EcoleArticle, foreignKey: "articleId" });
// Relations directes pour accéder à la table de jointure
Article.hasMany(EcoleArticle, { foreignKey: "articleId" });
EcoleArticle.belongsTo(Article, { foreignKey: "articleId" });
Ecole.hasMany(EcoleArticle, { foreignKey: "ecoleeId" });
EcoleArticle.belongsTo(Ecole, { foreignKey: "ecoleeId" });
EcolePrincipal.hasMany(EcoleArticle, { foreignKey: "ecoleId" });
EcoleArticle.belongsTo(EcolePrincipal, { foreignKey: "ecoleId" });


Ecole.belongsToMany(Fournisseur, { through: EcoleFournisseur, foreignKey: "ecoleeId" });
Fournisseur.belongsToMany(Ecole, { through: EcoleFournisseur, foreignKey: "fournisseurId" });
EcolePrincipal.belongsToMany(Fournisseur, { through: EcoleFournisseur, foreignKey: "ecoleId" });
Fournisseur.belongsToMany(EcolePrincipal, { through: EcoleFournisseur, foreignKey: "fournisseurId" });
// Relations directes pour accéder à la table de jointure
Fournisseur.hasMany(EcoleFournisseur, { foreignKey: "fournisseurId" });
EcoleFournisseur.belongsTo(Fournisseur, { foreignKey: "fournisseurId" });
Ecole.hasMany(EcoleFournisseur, { foreignKey: "ecoleeId" });
EcoleFournisseur.belongsTo(Ecole, { foreignKey: "ecoleeId" });
EcolePrincipal.hasMany(EcoleFournisseur, { foreignKey: "ecoleId" });
EcoleFournisseur.belongsTo(EcolePrincipal, { foreignKey: "ecoleId" });


Ecole.belongsToMany(Achat, { through: EcoleAchat, foreignKey: "ecoleeId" });
Achat.belongsToMany(Ecole, { through: EcoleAchat, foreignKey: "achatId" });
EcolePrincipal.belongsToMany(Achat, { through: EcoleAchat, foreignKey: "ecoleId" });
Achat.belongsToMany(EcolePrincipal, { through: EcoleAchat, foreignKey: "achatId" });
// Relations directes pour accéder à la table de jointure
Achat.hasMany(EcoleAchat, { foreignKey: "achatId" });
EcoleAchat.belongsTo(Achat, { foreignKey: "achatId" });
Ecole.hasMany(EcoleAchat, { foreignKey: "ecoleeId" });
EcoleAchat.belongsTo(Ecole, { foreignKey: "ecoleeId" });
EcolePrincipal.hasMany(EcoleAchat, { foreignKey: "ecoleId" });
EcoleAchat.belongsTo(EcolePrincipal, { foreignKey: "ecoleId" });


//service et poste :
// Relations avec Poste via la table d'association
EcolePrincipal.belongsToMany(Poste, {  through: Ecole_SEcole_Postes, foreignKey: 'ecoleId', otherKey: 'posteId'});
Poste.belongsToMany(EcolePrincipal, { through: Ecole_SEcole_Postes, foreignKey: 'posteId',  otherKey: 'ecoleId'});
Ecole.belongsToMany(Poste, { 
  through: Ecole_SEcole_Postes, 
  foreignKey: 'ecoleeId',  
  otherKey: 'posteId'
});
Poste.belongsToMany(Ecole, { 
  through: Ecole_SEcole_Postes, 
  foreignKey: 'posteId',  
  otherKey: 'ecoleeId'
});

EcolePrincipal.hasMany(Ecole_SEcole_Postes, {foreignKey: 'ecoleId'});
Ecole_SEcole_Postes.belongsTo(EcolePrincipal,{foreignKey:'ecoleId'})

Poste.hasMany(Ecole_SEcole_Postes, {foreignKey: 'posteId'});
Ecole_SEcole_Postes.belongsTo(Poste,{foreignKey:'posteId'});

Ecole.hasMany(Ecole_SEcole_Postes, {foreignKey: 'ecoleeId'});
Ecole_SEcole_Postes.belongsTo(Ecole,{foreignKey:'ecoleeId'});


//services
EcolePrincipal.belongsToMany(Service, { through: Ecole_SEcole_Services, foreignKey: 'ecoleId',  otherKey: 'serviceId' });

Ecole.belongsToMany(Service, { through: Ecole_SEcole_Services, foreignKey: 'ecoleeId',  otherKey: 'serviceId' });

Service.belongsToMany(EcolePrincipal, { through: Ecole_SEcole_Services, foreignKey: 'serviceId',  otherKey: 'ecoleId' });

Service.belongsToMany(Ecole, { through: Ecole_SEcole_Services, foreignKey: 'serviceId',  otherKey: 'ecoleeId' });

EcolePrincipal.hasMany(Ecole_SEcole_Services, {foreignKey: 'ecoleId'});
Ecole_SEcole_Services.belongsTo(EcolePrincipal,{foreignKey:'ecoleId'})

Service.hasMany(Ecole_SEcole_Services, {foreignKey: 'serviceId'});
Ecole_SEcole_Services.belongsTo(Service,{foreignKey:'serviceId'});

Ecole.hasMany(Ecole_SEcole_Services, {foreignKey: 'serviceId'});
Ecole_SEcole_Services.belongsTo(Ecole,{foreignKey:'serviceId'})



//employe
Poste.hasMany(Employe, {
    foreignKey: 'poste', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Employe.belongsTo(Poste, {
    foreignKey: 'poste', 
  });

  Service.hasMany(Employe, {
    foreignKey: 'service', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Employe.belongsTo(Service, {
    foreignKey: 'service', 
  });

User.hasOne(Employe, { foreignKey: 'userId', });
Employe.belongsTo(User, { foreignKey: 'userId',  });

Employe.hasOne(Enseignant, { foreignKey: 'employe_id', });
Enseignant.belongsTo(Employe, { foreignKey: 'employe_id',  });


//conge et absences
CongeAbsence.belongsTo(Employe, { foreignKey: 'employe_id' });


EcolePrincipal.hasMany(CongeAnnuel, {foreignKey: "ecoleId"});
CongeAnnuel.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });

Ecole.hasMany(CongeAnnuel, {foreignKey: "ecoleeId"});
CongeAnnuel.belongsTo(Ecole, { foreignKey: 'ecoleeId' });

//conge absences et conge annuel
CongeAnnuel.hasMany(CongeAbsence, { foreignKey: 'idCA' });
CongeAbsence.belongsTo(CongeAnnuel, { foreignKey: 'idCA' });

//documents ecolep et secole

EcolePrincipal.hasMany(Attestation, {foreignKey: "ecoleId"});
Attestation.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });

Ecole.hasMany(Attestation, {foreignKey: "ecoleeId"});
Attestation.belongsTo(Ecole, { foreignKey: 'ecoleeId' });

//paie
EcolePrincipal.hasMany(Prime, {foreignKey: "ecoleId"});
Prime.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });

EcolePrincipal.hasMany(PeriodePaie, {foreignKey: "ecoleId"});
PeriodePaie.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });

EcolePrincipal.hasMany(HeuresSup, {foreignKey: "ecoleId"});
HeuresSup.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });

//parametre retard
EcolePrincipal.hasMany(ParametereRetard, {foreignKey: "ecoleId"});
ParametereRetard.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });

HeuresSup.hasMany(Pointage, {foreignKey: "IdHeureSup"});
Pointage.belongsTo(HeuresSup, { foreignKey: 'IdHeureSup' });

// PeriodePaie.hasOne(JournalPaie, { foreignKey: 'periodePaieId', onDelete: 'CASCADE', onUpdate: 'CASCADE',});
// JournalPaie.belongsTo(PeriodePaie, {foreignKey: 'periodePaieId',});

Employe.belongsToMany(PeriodePaie, { through: JournalPaie, foreignKey: 'idEmploye' });
PeriodePaie.belongsToMany(Employe, { through: JournalPaie, foreignKey: 'periodePaieId' });
Employe.hasMany(JournalPaie, { foreignKey: 'idEmploye' });
JournalPaie.belongsTo(Employe, { foreignKey: 'idEmploye' });
PeriodePaie.hasMany(JournalPaie, { foreignKey: 'periodePaieId' });
JournalPaie.belongsTo(PeriodePaie, { foreignKey: 'periodePaieId' });

// idEmploye periodePaieId

//Prime_Employe

User.belongsToMany(Ecole, { through: UserEcole, foreignKey: 'userId' });
Ecole.belongsToMany(User, { through: UserEcole, foreignKey: 'ecoleeId' });
User.hasMany(UserEcole, { foreignKey: 'userId' });
UserEcole.belongsTo(User, { foreignKey: 'userId' });
Ecole.hasMany(UserEcole, { foreignKey: 'ecoleeId' });
UserEcole.belongsTo(Ecole, { foreignKey: 'ecoleeId' });


Prime.belongsToMany(Employe, { through:Prime_Employe , foreignKey: 'PrimeId' });
Employe.belongsToMany(Prime, { through: Prime_Employe, foreignKey: 'EmployeId' });

Prime.hasMany(Prime_Employe, { foreignKey: 'PrimeId' });
Prime_Employe.belongsTo(Prime, { foreignKey: 'PrimeId' });

Employe.hasMany(Prime_Employe, { foreignKey: 'EmployeId' });
Prime_Employe.belongsTo(Employe, { foreignKey: 'EmployeId' });

Employe.hasMany(Pointage, { foreignKey: 'employe_id' });
Pointage.belongsTo(Employe, { foreignKey: 'employe_id' });

EcolePrincipal.hasMany(JoursFeries, { foreignKey: 'ecoleId' });
JoursFeries.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });


//comptabilite:
// type revenues
EcolePrincipal.hasMany(TypeRevenue, {foreignKey: "ecoleId"});
TypeRevenue.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });
Ecole.hasMany(TypeRevenue, {foreignKey: "ecoleeId"});
TypeRevenue.belongsTo(Ecole, { foreignKey: 'ecoleeId' });
// type depenses
EcolePrincipal.hasMany(TypeDepense, {foreignKey: "ecoleId"});
TypeDepense.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });
Ecole.hasMany(TypeDepense, {foreignKey: "ecoleeId"});
TypeDepense.belongsTo(Ecole, { foreignKey: 'ecoleeId' });


// gestion  revenues
EcolePrincipal.hasMany(Revenu, {foreignKey: "ecoleId"});
Revenu.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });
Ecole.hasMany(Revenu, {foreignKey: "ecoleeId"});
Revenu.belongsTo(Ecole, { foreignKey: 'ecoleeId' });
TypeRevenue.hasMany(Revenu, {foreignKey: "typeId"});
Revenu.belongsTo(TypeRevenue, { foreignKey: 'typeId' });


// gestion  depenses
EcolePrincipal.hasMany(Depense, {foreignKey: "ecoleId"});
Depense.belongsTo(EcolePrincipal, { foreignKey: 'ecoleId' });
Ecole.hasMany(Depense, {foreignKey: "ecoleeId"});
Depense.belongsTo(Ecole, { foreignKey: 'ecoleeId' });
TypeDepense.hasMany(Depense, {foreignKey: "typeId"});
Depense.belongsTo(TypeDepense, { foreignKey: 'typeId' });

//paiments etudiants
Niveaux.hasMany(Contrat, {foreignKey: "niveauId"});
Contrat.belongsTo(Niveaux, {foreignKey: "niveauId"});

Anneescolaire.hasMany(Contrat, {foreignKey: "annescolaireId"});
Contrat.belongsTo(Anneescolaire, {foreignKey: "annescolaireId"});

Eleve.hasMany(Contrat, {foreignKey: "eleveId"});
Contrat.belongsTo(Eleve, {foreignKey: "eleveId"});

Contrat.hasMany(PlanningPaiement, {foreignKey: "ContratId"});
PlanningPaiement.belongsTo(Contrat, {foreignKey: "ContratId"});

export { User, Role, UserRole, EcolePrincipal, Ecole, UserEcole, CycleScolaire };