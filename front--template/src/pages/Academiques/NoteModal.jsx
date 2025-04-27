import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Badge } from 'react-bootstrap';

const NoteModal = ({
    show,
    handleClose,
    eleve,
    matiere,
    notes,
    cycle, // This now comes from the selected niveau
    onSave,
    annescolaireId,
    trimestId
}) => {
    const [formValues, setFormValues] = useState({
        remarque: '',
        moyenne: '',
        coefficient: '',
        ...notes
    });

    const capitalize = (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

    // Use the cycle prop directly (passed from parent component)
    const validatedCycle = ['Primaire', 'Cem', 'Lycée'].includes(cycle) ? cycle : null;

    useEffect(() => {
        console.log('Notes prop:', notes);
    
        setFormValues(prev => ({
            ...prev,
            ...notes,
            annescolaireId,
            trimestId,
            cycle: validatedCycle // Use the validated cycle from props
        }));
    }, [notes, annescolaireId, trimestId, validatedCycle]);

    const isMathSubject = () => {
        if (!matiere) return false;
        const mathKeywords = ['maths', 'math', 'mathématique', 'mathématiques', 'الرياضيات'];
        const matiereName = matiere.nom?.toLowerCase() || '';
        const matiereNameAr = matiere.nomarabe || '';
        return mathKeywords.some(keyword =>
            matiereName.includes(keyword.toLowerCase()) ||
            matiereNameAr.includes(keyword)
        );
    };

    const calculateMoyenne = (values) => {
        if (validatedCycle === 'Primaire') {
            if (isMathSubject()) {
                const evalMath = parseFloat(values.moyenne_eval_math) || 0;
                const examensMath = parseFloat(values.examens_math) || 0;
                return ((evalMath + examensMath) / 2).toFixed(2);
            } else {
                const expression = parseFloat(values.expression_orale) || 0;
                const lecture = parseFloat(values.lecture) || 0;
                const production = parseFloat(values.production_ecrite) || 0;

                const moyenne_eval = ((expression + lecture + production) / 3).toFixed(2);
                const examens = parseFloat(values.examens) || 0;
                const moyenne = ((parseFloat(moyenne_eval) + examens) / 2).toFixed(2);

                return {
                    moyenne_eval,
                    moyenne
                };
            }
        }
        return { moyenne: values.moyenne || '' };
    };

    const handleChange = (field, value) => {
        const newValues = {
            ...formValues,
            [field]: value
        };

        if (validatedCycle === 'Primaire') {
            if (isMathSubject()) {
                // Liste des champs mathématiques à surveiller
                const mathFields = ['calcul', 'grandeurs_mesures', 'organisation_donnees', 'espace_geometrie'];
                
                if (mathFields.includes(field)) {
                    // Calcul automatique de la moyenne d'évaluation
                    const calcul = parseFloat(newValues.calcul) || 0;
                    const grandeurs = parseFloat(newValues.grandeurs_mesures) || 0;
                    const organisation = parseFloat(newValues.organisation_donnees) || 0;
                    const geometrie = parseFloat(newValues.espace_geometrie) || 0;
                    
                    newValues.moyenne_eval_math = ((calcul + grandeurs + organisation + geometrie) / 4).toFixed(2);
                }
    
                // Calcul de la moyenne finale si nécessaire
                if (mathFields.includes(field) || field === 'examens_math') {
                    const evalMath = parseFloat(newValues.moyenne_eval_math) || 0;
                    const examensMath = parseFloat(newValues.examens_math) || 0;
                    newValues.moyenne_math = ((evalMath + examensMath) / 2).toFixed(2);
                }
            } else {
                if (field === 'expression_orale' || field === 'lecture' || field === 'production_ecrite') {
                    const updated = calculateMoyenne(newValues);
                    newValues.moyenne_eval = updated.moyenne_eval;
                    newValues.moyenne = updated.moyenne;
                } else if (field === 'examens') {
                    const updated = calculateMoyenne(newValues);
                    newValues.moyenne = updated.moyenne;
                }
            }
        }

        setFormValues(newValues);
    };

    const renderField = (label, field, readOnly = false, extraProps = {}) => (
        <Form.Group className="mb-3" controlId={field}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type="number"
                value={formValues[field] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                readOnly={readOnly}
                step="0.01"
                min="0"
                max="20"
                {...extraProps}
            />
        </Form.Group>
    );

    const renderFields = () => {
        const isMath = isMathSubject();
    
        switch (validatedCycle) {
            case 'Primaire':
                return isMath ? (
                    <>
                        {renderField('الحساب / Calcul', 'calcul')}
                        {renderField('القياس / Grandeurs et mesures', 'grandeurs_mesures')}
                        {renderField('تنظيم البيانات / Organisation des données', 'organisation_donnees')}
                        {renderField('الفضاء و الهندسة / Espace et géométrie', 'espace_geometrie')}
                        {renderField('معدل التقويم / Moyenne évaluation continue', 'moyenne_eval_math')}
                        {renderField('الإختبارات / Examens', 'examens_math')}
                        {renderField('معدل / Moyenne', 'moyenne_math', true)}
                    </>
                ) : (
                    <>
                        {renderField('التعبير و التواصل الشفوي / Expression orale', 'expression_orale')}
                        {renderField('القراءة و المحفوظات / Lecture', 'lecture')}
                        {renderField('الإنتاج الكتابي / Production écrite', 'production_ecrite')}
                        {renderField('معدل التقويم المستمر / Moyenne évaluation continue', 'moyenne_eval')}
                        {renderField('الإختبارات / Examens', 'examens')}
                        {renderField('معدل / Moyenne', 'moyenne', true)}
                    </>
                );
    
            case 'Cem':
                return (
                    <>
                        {renderField('التقويم المستمر / Évaluation continue', 'eval_continue')}
                        {renderField('الفرض الأول / Devoir 1', 'devoir1')}
                        {renderField('الفرض الثاني / Devoir 2', 'devoir2')}
                        {renderField('معدل التقويم / Moyenne évaluation', 'moyenne_eval')}
                        {renderField('الإختبارات / Examens', 'examens')}
                        {renderField('معدل / Moyenne', 'moyenne', true)}
                        {renderField('معامل / Coefficient', 'coefficient', false, { min: '0.5', step: '0.5' })}
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
                        {renderField('معامل / Coefficient', 'coefficient', false, { min: '1', step: '1' })}
                        {renderField('المعدل الإجمالي / Moyenne totale', 'moyenne_total', true)}
                    </>
                );
    
            default:
                return <div className="text-danger">Cycle non reconnu ou manquant.</div>;
        }
    };

    const handleSubmit = () => {
        const noteToSave = {
            ...formValues,
            eleveId: eleve?.id,
            matiereId: matiere?.id,
            annescolaireId,
            trimestId,
            cycle: validatedCycle
        };
        onSave(noteToSave);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    Saisie des notes - {eleve?.User?.prenom_ar} {eleve?.User?.nom_ar}
                    <Badge bg="light" text="dark" className="ms-2">{matiere?.nom}</Badge>
                    {validatedCycle && <Badge bg="info" className="ms-2">{validatedCycle}</Badge>}
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
                            placeholder="Entrez une remarque si nécessaire..."
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