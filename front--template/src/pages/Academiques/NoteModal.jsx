import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Badge } from 'react-bootstrap';

const NoteModal = ({ show, handleClose, eleve, matiere, notes, cycle, onSave }) => {
    const [formValues, setFormValues] = useState({});

    // useEffect(() => {
    //     if (notes) {
    //         setFormValues(notes);
    //     }
    // }, [notes]);
    useEffect(() => {
        setFormValues(notes || {});
    }, [notes, matiere]); // Ajoutez matiere comme dépendance

    const roundToTwo = (num) => {
        const floatNum = parseFloat(num);
        if (isNaN(floatNum)) return '';
        const str = floatNum.toFixed(3);
        const [_, decimalPart] = str.split('.');
        const thirdDigit = parseInt(decimalPart?.[2] || 0);
        let rounded = floatNum;

        if (thirdDigit >= 5) {
            rounded = (Math.floor(floatNum * 100) + 1) / 100;
        } else {
            rounded = Math.floor(floatNum * 100) / 100;
        }

        return rounded.toFixed(2);
    };

    const handleNoteChange = (eleveId, fieldId, value) => {
        const roundToTwo = (num) => {
            const floatNum = parseFloat(num);
            if (isNaN(floatNum)) return '';
            const str = floatNum.toFixed(3); // garde 3 chiffres pour analyse
            const [intPart, decimalPart] = str.split('.');
            const thirdDigit = parseInt(decimalPart[2]);
            let rounded = floatNum;

            if (thirdDigit >= 5) {
                rounded = (Math.floor(floatNum * 100) + 1) / 100;
            } else {
                rounded = Math.floor(floatNum * 100) / 100;
            }

            return rounded.toFixed(2);
        };

        setNotes(prev => {
            const updatedEleveNotes = {
                ...prev[eleveId],
                [fieldId]: value
            };

            const [matiereId, champ] = fieldId.split('_');
            const currentMatiere = matieres.find(m => m.id == matiereId);
            const isMath = currentMatiere ? isMathSubject(currentMatiere) : false;
            const isPrimaire = selectedCycle === 'Primaire';
            const isCem = selectedCycle === 'Cem';
            const isLycée = selectedCycle === 'Lycée';

            // ----- LOGIQUE PRIMAIRE -----
            // ----- LOGIQUE PRIMAIRE -----
            if (isPrimaire) {
                const exp = parseFloat(updatedEleveNotes[`${matiereId}_expression_orale`] || 0);
                const lec = parseFloat(updatedEleveNotes[`${matiereId}_lecture`] || 0);
                const prod = parseFloat(updatedEleveNotes[`${matiereId}_production_ecrite`] || 0);
                const examens = parseFloat(updatedEleveNotes[`${matiereId}_examens`] || 0);

                let total = 0;
                let count = 0;

                // Vérifiez si la matière est Math
                const isMath = currentMatiere ? isMathSubject(currentMatiere) : false;

                if (isMath) {
                    const calcul = parseFloat(updatedEleveNotes[`${matiereId}_calcul`] || 0);
                    const grandeurs_mesures = parseFloat(updatedEleveNotes[`${matiereId}_grandeurs_mesures`] || 0);
                    const organisation_donnees = parseFloat(updatedEleveNotes[`${matiereId}_organisation_donnees`] || 0);
                    const espace_geometrie = parseFloat(updatedEleveNotes[`${matiereId}_espace_geometrie`] || 0);

                    // Calculer la moyenne pour les mathématiques
                    let totalMath = 0;
                    let countMath = 0;

                    if (calcul > 0) { totalMath += calcul; countMath++; }
                    if (grandeurs_mesures > 0) { totalMath += grandeurs_mesures; countMath++; }
                    if (organisation_donnees > 0) { totalMath += organisation_donnees; countMath++; }
                    if (espace_geometrie > 0) { totalMath += espace_geometrie; countMath++; }

                    if (countMath > 0) {
                        const moyenneEvalMath = totalMath / countMath;
                        updatedEleveNotes[`${matiereId}_moyenne_eval`] = roundToTwo(moyenneEvalMath);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_eval`] = '';
                    }
                } else {
                    // Logique pour les autres matières
                    if (exp > 0) { total += exp; count++; }
                    if (lec > 0) { total += lec; count++; }
                    if (prod > 0) { total += prod; count++; }

                    if (count > 0) {
                        const moyenneEval = total / count;
                        updatedEleveNotes[`${matiereId}_moyenne_eval`] = roundToTwo(moyenneEval);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_eval`] = '';
                    }
                }

                const moyenne_eval_valide = updatedEleveNotes[`${matiereId}_moyenne_eval`] !== '';
                const examens_valide = !isNaN(examens);

                if (moyenne_eval_valide && examens_valide) {
                    const moyenne = (parseFloat(updatedEleveNotes[`${matiereId}_moyenne_eval`]) + examens) / 2;
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(moyenne);
                } else if (!moyenne_eval_valide && examens_valide) {
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(examens);
                } else {
                    updatedEleveNotes[`${matiereId}_moyenne`] = '';
                }
            }

            // ----- LOGIQUE CEM -----
            if (isCem) {
                const eval_continue = parseFloat(updatedEleveNotes[`${matiereId}_eval_continue`] || 0);
                const devoir1 = parseFloat(updatedEleveNotes[`${matiereId}_devoir1`] || 0);
                const devoir2 = parseFloat(updatedEleveNotes[`${matiereId}_devoir2`] || 0);
                const examens = parseFloat(updatedEleveNotes[`${matiereId}_examens`] || 0);
                const coefficient = parseFloat(updatedEleveNotes[`${matiereId}_coefficient`] || 0); // 👉 AJOUT ICI

                let totalEval = 0;
                let countEval = 0;

                if (!isNaN(eval_continue) && eval_continue > 0) {
                    totalEval += eval_continue;
                    countEval++;
                }
                if (!isNaN(devoir1) && devoir1 > 0) {
                    totalEval += devoir1;
                    countEval++;
                }
                if (!isNaN(devoir2) && devoir2 > 0) {
                    totalEval += devoir2;
                    countEval++;
                }

                if (countEval > 0) {
                    updatedEleveNotes[`${matiereId}_moyenne_eval`] = roundToTwo(totalEval / countEval);
                } else {
                    updatedEleveNotes[`${matiereId}_moyenne_eval`] = '';
                }

                const moyenne_eval_valide = updatedEleveNotes[`${matiereId}_moyenne_eval`] !== '';
                const examens_valide = !isNaN(examens) && examens > 0;

                if (moyenne_eval_valide && examens_valide) {
                    const moyenne_brute = (parseFloat(updatedEleveNotes[`${matiereId}_moyenne_eval`]) + examens * 2) / 3;
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(moyenne_brute);

                    if (!isNaN(coefficient) && coefficient > 0) {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = roundToTwo(moyenne_brute * coefficient);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                    }

                } else if (!moyenne_eval_valide && examens_valide) {
                    const moyenne_brute = examens;
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(moyenne_brute);

                    if (!isNaN(coefficient) && coefficient > 0) {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = roundToTwo(moyenne_brute * coefficient);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                    }

                } else {
                    updatedEleveNotes[`${matiereId}_moyenne`] = '';
                    updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                }
            }
            if (isLycée) {
                const eval_continue = parseFloat(updatedEleveNotes[`${matiereId}_eval_continue`] || 0);
                const travaux_pratiques = parseFloat(updatedEleveNotes[`${matiereId}_travaux_pratiques`] || 0);
                const moyenne_devoirs = parseFloat(updatedEleveNotes[`${matiereId}_moyenne_devoirs`] || 0);
                const examens = parseFloat(updatedEleveNotes[`${matiereId}_examens`] || 0);
                const coefficient = parseFloat(updatedEleveNotes[`${matiereId}_coefficient`] || 0);

                let total = 0;
                let poidsTotal = 0;

                if (!isNaN(eval_continue) && eval_continue > 0) {
                    total += eval_continue;
                    poidsTotal += 1;
                }

                if (!isNaN(travaux_pratiques) && travaux_pratiques > 0) {
                    total += travaux_pratiques;
                    poidsTotal += 1;
                }

                if (!isNaN(moyenne_devoirs) && moyenne_devoirs > 0) {
                    total += moyenne_devoirs;
                    poidsTotal += 1;
                }

                if (!isNaN(examens) && examens > 0) {
                    total += examens * 2;
                    poidsTotal += 2;
                }

                if (poidsTotal > 0) {
                    const moyenne_brute = total / poidsTotal;
                    updatedEleveNotes[`${matiereId}_moyenne`] = roundToTwo(moyenne_brute);

                    if (!isNaN(coefficient) && coefficient > 0) {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = roundToTwo(moyenne_brute * coefficient);
                    } else {
                        updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                    }
                } else {
                    updatedEleveNotes[`${matiereId}_moyenne`] = '';
                    updatedEleveNotes[`${matiereId}_moyenne_total`] = '';
                }
            }



            return {
                ...prev,
                [eleveId]: updatedEleveNotes
            };
        });
    };

    const renderField = (label, field, readOnly = false) => (
        <Form.Group className="mb-3" controlId={field}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type="number"
                value={formValues[field] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                readOnly={readOnly}
            />
        </Form.Group>
    );

    const isMathSubject = (matiere) => {
        if (!matiere) return false; // protection si null ou undefined

        const mathKeywords = ['maths', 'math', 'mathématique', 'mathématiques', 'الرياضيات'];
        const matiereName = matiere.nom?.toLowerCase() || '';
        const matiereNameAr = matiere.nomarabe || '';

        return mathKeywords.some(keyword =>
            matiereName.includes(keyword.toLowerCase()) ||
            matiereNameAr.includes(keyword)
        );
    };

    const renderFields = () => {
        if (!matiere) return null;

        const isMath = isMathSubject(matiere);

        switch (cycle) {
            case 'Primaire':
                return (
                    <>
                        {isMath ? (
                            <>
                                {renderField('الحساب / Calcul', 'calcul')}
                                {renderField('القياس / Grandeurs et mesures', 'grandeurs_mesures')}
                                {renderField('تنظيم البيانات / Organisation des données', 'organisation_donnees')}
                                {renderField('الفضاء و الهندسة / Espace et géométrie', 'espace_geometrie')}
                                {renderField('معدل التقويم / Moyenne évaluation continue', 'moyenne_eval_math', true)}
                                {renderField('الإختبارات / Examens', 'examens_math')}
                                {renderField('معدل / Moyenne', 'moyenne_math', true)}
                            </>
                        ) : (
                            <>
                                {renderField('التعبير و التواصل الشفوي / Expression orale', 'expression_orale')}
                                {renderField('القراءة و المحفوظات / Lecture', 'lecture')}
                                {renderField('الإنتاج الكتابي / Production écrite', 'production_ecrite')}
                                {renderField('معدل التقويم المستمر / Moyenne évaluation continue', 'moyenne_eval', true)}
                                {renderField('الإختبارات / Examens', 'examens')}
                                {renderField('معدل / Moyenne', 'moyenne', true)}
                            </>
                        )}
                    </>
                );

            case 'Cem':
                return (
                    <>
                        {renderField('التقويم المستمر / Évaluation continue', 'eval_continue')}
                        {renderField('الفرض الأول / Devoir 1', 'devoir1')}
                        {renderField('الفرض الثاني / Devoir 2', 'devoir2')}
                        {renderField('معدل التقويم / Moyenne évaluation', 'moyenne_eval', true)}
                        {renderField('الإختبارات / Examens', 'examens')}
                        {renderField('معدل / Moyenne', 'moyenne', true)}
                        {renderField('معامل / Coefficient', 'coefficient')}
                        {renderField('المعدل الإجمالي / Moyenne totale', 'moyenne_total', true)}
                    </>
                );

            case 'Lycée':
                return (
                    <>
                        {renderField('التقويم المستمر / Évaluation continue', 'eval_continue')}
                        {renderField('أعمال تطبيقية / Travaux pratiques', 'travaux_pratiques')}
                        {renderField('معدل الفروض / Moyenne devoirs', 'moyenne_devoirs')}
                        {renderField('الإختبارات / Examens', 'examens')}
                        {renderField('معدل / Moyenne', 'moyenne', true)}
                        {renderField('معامل / Coefficient', 'coefficient')}
                        {renderField('المعدل الإجمالي / Moyenne totale', 'moyenne_total', true)}
                    </>
                );

            default:
                return null;
        }
    };

    const handleSubmit = () => {
        onSave(formValues);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Saisie des notes - {eleve?.User?.prenom} {eleve?.User?.nom}
                    <Badge bg="info" className="ms-2">{matiere?.nom}</Badge>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {renderFields()}
                    <Form.Group className="mb-3">
                        <Form.Label>Remarque</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={formValues.remarque || ''}
                            onChange={(e) => handleChange('remarque', e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Enregistrer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NoteModal;
