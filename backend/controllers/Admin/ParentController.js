import Parent from '../../models/Admin/Parent.js';
import User from '../../models/User.js';
import Eleve from '../../models/Admin/Eleve.js';
import UserEcole from '../../models/Admin/UserEcole.js';
import { Op } from 'sequelize';

export const ListeParents = async (req, res) => {
    try {
        const ecoleId = req.user.ecoleId;
        const roles = req.user.roles;
        const userId = req.user.id;

        console.log('🟢 ecoleId:', ecoleId);
        console.log('🟢 roles:', roles);
        console.log('🟢 userId:', userId);

        const isAdminPrincipal = roles.includes('AdminPrincipal');
        const isAdmin = roles.includes('Admin');

        let listeParents = [];
        let ecoleIds = [];

        if (isAdminPrincipal) {
            console.log("🔹 Rôle: AdminPrincipal - Filtrage par User.ecoleId");
            ecoleIds = [ecoleId];
        } else if (isAdmin) {
            console.log("🔹 Rôle: Admin - Récupération des écoles via UserEcole");
            const userEcoles = await UserEcole.findAll({
                where: { userId: userId },
                attributes: ['ecoleeId']
            });
            ecoleIds = userEcoles.map((ue) => ue.ecoleeId);
            console.log("🏫 Écoles associées à cet Admin:", ecoleIds);
        }

        if (isAdminPrincipal) {
            listeParents = await User.findAll({
                where: {
                    type: 'Parent',
                    ecoleId: { [Op.in]: ecoleIds }
                },
                include: [
                    {
                        model: Parent,
                        attributes: ['typerole'],
                        include: [
                            {
                                model: Eleve,
                                through: { attributes: [] },
                                include: [
                                    {
                                        model: User,
                                        attributes: ['nom', 'prenom', 'email', 'telephone']
                                    }
                                ]
                            }
                        ]
                    }
                ],
                attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'username'],
                logging: console.log
            });
        } else if (isAdmin) {
            listeParents = await User.findAll({
                include: [
                    {
                        model: UserEcole,
                        where: { ecoleeId: { [Op.in]: ecoleIds } },
                        attributes: []
                    },
                    {
                        model: Parent,
                        attributes: ['typerole'],
                        include: [
                            {
                                model: Eleve,
                                through: { attributes: [] },
                                include: [
                                    {
                                        model: User,
                                        attributes: ['nom', 'prenom', 'email', 'telephone']
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {
                    type: 'Parent'
                },
                attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'username'],
                logging: console.log
            });
        }

        console.log("✅ Parents trouvés :", JSON.stringify(listeParents, null, 2));
        res.status(200).json({ listeParents });

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des parents :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
};

export const getParentById = async (req, res) => {
    try {
        const parentId = req.params.id;
        const parent = await User.findByPk(parentId, {
            include: [
                {
                    model: Parent,
                    include: [
                        {
                            model: Eleve,
                            through: { attributes: [] },
                            include: [
                                {
                                    model: User,
                                    attributes: ['nom', 'prenom', 'email', 'telephone']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!parent) {
            return res.status(404).json({ message: "Parent non trouvé" });
        }

        res.status(200).json(parent);
    } catch (error) {
        console.error("Erreur lors de la récupération du parent:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

export const createParent = async (req, res) => {
    try {
        const { nom, prenom, email, telephone, username, password, typerole } = req.body;
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur parent
        const newUser = await User.create({
            nom,
            prenom,
            email,
            telephone,
            username,
            password: hashedPassword,
            type: 'Parent'
        });

        // Créer l'entrée dans la table Parent
        const newParent = await Parent.create({
            userId: newUser.id,
            typerole: typerole || 'Parent'
        });

        res.status(201).json({ user: newUser, parent: newParent });
    } catch (error) {
        console.error("Erreur lors de la création du parent:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

export const updateParent = async (req, res) => {
    try {
        const parentId = req.params.id;
        const { nom, prenom, email, telephone, username, password, typerole } = req.body;

        const parent = await User.findByPk(parentId, {
            include: [Parent]
        });

        if (!parent) {
            return res.status(404).json({ message: "Parent non trouvé" });
        }

        // Mettre à jour les informations de base
        parent.nom = nom || parent.nom;
        parent.prenom = prenom || parent.prenom;
        parent.email = email || parent.email;
        parent.telephone = telephone || parent.telephone;
        parent.username = username || parent.username;

        if (password) {
            parent.password = await bcrypt.hash(password, 10);
        }

        await parent.save();

        // Mettre à jour le type de rôle si spécifié
        if (typerole && parent.Parent) {
            parent.Parent.typerole = typerole;
            await parent.Parent.save();
        }

        res.status(200).json(parent);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du parent:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

export const deleteParent = async (req, res) => {
    try {
        const parentId = req.params.id;
        
        // Trouver le parent avec ses relations
        const parent = await User.findByPk(parentId, {
            include: [Parent]
        });

        if (!parent) {
            return res.status(404).json({ message: "Parent non trouvé" });
        }

        // Supprimer d'abord l'entrée Parent si elle existe
        if (parent.Parent) {
            await parent.Parent.destroy();
        }

        // Puis supprimer l'utilisateur
        await parent.destroy();

        res.status(200).json({ message: "Parent supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du parent:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};