import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import matiereIcon from '../../assets/imgs/categories.png';
import add from '../../assets/imgs/add.png';
import addbtn from '../../assets/imgs/addbtn.png';
import edite from '../../assets/imgs/edit.png';
import delet from '../../assets/imgs/archive.png';
import '../Academiques/modal.css';
import fournisseurIcon from '../../assets/imgs/supplier.png';
import achatIcon from '../../assets/imgs/add-to-cart.png';
import articleIcon from '../../assets/imgs/checklist.png';
import categorieIcon from '../../assets/imgs/categories.png';
import stock from '../../assets/imgs/stock.png';
import Select from 'react-select';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import pedagogique from '../../assets/imgs/supplies.png';

const GestionAcademiqueAutres = () => {
    const [achats, setAchats] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [categories, setCategories] = useState([]);
    const [values, setValues] = useState({
        articleId: null,
        fournisseurId: null,
        categorieId: null,
        prix: '',
        quantite: '',
        devise: 'DZ',
        th: '',
        tva: '',
        unite: '',
        date_achat: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
        date_peremption: '',
        description: '',
        magasin: 'divers',
        employeId: null,
        articleId: null,
        nomcomplet: '',
        date_sortie: new Date().toISOString().split('T')[0]
    });
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [ecoleId, setEcoleId] = useState(null);
    const [ecoleeId, setEcoleeId] = useState(null);
    const [step, setStep] = useState(1);
    const [showModalArticle, setShowModalArticle] = useState(false);
    const [articles, setArticles] = useState([]);
    const [stepArticle, setStepArticle] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showModalAchats, setShowModalAchats] = useState(false);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [isManualTH, setIsManualTH] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [isExterne, setIsExterne] = useState(false);
    const [data, setdata] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [sorties, setSorties] = useState([]);
    const [showModalsortie, setShowModalsortie] = useState(false);
    const [showModalFournisseur, setShowModalFournisseur] = useState(false);
    // États pour les filtres
    const [filterMonth, setFilterMonth] = useState('');
    const [filterFournisseur, setFilterFournisseur] = useState(null);
    const [filterArticle, setFilterArticle] = useState(null);
    const [filterCategorie, setFilterCategorie] = useState(null);

    const [filterMonthSortie, setFilterMonthSortie] = useState('');
    const [filterArticleSortie, setFilterArticleSortie] = useState(null);
    const [filterCategorieSortie, setFilterCategorieSortie] = useState(null);
    const [filterTypeSortie, setFilterTypeSortie] = useState(null);

    const [filterArticleStock, setFilterArticleStock] = useState(null);
    const [filterCategorieStock, setFilterCategorieStock] = useState(null);
    const [filterEtatStock, setFilterEtatStock] = useState(null);

    useEffect(() => {
        if (!isManualTH && values.prix && values.quantite) {
            const prix = parseFloat(values.prix);
            const quantite = parseFloat(values.quantite);
            if (!isNaN(prix) && !isNaN(quantite)) {
                setValues(prev => ({
                    ...prev,
                    th: (prix * quantite).toFixed(2)
                }));
            }
        }
    }, [values.prix, values.quantite, isManualTH]);
    const handleTHChange = (e) => {
        setIsManualTH(true);
        handleChange(e);
    };


    const styles = {
        mainContainer: {
            padding: "5px",
            maxWidth: "1200px",
            margin: "0 auto"
        },
        rowStyle: {
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap"
        },
        boxStyle: {
            flex: "1 1 30%",
            textAlign: "center",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            textDecoration: "none",
            color: "black",
            minWidth: "100px",
            cursor: "pointer"
        },
        imageStyle: {
            width: "50px",
            height: "50px",
            objectFit: "contain"
        },
        titleStyle: {
            marginTop: "10px",
            fontSize: "14px",
            fontWeight: "500"
        }
    };

    useEffect(() => {
        const storedEcoleId = localStorage.getItem("ecoleId");
        const storedEcoleeId = localStorage.getItem("ecoleeId");
        if (storedEcoleId) setEcoleId(storedEcoleId);
        if (storedEcoleeId) setEcoleeId(storedEcoleeId);
        fetchCategories();
        fetchArticles();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }
            const res = await axios.get('http://localhost:5000/categorie', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    magasin: 'divers' // Ajout du paramètre magasin
                }
            });
            if (Array.isArray(res.data)) {
                setCategories(res.data);
            } else {
                setCategories([]);
                console.error("L'API n'a pas retourné un tableau.");
            }
        } catch (err) {
            console.error("Erreur de chargement des catégories", err);
            setCategories([]);
        }
    };

    const fetchArticles = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }
            const res = await axios.get('http://localhost:5000/article', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    magasin: 'divers' // Ajout du paramètre magasin
                }
            });
            setArticles(res.data);
        } catch (err) {
            console.error("Erreur de chargement des articles", err);
            setArticles([]);
        }
    };


    const filteredCategories = categories.filter(c =>
        c && typeof c.libelle === 'string' &&
        c.libelle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredArticles = articles.filter(a =>
        a && (a.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.code_article?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.Categorie?.libelle?.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    // const filteredAchats = achats.filter(a =>
    //     a.Article?.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     a.Fournisseur?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     a.prix.toString().includes(searchTerm)
    // );

    const filteredFournisseurs = fournisseurs.filter(f =>
        (f.nom && f.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.contact && f.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (f.email && f.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pour le Select des catégories dans le formulaire article
    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.libelle
    }));
    const articleOptions = articles.map(cat => ({
        value: cat.id,
        label: cat.libelle
    }));

    console.log('sorties:', sorties);

    const filteredAchats = achats.filter(a => {
        const matchesSearch =
            a.Article?.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.Fournisseur?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.prix.toString().includes(searchTerm);

        const matchesMonth = filterMonth ?
            new Date(a.date_achat).getMonth() + 1 === parseInt(filterMonth) : true;

        const matchesFournisseur = filterFournisseur ?
            a.fournisseurId === filterFournisseur : true;

        const matchesArticle = filterArticle ?
            a.articleId === filterArticle : true;

        const matchesCategorie = filterCategorie ?
            a.categorieId === filterCategorie : true;

        return matchesSearch && matchesMonth && matchesFournisseur &&
            matchesArticle && matchesCategorie;
    });

    const filteredSorties = Array.isArray(sorties) ? sorties.filter(s => {
        const matchesSearch =
            s.article?.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.employe ? `${s.employe.User.nom} ${s.employe.User.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) :
                s.nomcomplet?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            s.quantite.toString().includes(searchTerm);

        const matchesMonth = filterMonthSortie ?
            new Date(s.date_sortie).getMonth() + 1 === parseInt(filterMonthSortie) : true;

        const matchesArticle = filterArticleSortie ?
            s.articleId === filterArticleSortie : true;

        const matchesCategorie = filterCategorieSortie ?
            s.article?.categorieId === filterCategorieSortie : true;

        const matchesType = filterTypeSortie ?
            (filterTypeSortie === 'interne' ? s.employeId !== null : s.nomcomplet !== null) : true;

        return matchesSearch && matchesMonth && matchesArticle &&
            matchesCategorie && matchesType;
    }) : [];

    const filteredStocks = stocks.filter(s => {
        const matchesSearch =
            s.article?.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.quantite.toString().includes(searchTerm);

        const matchesArticle = filterArticleStock ?
            s.articleId === filterArticleStock : true;

        const matchesCategorie = filterCategorieStock ?
            s.article?.categorieId === filterCategorieStock : true;

        const matchesEtat = filterEtatStock ?
            (filterEtatStock === 'low' ? s.stockRestant < 10 : s.stockRestant <= 0) : true;

        return matchesSearch && matchesArticle && matchesCategorie && matchesEtat;
    });


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
    const currentAchat = filteredAchats.slice(indexOfFirstItem, indexOfLastItem);
    const currentSorties = filteredSorties.slice(indexOfFirstItem, indexOfLastItem);
    const currentStocks = filteredStocks.slice(indexOfFirstItem, indexOfLastItem);
    const currentItemsFournisseur = filteredFournisseurs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Fonctions pour la gestion des catégories
    const handleShowModal = () => {
        setShowModal(true);
        setValues({});
        setIsEdit(false);
        setStep(1); // Afficher directement la liste
        fetchCategories(); // Recharger les données
    };

    const handleEdit = (categorie) => {
        setValues(categorie);
        setSelectedId(categorie.id);
        setShowModal(true);
        setIsEdit(true);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            await axios.delete(`http://localhost:5000/categorie/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCategories();
            setSuccess('Catégorie archivée');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur de suppression');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé.');
            setError('Non autorisé');
            return;
        }

        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/categorie/${selectedId}`, {
                    libelle: values.libelle,
                    description: values.description,
                    magasin: values.magasin // Ajout du champ magasin
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Catégorie modifiée');
            } else {
                await axios.post('http://localhost:5000/categorie/save', {
                    ...values,
                    magasin: values.magasin || 'divers', // Ajout du champ magasin
                    ecoleId: ecoleId !== 'null' ? ecoleId : null,
                    ecoleeId: ecoleeId !== 'null' ? ecoleeId : null,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Catégorie ajoutée');
            }

            fetchCategories();
            setStep(1);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de lenregistrement');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Fonctions pour la gestion des articles
    const handleShowModalArticle = () => {
        setShowModalArticle(true);
        setValues({
            code_article: '',
            libelle: '',
            description: '',
            magasinier: '',
            categorieId: null
        });
        setIsEdit(false);
        setStepArticle(1); // Afficher directement la liste
        fetchArticles(); // Recharger les données
    };

    const handleEditArticle = (article) => {
        setValues({
            ...article,
            categorieId: categoryOptions.find(opt => opt.value === article.categorieId)
        });
        setSelectedId(article.id);
        setShowModalArticle(true);
        setIsEdit(true);
    };

    const handleDeleteArticle = async (id) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            await axios.delete(`http://localhost:5000/article/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchArticles();
            setSuccess('Article archivé');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur de suppression');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmitArticle = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé.');
            setError('Non autorisé');
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                ...values,
                categorieId: values.categorieId?.value || null,
                magasinier: values.magasinier || '',
                magasin: values.magasin || 'divers' // Ajout du champ magasin
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/article/${selectedId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Article modifié');
            } else {
                await axios.post('http://localhost:5000/article', {
                    ...payload,
                    ecoleId: ecoleId !== 'null' ? ecoleId : null,
                    ecoleeId: ecoleeId !== 'null' ? ecoleeId : null,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Article ajouté');
            }

            fetchArticles();
            setStepArticle(1);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de lenregistrement');
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setValues(prev => ({
            ...prev,
            [name]: selectedOption
        }));
    };


    useEffect(() => {
        fetchAchats();
        fetchFournisseurs();
    }, []);

    const fetchAchats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            const res = await axios.get('http://localhost:5000/achat', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    magasin: 'divers' // ✅ Ajout du paramètre
                }
            });

            setAchats(res.data);
        } catch (err) {
            console.error("Erreur de chargement des achats", err);
            setError('Erreur de chargement des achats');
        }
    };


    const fetchFournisseurs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Aucun token trouvé. Veuillez vous connecter.');
                return;
            }

            const res = await axios.get('http://localhost:5000/fournisseur', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    magasin: 'divers' // Filtrage par magasin
                }
            });

            if (Array.isArray(res.data)) {
                setFournisseurs(res.data); // Stockez les données brutes
            } else {
                console.error("L'API n'a pas retourné un tableau.");
                setFournisseurs([]);
            }
        } catch (err) {
            console.error("❌ Erreur de chargement des fournisseurs", err);
            setFournisseurs([]);
        }
    };

    const handleShowModalAchats = () => {
        setShowModalAchats(true);
        setValues({
            articleId: null,
            fournisseurId: null,
            prix: '',
            devise: 'DZ',
            tva: '',
            unite: '',
            date_achat: new Date(),
            date_peremption: null,
            description: ''
        });
        setIsEdit(false);
    };

    const handleEditAchats = (achat) => {
        setValues({
            articleId: articles.find(a => a.value === achat.articleId),
            fournisseurId: fournisseurs.find(f => f.value === achat.fournisseurId),
            categorieId: categories.find(c => c.value === achat.categorieId),
            prix: achat.prix,
            quantite: achat.quantite,
            devise: achat.devise,
            th: achat.th,
            tva: achat.tva,
            unite: achat.unite,
            date_achat: achat.date_achat.split('T')[0],
            date_peremption: achat.date_peremption ? achat.date_peremption.split('T')[0] : '',
            description: achat.description,
            magasin: achat.magasin
        });
        setSelectedId(achat.id);
        setShowModalAchats(true);
        setIsEdit(true);
    };

    const handleDeleteAchats = async (id) => {
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/achat/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAchats();
            setSuccess('Achat supprimé');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur de suppression');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmitAchats = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            const payload = {
                articleId: values.articleId.value,
                fournisseurId: values.fournisseurId.value,
                categorieId: values.categorieId.value,
                prix: parseFloat(values.prix),
                quantite: parseFloat(values.quantite),
                devise: values.devise,
                th: values.th ? parseFloat(values.th) : null,
                tva: values.tva ? parseFloat(values.tva) : null,
                unite: values.unite,
                date_achat: values.date_achat,
                date_peremption: values.date_peremption || null,
                description: values.description,
                magasin: values.magasin || 'divers',
                ecoleId: ecoleId !== 'null' ? ecoleId : null,
                ecoleeId: ecoleeId !== 'null' ? ecoleeId : null
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/achat/${selectedId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('Achat modifié');
            } else {
                await axios.post('http://localhost:5000/achat', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('Achat ajouté');
            }

            setShowModalAchats(false);
            fetchAchats();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleListeEmploye()
        //  handleListePostes();
    }, [])
    useEffect(() => {
        fetchStocks();
        fetchSorties();
        fetchAchats();
    }, []);

    const handleListeEmploye = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Vous devez être connecté");
                return;
            }
            const response = await axios.get('http://localhost:5000/employes/liste', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const employeeOptions = response.data
                .filter(emp => emp.declaration == 1)
                .map(emp => ({
                    value: emp.id,
                    label: (
                        <div>
                            {emp.User.nom} {emp.User.prenom}{"    "}
                            <small className='muted'>
                                {emp.CE || ''}
                            </small>
                        </div>
                    )
                }));

            setEmployees(employeeOptions);
            // console.log('liste des employe', response.data)
            setdata(response.data)
            // setFilteredData(response.data);
        } catch (error) {
            console.log("Erreur lors de la récupération des employes", error)
        }
    }

    const fetchStocks = async () => {
        try {
            const token = localStorage.getItem('token');
            const [achatsRes, sortiesRes] = await Promise.all([
                axios.get('http://localhost:5000/achat', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { magasin: 'divers' }
                }),
                axios.get('http://localhost:5000/sortie', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { magasin: 'divers' }
                })
            ]);

            const stocksMap = {};

            // Traitement des achats
            achatsRes.data.forEach(achat => {
                if (!stocksMap[achat.articleId]) {
                    stocksMap[achat.articleId] = {
                        article: achat.Article,
                        totalAchat: 0,
                        totalSortie: 0,
                        totalPrix: 0, // Nouveau: somme des prix * quantité
                        totalQuantite: 0, // Nouveau: quantité totale achetée
                        unite: achat.unite
                    };
                }

                const quantite = parseFloat(achat.quantite);
                const prix = parseFloat(achat.prix);

                stocksMap[achat.articleId].totalAchat += quantite;
                stocksMap[achat.articleId].totalPrix += prix * quantite; // Prix total pondéré
                stocksMap[achat.articleId].totalQuantite += quantite;

                if (!stocksMap[achat.articleId].unite && achat.unite) {
                    stocksMap[achat.articleId].unite = achat.unite;
                }
            });

            // Traitement des sorties
            if (Array.isArray(sortiesRes.data)) {
                sortiesRes.data.forEach(sortie => {
                    if (stocksMap[sortie.articleId]) {
                        stocksMap[sortie.articleId].totalSortie += parseFloat(sortie.quantite);
                    }
                });
            }

            // Conversion en tableau
            const stocks = Object.keys(stocksMap).map(key => {
                const stock = stocksMap[key];
                const stockRestant = stock.totalAchat - stock.totalSortie;
                const prixMoyen = stock.totalQuantite > 0 ? stock.totalPrix / stock.totalQuantite : 0;

                return {
                    articleId: key,
                    article: stock.article,
                    totalAchat: stock.totalAchat,
                    totalSortie: stock.totalSortie,
                    stockRestant: stockRestant,
                    unite: stock.unite || 'unité',
                    prixMoyen: prixMoyen, // Prix moyen pondéré
                    valeurStock: stockRestant * prixMoyen
                };
            });

            setStocks(stocks);
        } catch (err) {
            console.error("Erreur de chargement des stocks", err);
        }
    };

    const fetchSorties = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/sortie', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    magasin: 'divers' // filtrage par magasin
                }
            });
            setSorties(res.data);
        } catch (err) {
            console.error("Erreur de chargement des sorties", err);
        }
    };

    const handleSubmitsortie = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');

        try {
            const payload = {
                articleId: values.articleId.value,
                employeId: !isExterne ? values.employeId?.value : null,
                quantite: parseFloat(values.quantite),
                nomcomplet: isExterne ? values.nomcomplet : null,
                isExterne,
                ecoleId: ecoleId !== 'null' ? ecoleId : null,
                ecoleeId: ecoleeId !== 'null' ? ecoleeId : null,
                magasin: values.magasin || 'divers',
                date_sortie: values.date_sortie || new Date().toISOString().split('T')[0]
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/sortie/${selectedId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('Sortie modifiée');
            } else {
                await axios.post('http://localhost:5000/sortie', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('Sortie enregistrée');
            }

            setShowModalsortie(false);
            fetchSorties();
            fetchStocks();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditsortie = (sortie) => {
        setValues({
            employeId: sortie.employeId ? employees.find(e => e.value === sortie.employeId) : null,
            articleId: articles.find(a => a.value === sortie.articleId),
            quantite: sortie.quantite,
            nomcomplet: sortie.nomcomplet || '',
            date_sortie: sortie.date_sortie.split('T')[0],
            magasin: sortie.article?.magasin || 'divers' // dépend si tu récupères `article.magasin`
        });

        setIsExterne(!!sortie.nomcomplet);
        setSelectedId(sortie.id);
        setShowModalsortie(true);
        setIsEdit(true);
    };

    const handleDeletesortie = async (id) => {
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/sortie/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSorties();
            fetchStocks();
            setSuccess('Sortie supprimée');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur de suppression');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleShowModalFournisseur = () => {
        setShowModalFournisseur(true);
        setValues({
            nom: '',
            contact: '',
            email: '',
            adresse: '',
            telephone: '',
        });
        setIsEdit(false);
    };

    const handleEditForunisseur = (fournisseur) => {
        setValues({
            nom: fournisseur.nom,
            contact: fournisseur.contact,
            email: fournisseur.email,
            adresse: fournisseur.adresse,
            telephone: fournisseur.telephone,
            magasin: fournisseur.magasin
        });
        setSelectedId(fournisseur.id);
        setShowModalFournisseur(true);
        setIsEdit(true);
    };

    const handleDeleteFournisseur = async (id) => {
        const token = localStorage.getItem('token');
        if (!window.confirm('Confirmer l\'archivage du fournisseur ?')) return;
        try {
            await axios.delete(`http://localhost:5000/fournisseur/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchFournisseurs();
            setSuccess('Fournisseur archivé');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de l\'archivage');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSubmitFournisseur = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Aucun token trouvé.');
            setError('Non autorisé');
            setIsLoading(false);
            return;
        }

        try {
            const fournisseurData = {
                ...values,
                magasin: values.magasin || 'divers'
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/fournisseur/${selectedId}`, fournisseurData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Fournisseur modifié');
            } else {
                await axios.post('http://localhost:5000/fournisseur', fournisseurData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSuccess('Fournisseur ajouté');
            }

            setShowModalFournisseur(false);
            fetchFournisseurs();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de l\'enregistrement');
            setTimeout(() => setError(''), 3000);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.mainContainer}>
            <nav>
                <Link to="/dashboard">Accueil</Link> / Autres éléments Académiques
            </nav>

            <div className="card card-primary card-outline">
                <div className="card-header d-flex" style={{ backgroundColor: '#F8F8F8' }}>
                    <img src={pedagogique} alt="" width="90px" />
                    <p className="card-title mt-5 ml-2 p-2 text-center" style={{
                        width: '350px',
                        borderRadius: '50px',
                        border: '1px solid rgb(215, 214, 216)'
                    }}>
                        Magasin Restauration
                    </p>
                </div>

                <div className="card-body">
                    <div className="tab-content">
                        <div className="tab-pane fade show active">
                            <div style={styles.rowStyle}>
                                <div style={styles.boxStyle} onClick={() => setSelectedSection("achat")} >
                                    <img src={achatIcon} alt="Achats" style={styles.imageStyle} />
                                    <p style={styles.titleStyle}>Gestion des entrés (achats)</p>
                                </div>
                                <div style={styles.boxStyle} onClick={() => setSelectedSection("sortie")}>
                                    <img src={achatIcon} alt="Achats" style={styles.imageStyle} />
                                    <p style={styles.titleStyle}>Gestion des sortie</p>
                                </div>
                                <div style={styles.boxStyle} onClick={() => setSelectedSection("stocks")}>
                                    <img src={achatIcon} alt="Achats" style={styles.imageStyle} />
                                    <p style={styles.titleStyle}>Gestion de stocks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {selectedSection === "achat" && (
                <div className="card card-primary card-outline" id="achat">
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                                <button className="btn btn-app p-1" onClick={handleShowModalAchats}>
                                    <img src={add} alt="" width="30px" /><br />
                                    Ajouter
                                </button>

                                <div className="input-group" style={{ maxWidth: '300px' }}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Rechercher un achat"
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="text-end">
                                <strong>Total : {filteredAchats.reduce((sum, achat) => {
                                    const th = parseFloat(achat.th) || 0;
                                    const tva = parseFloat(achat.tva) || 0;
                                    return sum + (th + (th * tva / 100));
                                }, 0).toFixed(2)} DZ</strong>
                            </div>
                        </div>

                        {/* Nouveaux filtres */}
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <select
                                    className="form-control"
                                    onChange={(e) => setFilterMonth(e.target.value)}
                                >
                                    <option value="">Tous les mois</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                                        return <option key={i} value={i + 1}>{month}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <Select
                                    options={fournisseurs.map(f => ({ value: f.id, label: f.nom }))}
                                    onChange={(selected) => setFilterFournisseur(selected ? selected.value : null)}
                                    placeholder="Filtrer par fournisseur"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-3">
                                <Select
                                    options={articles.map(a => ({ value: a.id, label: a.libelle }))}
                                    onChange={(selected) => setFilterArticle(selected ? selected.value : null)}
                                    placeholder="Filtrer par article"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-3">
                                <Select
                                    options={categories.map(c => ({ value: c.id, label: c.libelle }))}
                                    onChange={(selected) => setFilterCategorie(selected ? selected.value : null)}
                                    placeholder="Filtrer par catégorie"
                                    isClearable
                                />
                            </div>
                        </div>

                        <div style={{ maxHeight: '400px', overflowX: 'auto', overflowY: 'auto' }}>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Catégorie</th>
                                        <th>Article</th>
                                        <th>Fournisseur</th>
                                        <th>Prix Unitaire</th>
                                        <th>Quantité</th>
                                        <th>TH (DA)</th>
                                        <th>TVA (%)</th>
                                        <th>TTC (DA)</th>
                                        <th>Date Achat</th>
                                        <th>Date Péremption</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAchat.map((achat) => {
                                        const th = parseFloat(achat.th) || 0;
                                        const tva = parseFloat(achat.tva) || 0;
                                        const ttc = (th + (th * tva / 100)).toFixed(2);

                                        return (
                                            <tr key={achat.id}>
                                                <td>{achat.Categorie?.libelle}</td>
                                                <td>{achat.Article?.libelle}</td>
                                                <td>{achat.Fournisseur?.nom}</td>
                                                <td>{achat.prix} {achat.devise}</td>
                                                <td>{achat.quantite} {achat.unite}</td>
                                                <td>{th.toFixed(2)}</td>
                                                <td>{tva}</td>
                                                <td>{ttc}</td>
                                                <td>{new Date(achat.date_achat).toLocaleDateString()}</td>
                                                <td>{achat.date_peremption ? new Date(achat.date_peremption).toLocaleDateString() : '-'}</td>
                                                <td>
                                                    <button onClick={() => handleEditAchats(achat)} className="btn btn-outline-success">
                                                        <img src={edite} alt="Modifier" width="20px" />
                                                    </button>
                                                    <button onClick={() => handleDeleteAchats(achat.id)} className="btn btn-outline-danger">
                                                        <img src={delet} alt="Supprimer" width="20px" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-center">
                            <p><strong>Total de lignes : </strong>{filteredAchats.length}</p>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-outline-primary"
                            >
                                Précédent
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-outline-primary"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                    <div className={`modal fade ${showModalAchats ? 'show' : ''}`} style={{ display: showModalAchats ? 'block' : 'none' }} tabIndex="-1" role="dialog" width={250}>
                        <div className="modal-dialog modal-xl modal-custom" role="document" style={{ maxWidth: '55%', width: '55%' }}>
                            <div className="modal-content modal-custom-content">
                                <form onSubmit={handleSubmitAchats}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">{isEdit ? 'Modifier un Achat' : 'Ajouter un Achat'}</h5>
                                        <button type="button" className="close" onClick={() => setShowModalAchats(false)}>
                                            <span>&times;</span>
                                        </button>
                                    </div>

                                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        <div className="form-group d-flex align-items-center" style={{ marginLeft: '10px', width: '650px' }}>
                                            <div className="form-group" style={{ flex: 1 }}>
                                                <Select
                                                    name="categorieId"
                                                    options={categoryOptions}
                                                    value={values.categorieId}
                                                    onChange={handleSelectChange}
                                                    placeholder="Sélectionner une catégorie"
                                                    styles={{
                                                        container: (base) => ({
                                                            ...base,
                                                            width: '90%',  // Prend toute la largeur disponible
                                                            marginLeft: '60px',
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            backgroundColor: '#F0F2F8',
                                                            borderRadius: '50px',
                                                            margin: '10px 0',
                                                            padding: '2px 10px',
                                                            boxShadow: state.isFocused ? '0 0 0 2px rgba(90, 203, 207, 0.5)' : '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                                            minHeight: '50px',
                                                            borderColor: state.isFocused ? '#5ACBCF' : '#ced4da',
                                                            '&:hover': {
                                                                borderColor: '#5ACBCF'
                                                            },
                                                        }),
                                                        valueContainer: (base) => ({
                                                            ...base,
                                                            flexWrap: 'nowrap',  // Empêche le retour à la ligne
                                                            overflowX: 'auto',  // Permet le scroll horizontal
                                                            maxWidth: '90%',
                                                        }),
                                                        multiValue: (base) => ({
                                                            ...base,
                                                            backgroundColor: '#5ACBCF',
                                                            borderRadius: '10px',
                                                            flexShrink: 0,  // Empêche la réduction des éléments
                                                        }),
                                                        multiValueLabel: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                        }),
                                                        multiValueRemove: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            ':hover': {
                                                                backgroundColor: '#dc3545',
                                                                color: 'white',
                                                            },
                                                        }),
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        menu: base => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                            width: 'auto',  // S'adapte au contenu
                                                            minWidth: '100%',  // Au moins la largeur du contrôle
                                                        }),
                                                        menuList: base => ({
                                                            ...base,
                                                            maxHeight: '200px',
                                                        }),
                                                        placeholder: (base) => ({
                                                            ...base,
                                                            color: '#A9A9A9',
                                                        }),
                                                        input: (base) => ({
                                                            ...base,
                                                            color: '#333',
                                                            width: 'auto !important',  // Permet à l'input de s'adapter
                                                        }),
                                                    }}
                                                    components={{
                                                        DropdownIndicator: null  // Cache la flèche du dropdown
                                                    }}
                                                    menuPortalTarget={document.body}

                                                />
                                            </div>
                                            <button style={{ marginLeft: '-5px' }}
                                                onClick={() => { setShowModal(true); setStep(1); }}
                                            >
                                                <img src={addbtn} alt="Ajouter" width="45px" />
                                            </button>
                                        </div>
                                        <div className="form-group d-flex align-items-center" style={{ marginLeft: '10px', width: '650px' }}>
                                            <div className="form-group" style={{ flex: 1 }}>
                                                <Select
                                                    name="articleId"
                                                    options={articleOptions}
                                                    value={values.articleId}
                                                    onChange={handleSelectChange}
                                                    placeholder="Sélectionner un article"
                                                    styles={{
                                                        container: (base) => ({
                                                            ...base,
                                                            width: '90%',  // Prend toute la largeur disponible
                                                            marginLeft: '60px',
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            backgroundColor: '#F0F2F8',
                                                            borderRadius: '50px',
                                                            margin: '10px 0',
                                                            padding: '2px 10px',
                                                            boxShadow: state.isFocused ? '0 0 0 2px rgba(90, 203, 207, 0.5)' : '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                                            minHeight: '50px',
                                                            borderColor: state.isFocused ? '#5ACBCF' : '#ced4da',
                                                            '&:hover': {
                                                                borderColor: '#5ACBCF'
                                                            },
                                                        }),
                                                        valueContainer: (base) => ({
                                                            ...base,
                                                            flexWrap: 'nowrap',  // Empêche le retour à la ligne
                                                            overflowX: 'auto',  // Permet le scroll horizontal
                                                            maxWidth: '90%',
                                                        }),
                                                        multiValue: (base) => ({
                                                            ...base,
                                                            backgroundColor: '#5ACBCF',
                                                            borderRadius: '10px',
                                                            flexShrink: 0,  // Empêche la réduction des éléments
                                                        }),
                                                        multiValueLabel: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                        }),
                                                        multiValueRemove: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            ':hover': {
                                                                backgroundColor: '#dc3545',
                                                                color: 'white',
                                                            },
                                                        }),
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        menu: base => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                            width: 'auto',  // S'adapte au contenu
                                                            minWidth: '100%',  // Au moins la largeur du contrôle
                                                        }),
                                                        menuList: base => ({
                                                            ...base,
                                                            maxHeight: '200px',
                                                        }),
                                                        placeholder: (base) => ({
                                                            ...base,
                                                            color: '#A9A9A9',
                                                        }),
                                                        input: (base) => ({
                                                            ...base,
                                                            color: '#333',
                                                            width: 'auto !important',  // Permet à l'input de s'adapter
                                                        }),
                                                    }}
                                                    components={{
                                                        DropdownIndicator: null  // Cache la flèche du dropdown
                                                    }}
                                                    menuPortalTarget={document.body}

                                                />
                                            </div>
                                            <button style={{ marginLeft: '-5px' }}
                                                onClick={() => { setShowModalArticle(true); setStepArticle(1); }}>
                                                <img src={addbtn} alt="Ajouter" width="45px" />
                                            </button>

                                        </div>

                                        <div className="form-group d-flex align-items-center" style={{ marginLeft: '10px', width: '650px' }}>
                                            <div className="form-group" style={{ flex: 1 }}>
                                                <Select
                                                    name="fournisseurId"
                                                    options={fournisseurs
                                                        .filter(f => f.magasin === 'divers') // Filtrage supplémentaire si nécessaire
                                                        .map(f => ({ value: f.id, label: f.nom }))
                                                    }
                                                    value={values.fournisseurId}
                                                    onChange={handleSelectChange}
                                                    // name="fournisseurId"
                                                    // options={fournisseurs}
                                                    // value={values.fournisseurId}
                                                    // onChange={handleSelectChange}
                                                    placeholder="Sélectionner un fournisseur"
                                                    styles={{
                                                        container: (base) => ({
                                                            ...base,
                                                            width: '90%',  // Prend toute la largeur disponible
                                                            marginLeft: '60px',
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            backgroundColor: '#F0F2F8',
                                                            borderRadius: '50px',
                                                            margin: '10px 0',
                                                            padding: '2px 10px',
                                                            boxShadow: state.isFocused ? '0 0 0 2px rgba(90, 203, 207, 0.5)' : '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                                            minHeight: '50px',
                                                            borderColor: state.isFocused ? '#5ACBCF' : '#ced4da',
                                                            '&:hover': {
                                                                borderColor: '#5ACBCF'
                                                            },
                                                        }),
                                                        valueContainer: (base) => ({
                                                            ...base,
                                                            flexWrap: 'nowrap',  // Empêche le retour à la ligne
                                                            overflowX: 'auto',  // Permet le scroll horizontal
                                                            maxWidth: '90%',
                                                        }),
                                                        multiValue: (base) => ({
                                                            ...base,
                                                            backgroundColor: '#5ACBCF',
                                                            borderRadius: '10px',
                                                            flexShrink: 0,  // Empêche la réduction des éléments
                                                        }),
                                                        multiValueLabel: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                        }),
                                                        multiValueRemove: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            ':hover': {
                                                                backgroundColor: '#dc3545',
                                                                color: 'white',
                                                            },
                                                        }),
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        menu: base => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                            width: 'auto',  // S'adapte au contenu
                                                            minWidth: '100%',  // Au moins la largeur du contrôle
                                                        }),
                                                        menuList: base => ({
                                                            ...base,
                                                            maxHeight: '200px',
                                                        }),
                                                        placeholder: (base) => ({
                                                            ...base,
                                                            color: '#A9A9A9',
                                                        }),
                                                        input: (base) => ({
                                                            ...base,
                                                            color: '#333',
                                                            width: 'auto !important',  // Permet à l'input de s'adapter
                                                        }),
                                                    }}
                                                    components={{
                                                        DropdownIndicator: null  // Cache la flèche du dropdown
                                                    }}
                                                    menuPortalTarget={document.body}

                                                />
                                            </div>
                                            <button style={{ marginLeft: '-5px' }}
                                                onClick={() => { setShowModalFournisseur(true); setStep(1); }}
                                            >
                                                <img src={addbtn} alt="Ajouter" width="45px" />
                                            </button>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                name="prix"
                                                className="form-control input"
                                                placeholder='prix'
                                                value={values.prix}
                                                onChange={handleChange}
                                                min="0"
                                                step="10"

                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                name="quantite"
                                                className="form-control input"
                                                value={values.quantite}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                placeholder="Quantité"

                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="unite"
                                                className="form-control input"
                                                value={values.unite}
                                                onChange={handleChange}
                                                placeholder="kg, L, pièce..."
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <input
                                                type="number"
                                                name="th"
                                                className="form-control input"
                                                value={values.th || ''}
                                                onChange={handleTHChange} // Utilisez le handler modifié
                                                min="0"
                                                step="0.01"
                                                placeholder="TH"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="number"
                                                name="tva"
                                                className="form-control input"
                                                value={values.tva}
                                                onChange={handleChange}
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                placeholder="TVA (%)"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <select
                                                name="devise"
                                                className="form-control input"
                                                value={values.devise}
                                                onChange={handleChange}
                                            >
                                                <option value="DZ">DZ (Dinar Algérien)</option>
                                            </select>
                                        </div>
                                        <div className="form-group" style={{ display: 'none' }}>
                                            <select
                                                name="magasin"
                                                className="form-control input"
                                                value={values.magasin}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="divers">divers</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="date_peremption" style={{ marginLeft: '90px' }}>Date d'achat</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="date"
                                                name="date_achat"
                                                value={values.date_achat}
                                                onChange={handleChange}
                                                className="form-control input"
                                                placeholderText="date"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="date_peremption" style={{ marginLeft: '90px' }}>Date Péremption (optionnel)</label>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="date"
                                                name="date_peremption"
                                                value={values.date_peremption}
                                                onChange={handleChange}
                                                className="form-control input"
                                                placeholder="Date Péremption (optionnel)"
                                            />

                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                name="description"
                                                className="form-control input"
                                                style={{ borderRadius: '15px', padding: '10px 15px', backgroundColor: '#F0F2F8', minHeight: '100px' }}
                                                placeholder="Description"
                                                value={values.description}
                                                onChange={handleChange}
                                                rows="3"
                                            />
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowModalAchats(false)}
                                        >
                                            Fermer
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                    Enregistrement...
                                                </>
                                            ) : 'Enregistrer'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className={`modal fade ${showModalArticle ? 'show' : ''}`} style={{ display: showModalArticle ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-custom" role="document">
                            <div className="modal-content modal-custom-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{stepArticle === 1 ? 'Liste des Articles' : isEdit ? 'Modifier un Article' : 'Ajouter un Article'}</h5>
                                    <button type="button" className="close" onClick={() => setShowModalArticle(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>

                                <div className="modal-body">
                                    {stepArticle === 1 && (
                                        <>
                                            <div className="text-end">
                                                <button className="btn btn-primary" onClick={() => { setValues({}); setIsEdit(false); setStepArticle(2); }}>+ Ajouter un nouvel article</button>
                                            </div> <br />
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Code</th>
                                                        <th>Libellé</th>
                                                        <th>Catégorie</th>
                                                        <th>Magasinier</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentArticles.map((art) => (
                                                        <tr key={art.id}>
                                                            <td>{art.code_article}</td>
                                                            <td>{art.libelle}</td>
                                                            <td>{art.Categorie?.libelle}</td>
                                                            <td>{art.magasinier}</td>
                                                            <td>
                                                                <button onClick={() => handleEditArticle(art)} className="btn btn-outline-success" style={{ padding: '5px' }}>
                                                                    <img src={edite} alt="Modifier" width="10px" style={{ width: '20px', height: '25px' }} />
                                                                </button>
                                                                <button onClick={() => handleDeleteArticle(art.id)} className="btn btn-outline-danger" style={{ padding: '5px' }}>
                                                                    <img src={delet} alt="Supprimer" width="10px" style={{ width: '20px', height: '25px' }} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="text-center">
                                                <p><strong>Total de lignes : </strong>{filteredArticles.length}</p>
                                                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="btn btn-outline-primary">Précédent</button>
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}>
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-outline-primary">Suivant</button>
                                            </div>
                                        </>
                                    )}

                                    {stepArticle === 2 && (
                                        <form onSubmit={handleSubmitArticle}>
                                            <div className="form-group">
                                                <input
                                                    type="hidden"
                                                    className="form-control input"
                                                    value={ecoleId || ''}
                                                    readOnly
                                                />
                                                <input
                                                    type="hidden"
                                                    className="form-control input"
                                                    value={ecoleeId || ''}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="code_article"
                                                    placeholder="Code Article"
                                                    className="form-control input"
                                                    style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                    value={values.code_article}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={isEdit}
                                                />
                                            </div>
                                            <div className="form-group" style={{ display: 'none' }}>
                                                <select
                                                    name="magasin"
                                                    className="form-control input"
                                                    value={values.magasin}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="divers">divers</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="libelle"
                                                    placeholder="Libellé"
                                                    className="form-control input"
                                                    style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                    value={values.libelle}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <Select
                                                    name="categorieId"
                                                    options={categoryOptions}
                                                    value={values.categorieId}
                                                    onChange={handleSelectChange}
                                                    placeholder="Sélectionner une catégorie"
                                                    styles={{
                                                        container: (base) => ({
                                                            ...base,
                                                            width: '90%',  // Prend toute la largeur disponible
                                                            marginLeft: '60px',
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            backgroundColor: '#F0F2F8',
                                                            borderRadius: '50px',
                                                            margin: '10px 0',
                                                            padding: '2px 10px',
                                                            boxShadow: state.isFocused ? '0 0 0 2px rgba(90, 203, 207, 0.5)' : '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                                            minHeight: '50px',
                                                            borderColor: state.isFocused ? '#5ACBCF' : '#ced4da',
                                                            '&:hover': {
                                                                borderColor: '#5ACBCF'
                                                            },
                                                        }),
                                                        valueContainer: (base) => ({
                                                            ...base,
                                                            flexWrap: 'nowrap',  // Empêche le retour à la ligne
                                                            overflowX: 'auto',  // Permet le scroll horizontal
                                                            maxWidth: '90%',
                                                        }),
                                                        multiValue: (base) => ({
                                                            ...base,
                                                            backgroundColor: '#5ACBCF',
                                                            borderRadius: '10px',
                                                            flexShrink: 0,  // Empêche la réduction des éléments
                                                        }),
                                                        multiValueLabel: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                        }),
                                                        multiValueRemove: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            ':hover': {
                                                                backgroundColor: '#dc3545',
                                                                color: 'white',
                                                            },
                                                        }),
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        menu: base => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                            width: 'auto',  // S'adapte au contenu
                                                            minWidth: '100%',  // Au moins la largeur du contrôle
                                                        }),
                                                        menuList: base => ({
                                                            ...base,
                                                            maxHeight: '200px',
                                                        }),
                                                        placeholder: (base) => ({
                                                            ...base,
                                                            color: '#A9A9A9',
                                                        }),
                                                        input: (base) => ({
                                                            ...base,
                                                            color: '#333',
                                                            width: 'auto !important',  // Permet à l'input de s'adapter
                                                        }),
                                                    }}
                                                    components={{
                                                        DropdownIndicator: null  // Cache la flèche du dropdown
                                                    }}
                                                    menuPortalTarget={document.body}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <select
                                                    name="magasinier"
                                                    className="form-control input"
                                                    style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                    value={values.magasinier}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">-- Sélectionner un type --</option>
                                                    <option value="nouriteur">Nourriteur</option>
                                                    <option value="fourniteur">Fourniteur</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <textarea
                                                    name="description"
                                                    className="form-control input"
                                                    style={{ borderRadius: '15px', padding: '10px 15px', backgroundColor: '#F0F2F8', minHeight: '100px' }}
                                                    placeholder="Description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    rows="3"
                                                />
                                            </div>

                                            <div className="d-flex justify-content-between mt-3">
                                                <button type="button" className="btn btn-secondary" onClick={() => setStepArticle(1)}>Retour</button>
                                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-custom" role="document">
                            <div className="modal-content modal-custom-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{step === 1 ? 'Liste des Catégories' : isEdit ? 'Modifier une Catégorie' : 'Ajouter une Catégorie'}</h5>
                                    <button type="button" className="close" onClick={() => setShowModal(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>

                                <div className="modal-body">
                                    {step === 1 && (
                                        <>
                                            <div className="text-end">
                                                <button className="btn btn-primary" onClick={() => { setValues({}); setIsEdit(false); setStep(2); }}>+ Ajouter une nouvelle</button>
                                            </div> <br />
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Code</th>
                                                        <th>Libellé</th>
                                                        <th>Description</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentCategories.map((cat) => (
                                                        <tr key={cat.id}>
                                                            <td>{cat.code_categorie}</td>
                                                            <td>{cat.libelle}</td>
                                                            <td>{cat.description}</td>
                                                            <td>
                                                                <button onClick={() => { handleEdit(cat); setStep(2); }} className="btn btn-outline-success" style={{ padding: '5px' }}>
                                                                    <img src={edite} alt="Modifier" width="10px" style={{ width: '20px', height: '25px' }} />
                                                                </button>
                                                                <button onClick={() => handleDelete(cat.id)} className="btn btn-outline-danger" style={{ padding: '5px' }}>
                                                                    <img src={delet} alt="Supprimer" width="10px" style={{ width: '20px', height: '25px' }} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="text-center">
                                                <p><strong>Total de lignes : </strong>{filteredCategories.length}</p>
                                                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="btn btn-outline-primary">Précédent</button>
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}>
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-outline-primary">Suivant</button>
                                            </div>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <form onSubmit={handleSubmit}>
                                            <input type="hidden" value={ecoleId || ''} readOnly />
                                            <input type="hidden" value={ecoleeId || ''} readOnly />

                                            <div className="form-group" style={{ display: 'none' }}>
                                                <select
                                                    name="magasin"
                                                    className="form-control input"
                                                    value={values.magasin || 'divers'}
                                                    onChange={(e) => setValues({ ...values, magasin: e.target.value })}
                                                    required
                                                >
                                                    <option value="divers">divers</option>
                                                    <option value="autre">Autre</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Code Catégorie"
                                                    className="form-control input"
                                                    value={values.code_categorie || ''}
                                                    onChange={(e) => setValues({ ...values, code_categorie: e.target.value })}
                                                    required
                                                    disabled={isEdit}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Libellé"
                                                    className="form-control input"
                                                    value={values.libelle || ''}
                                                    onChange={(e) => setValues({ ...values, libelle: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="hidden"
                                                    className="form-control input"
                                                    value={values.magasin || ''}
                                                    onChange={(e) => setValues({ ...values, magasin: e.target.value })}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <textarea
                                                    name="description"
                                                    className="form-control input"
                                                    style={{ borderRadius: '15px', padding: '10px 15px', backgroundColor: '#F0F2F8', minHeight: '100px' }}
                                                    placeholder="Description"
                                                    value={values.description}
                                                    onChange={(e) => setValues({ ...values, description: e.target.value })}
                                                    rows="3"
                                                />
                                            </div>

                                            <div className="d-flex justify-content-between mt-3">
                                                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Retour</button>
                                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`modal fade ${showModalFournisseur ? 'show' : ''}`} style={{ display: showModalFournisseur ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-custom" role="document">
                            <div className="modal-content modal-custom-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{step === 1 ? 'Liste des Catégories' : isEdit ? 'Modifier une Catégorie' : 'Ajouter une Catégorie'}</h5>
                                    <button type="button" className="close" onClick={() => setShowModalFournisseur(false)}>
                                        <span>&times;</span>
                                    </button>
                                </div>

                                <div className="modal-body">
                                    {step === 1 && (
                                        <>
                                            <div className="text-end">
                                                <button className="btn btn-primary" onClick={() => { setValues({}); setIsEdit(false); setStep(2); }}>+ Ajouter une nouvelle</button>
                                            </div> <br />
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Nom</th>
                                                        <th>Contact</th>
                                                        <th>Email</th>
                                                        <th>Téléphone</th>
                                                        <th>Adresse</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredFournisseurs.slice(indexOfFirstItem, indexOfLastItem).map((fournisseur) => (
                                                        <tr key={fournisseur.id}>
                                                            <td>{fournisseur.nom}</td>
                                                            <td>{fournisseur.contact}</td>
                                                            <td>{fournisseur.email}</td>
                                                            <td>{fournisseur.telephone}</td>
                                                            <td>{fournisseur.adresse}</td>
                                                            <td>
                                                                <button onClick={() => { handleEditForunisseur(fournisseur); setStep(2); }} className="btn btn-outline-success" style={{ padding: '5px' }}>
                                                                    <img src={edite} alt="Modifier" width="10px" style={{ width: '20px', height: '25px' }} />
                                                                </button>
                                                                <button onClick={() => handleDeleteFournisseur(fournisseur.id)} className="btn btn-outline-danger" style={{ padding: '5px' }}>
                                                                    <img src={delet} alt="Supprimer" width="10px" style={{ width: '20px', height: '25px' }} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="text-center">
                                                <p><strong>Total de lignes : </strong>{filteredFournisseurs.length}</p>
                                                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="btn btn-outline-primary">Précédent</button>
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}>
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="btn btn-outline-primary">Suivant</button>
                                            </div>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <form onSubmit={handleSubmitFournisseur}>
                                            <input type="hidden" value={ecoleId || ''} readOnly />
                                            <input type="hidden" value={ecoleeId || ''} readOnly />

                                            <div className="form-group" style={{ display: 'none' }}>
                                                <select
                                                    name="magasin"
                                                    className="form-control input"
                                                    value={values.magasin || 'divers'}
                                                    onChange={(e) => setValues({ ...values, magasin: e.target.value })}
                                                    required
                                                >
                                                    <option value="divers">divers</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="nom"
                                                    placeholder="Nom complet"
                                                    className="form-control input"
                                                    style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                    value={values.nom}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="contact"
                                                    placeholder="Personne à contacter"
                                                    className="form-control input"
                                                    style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                    value={values.contact}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    className="form-control input"
                                                    style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                    value={values.email}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="telephone"
                                                    placeholder="Téléphone"
                                                    className="form-control input"
                                                    style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                    value={values.telephone}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <textarea
                                                    name="adresse"
                                                    className="form-control input"
                                                    style={{ borderRadius: '15px', padding: '10px 15px', backgroundColor: '#F0F2F8', minHeight: '100px' }}
                                                    placeholder="Adresse complète"
                                                    value={values.adresse}
                                                    onChange={handleChange}
                                                    rows="3"
                                                />
                                            </div>

                                            <div className="d-flex justify-content-between mt-3">
                                                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Retour</button>
                                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {selectedSection === "sortie" && (
                <div className="card card-primary card-outline" id="sortie">
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                                <button className="btn btn-app p-1" onClick={() => {
                                    setShowModalsortie(true); setIsEdit(false); setValues({
                                        employeId: null,
                                        articleId: null,
                                        quantite: '',
                                        nomcomplet: '',
                                        date_sortie: new Date().toISOString().split('T')[0]
                                    });
                                }}>
                                    <img src={add} alt="" width="30px" /><br />
                                    Ajouter
                                </button>

                                <div className="input-group" style={{ maxWidth: '300px' }}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Rechercher une sortie"
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="text-end">
                                <strong>Total : {filteredSorties.reduce((sum, sortie) => {
                                    return sum + parseFloat(sortie.quantite);
                                }, 0).toFixed(2)}</strong>
                            </div>
                        </div>

                        {/* Nouveaux filtres */}
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <select
                                    className="form-control"
                                    onChange={(e) => setFilterMonthSortie(e.target.value)}
                                >
                                    <option value="">Tous les mois</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                                        return <option key={i} value={i + 1}>{month}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <Select
                                    options={articles.map(a => ({ value: a.id, label: a.libelle }))}
                                    onChange={(selected) => setFilterArticleSortie(selected ? selected.value : null)}
                                    placeholder="Filtrer par article"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-3">
                                <Select
                                    options={categories.map(c => ({ value: c.id, label: c.libelle }))}
                                    onChange={(selected) => setFilterCategorieSortie(selected ? selected.value : null)}
                                    placeholder="Filtrer par catégorie"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-3">
                                <Select
                                    options={[
                                        { value: 'interne', label: 'Interne' },
                                        { value: 'externe', label: 'Externe' }
                                    ]}
                                    onChange={(selected) => setFilterTypeSortie(selected ? selected.value : null)}
                                    placeholder="Filtrer par type"
                                    isClearable
                                />
                            </div>
                        </div>

                        <div style={{ maxHeight: '400px', overflowX: 'auto', overflowY: 'auto' }}>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Article</th>
                                        <th>Catégorie</th>
                                        <th>Quantité</th>
                                        <th>Bénéficiaire</th>
                                        <th>Date Sortie</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSorties.map((sortie) => {
                                        const beneficiaire = sortie.employe
                                            ? `${sortie.employe.User?.nom || ''} ${sortie.employe.User?.prenom || ''}`
                                            : sortie.nomcomplet;

                                        const typeSortie = sortie.employe ? 'Interne' : 'Externe';
                                        const unite = achats.find(a => a.articleId === sortie.articleId)?.unite || 'unité';

                                        return (
                                            <tr key={sortie.id}>
                                                <td>{sortie.Article?.libelle || 'N/A'} {'yasmine'}</td>
                                                <td>{sortie.Article?.Categorie?.libelle || 'N/A'}</td>
                                                <td>{sortie.quantite}{unite}</td>
                                                <td>{beneficiaire || 'N/A'}</td>
                                                <td>{sortie.date_sortie ? new Date(sortie.date_sortie).toLocaleDateString() : 'N/A'}</td>
                                                <td>
                                                    <button onClick={() => handleEditsortie(sortie)} className="btn btn-outline-success">
                                                        <img src={edite} alt="Modifier" width="20px" />
                                                    </button>
                                                    <button onClick={() => handleDeletesortie(sortie.id)} className="btn btn-outline-danger">
                                                        <img src={delet} alt="Supprimer" width="20px" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-center">
                            <p><strong>Total de lignes : </strong>{filteredSorties.length}</p>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-outline-primary"
                            >
                                Précédent
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-outline-primary"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                    <div className={`modal fade ${showModalsortie ? 'show' : ''}`} style={{ display: showModalsortie ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-custom" role="document">
                            <div className="modal-content modal-custom-content">
                                <form onSubmit={handleSubmitsortie}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">{isEdit ? 'Modifier une Sortie' : 'Ajouter une Sortie'}</h5>
                                        <button type="button" className="close" onClick={() => setShowModalsortie(false)}>
                                            <span>&times;</span>
                                        </button>
                                    </div>

                                    <div className="modal-body">
                                        <div className="form-group">
                                            <input
                                                type="hidden"
                                                className="form-control input"
                                                value={ecoleId || ''}
                                                readOnly
                                            />
                                            <input
                                                type="hidden"
                                                className="form-control input"
                                                value={ecoleeId || ''}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <Select
                                                name="articleId"
                                                options={articleOptions}
                                                value={values.articleId}
                                                onChange={handleSelectChange}
                                                placeholder="Sélectionner un article"
                                                styles={{
                                                    container: (base) => ({
                                                        ...base,
                                                        width: '90%',  // Prend toute la largeur disponible
                                                        marginLeft: '60px',
                                                    }),
                                                    control: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: '#F0F2F8',
                                                        borderRadius: '50px',
                                                        margin: '10px 0',
                                                        padding: '2px 10px',
                                                        boxShadow: state.isFocused ? '0 0 0 2px rgba(90, 203, 207, 0.5)' : '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                                        minHeight: '50px',
                                                        borderColor: state.isFocused ? '#5ACBCF' : '#ced4da',
                                                        '&:hover': {
                                                            borderColor: '#5ACBCF'
                                                        },
                                                    }),
                                                    valueContainer: (base) => ({
                                                        ...base,
                                                        flexWrap: 'nowrap',  // Empêche le retour à la ligne
                                                        overflowX: 'auto',  // Permet le scroll horizontal
                                                        maxWidth: '90%',
                                                    }),
                                                    multiValue: (base) => ({
                                                        ...base,
                                                        backgroundColor: '#5ACBCF',
                                                        borderRadius: '10px',
                                                        flexShrink: 0,  // Empêche la réduction des éléments
                                                    }),
                                                    multiValueLabel: (base) => ({
                                                        ...base,
                                                        color: 'white',
                                                        padding: '2px 6px',
                                                    }),
                                                    multiValueRemove: (base) => ({
                                                        ...base,
                                                        color: 'white',
                                                        ':hover': {
                                                            backgroundColor: '#dc3545',
                                                            color: 'white',
                                                        },
                                                    }),
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    menu: base => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                        width: 'auto',  // S'adapte au contenu
                                                        minWidth: '100%',  // Au moins la largeur du contrôle
                                                    }),
                                                    menuList: base => ({
                                                        ...base,
                                                        maxHeight: '200px',
                                                    }),
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: '#A9A9A9',
                                                    }),
                                                    input: (base) => ({
                                                        ...base,
                                                        color: '#333',
                                                        width: 'auto !important',  // Permet à l'input de s'adapter
                                                    }),
                                                }}
                                                components={{ DropdownIndicator: null }}
                                                menuPortalTarget={document.body}
                                            />
                                        </div>

                                        <div className="form-group" style={{ marginLeft: '15px' }}>
                                            <label><strong>Type de bénéficiaire</strong></label>
                                            <div className="mb-2">
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="Employé"
                                                    name="signataireType"
                                                    checked={!isExterne}
                                                    onChange={() => setIsExterne(false)}
                                                />
                                                <Form.Check
                                                    inline
                                                    type="radio"
                                                    label="Externe"
                                                    name="signataireType"
                                                    checked={isExterne}
                                                    onChange={() => setIsExterne(true)}
                                                />
                                            </div>
                                        </div>

                                        {!isExterne ? (
                                            <div className="form-group">
                                                <Select
                                                    name="employeId"
                                                    options={employees}
                                                    value={values.employeId}
                                                    onChange={handleSelectChange}
                                                    placeholder="Sélectionner un employé"
                                                    styles={{
                                                        container: (base) => ({
                                                            ...base,
                                                            width: '90%',  // Prend toute la largeur disponible
                                                            marginLeft: '60px',
                                                        }),
                                                        control: (base, state) => ({
                                                            ...base,
                                                            backgroundColor: '#F0F2F8',
                                                            borderRadius: '50px',
                                                            margin: '10px 0',
                                                            padding: '2px 10px',
                                                            boxShadow: state.isFocused ? '0 0 0 2px rgba(90, 203, 207, 0.5)' : '2px 2px 8px rgba(0, 0, 0, 0.1)',
                                                            minHeight: '50px',
                                                            borderColor: state.isFocused ? '#5ACBCF' : '#ced4da',
                                                            '&:hover': {
                                                                borderColor: '#5ACBCF'
                                                            },
                                                        }),
                                                        valueContainer: (base) => ({
                                                            ...base,
                                                            flexWrap: 'nowrap',  // Empêche le retour à la ligne
                                                            overflowX: 'auto',  // Permet le scroll horizontal
                                                            maxWidth: '90%',
                                                        }),
                                                        multiValue: (base) => ({
                                                            ...base,
                                                            backgroundColor: '#5ACBCF',
                                                            borderRadius: '10px',
                                                            flexShrink: 0,  // Empêche la réduction des éléments
                                                        }),
                                                        multiValueLabel: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            padding: '2px 6px',
                                                        }),
                                                        multiValueRemove: (base) => ({
                                                            ...base,
                                                            color: 'white',
                                                            ':hover': {
                                                                backgroundColor: '#dc3545',
                                                                color: 'white',
                                                            },
                                                        }),
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        menu: base => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                            width: 'auto',  // S'adapte au contenu
                                                            minWidth: '100%',  // Au moins la largeur du contrôle
                                                        }),
                                                        menuList: base => ({
                                                            ...base,
                                                            maxHeight: '200px',
                                                        }),
                                                        placeholder: (base) => ({
                                                            ...base,
                                                            color: '#A9A9A9',
                                                        }),
                                                        input: (base) => ({
                                                            ...base,
                                                            color: '#333',
                                                            width: 'auto !important',  // Permet à l'input de s'adapter
                                                        }),
                                                    }}
                                                    required
                                                />
                                            </div>
                                        ) : (
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="nomcomplet"
                                                    className="form-control input"
                                                    style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                    placeholder="Nom complet du bénéficiaire"
                                                    value={values.nomcomplet}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="form-group">
                                            <input
                                                type="number"
                                                name="quantite"
                                                className="form-control input"
                                                style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                placeholder="Quantité"
                                                value={values.quantite}
                                                onChange={handleChange}
                                                min="0.01"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label style={{ marginLeft: '80px' }}><strong>Date de sortie</strong></label>
                                            <input
                                                type="date"
                                                name="date_sortie"
                                                className="form-control input"
                                                style={{ borderRadius: '50px', padding: '10px 15px', backgroundColor: '#F0F2F8' }}
                                                value={values.date_sortie}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="modal-footer d-flex justify-content-between">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModalsortie(false)}>
                                            Annuler
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            )}
            {selectedSection === "stocks" && (
                <div className="card card-primary card-outline" id="stocks">
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="input-group" style={{ maxWidth: '300px' }}>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Rechercher un article"
                                    className="form-control"
                                />
                            </div>

                            <div className="text-end">
                                <strong>Total valeur stock : {filteredStocks.reduce((sum, stock) => {
                                    const prixAchat = achats.find(a => a.articleId === stock.articleId)?.prix || 0;
                                    return sum + (stock.stockRestant * prixAchat);
                                }, 0).toFixed(2)} DZ</strong>
                            </div>
                        </div>

                        {/* Nouveaux filtres */}
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <Select
                                    options={articles.map(a => ({ value: a.id, label: a.libelle }))}
                                    onChange={(selected) => setFilterArticleStock(selected ? selected.value : null)}
                                    placeholder="Filtrer par article"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    options={categories.map(c => ({ value: c.id, label: c.libelle }))}
                                    onChange={(selected) => setFilterCategorieStock(selected ? selected.value : null)}
                                    placeholder="Filtrer par catégorie"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    options={[
                                        { value: 'low', label: 'Stock faible' },
                                        { value: 'out', label: 'Rupture de stock' }
                                    ]}
                                    onChange={(selected) => setFilterEtatStock(selected ? selected.value : null)}
                                    placeholder="Filtrer par état"
                                    isClearable
                                />
                            </div>
                        </div>

                        <div style={{ maxHeight: '400px', overflowX: 'auto', overflowY: 'auto' }}>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Article</th>
                                        <th>Quantité Achetée</th>
                                        <th>Quantité Sortie</th>
                                        <th>Stock Restant</th>
                                        <th>Prix Unitaire</th>
                                        <th>Valeur Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStocks.map((stock) => (
                                        <tr key={stock.articleId}>
                                            <td>{stock.article?.libelle}</td>
                                            <td>{stock.totalAchat.toFixed(2)} {stock.unite}</td>
                                            <td>{stock.totalSortie.toFixed(2)} {stock.unite}</td>
                                            <td className={stock.stockRestant <= 0 ? 'text-danger' : ''}>
                                                {stock.stockRestant.toFixed(2)} {stock.unite}
                                            </td>
                                            <td>{stock.prixMoyen.toFixed(2)} DZ</td>
                                            <td>{stock.valeurStock.toFixed(2)} DZ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-center">
                            <p><strong>Total de lignes : </strong>{filteredStocks.length}</p>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="btn btn-outline-primary"
                            >
                                Précédent
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`btn btn-outline-primary ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="btn btn-outline-primary"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionAcademiqueAutres;
