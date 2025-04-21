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

    const handleChange = (field, value) => {
        const updated = {
            ...formValues,
            [field]: value
        };

        // === LOGIQUE PRIMAIRE ===
        if (cycle === 'Primaire') {
            const exp = parseFloat(updated.expression_orale || 0);
            const lec = parseFloat(updated.lecture || 0);
            const prod = parseFloat(updated.production_ecrite || 0);
            const examens = parseFloat(updated.examens || 0);

            let total = 0, count = 0;
            if (exp > 0) { total += exp; count++; }
            if (lec > 0) { total += lec; count++; }
            if (prod > 0) { total += prod; count++; }

            updated.moyenne_eval = count > 0 ? roundToTwo(total / count) : '';

            const moyenneEvalValid = updated.moyenne_eval !== '';
            const examensValid = !isNaN(examens);

            if (moyenneEvalValid && examensValid) {
                updated.moyenne = roundToTwo((parseFloat(updated.moyenne_eval) + examens) / 2);
            } else if (!moyenneEvalValid && examensValid) {
                updated.moyenne = roundToTwo(examens);
            } else {
                updated.moyenne = '';
            }
        }

        // === LOGIQUE CEM ===
        if (cycle === 'Cem') {
            const eval1 = parseFloat(updated.eval_continue || 0);
            const devoir1 = parseFloat(updated.devoir1 || 0);
            const devoir2 = parseFloat(updated.devoir2 || 0);
            const examens = parseFloat(updated.examens || 0);
            const coef = parseFloat(updated.coefficient || 0);

            let total = 0, count = 0;
            if (eval1 > 0) { total += eval1; count++; }
            if (devoir1 > 0) { total += devoir1; count++; }
            if (devoir2 > 0) { total += devoir2; count++; }

            updated.moyenne_eval = count > 0 ? roundToTwo(total / count) : '';

            const moyenneEvalValid = updated.moyenne_eval !== '';
            const examensValid = !isNaN(examens) && examens > 0;

            let moyenne = '';

            if (moyenneEvalValid && examensValid) {
                moyenne = (parseFloat(updated.moyenne_eval) + examens * 2) / 3;
            } else if (!moyenneEvalValid && examensValid) {
                moyenne = examens;
            }

            updated.moyenne = moyenne !== '' ? roundToTwo(moyenne) : '';
            updated.moyenne_total = (!isNaN(coef) && coef > 0 && moyenne !== '') ? roundToTwo(moyenne * coef) : '';
        }

        // === LOGIQUE LYCÉE ===
        if (cycle === 'Lycée') {
            const evalCont = parseFloat(updated.eval_continue || 0);
            const tp = parseFloat(updated.travaux_pratiques || 0);
            const moyDev = parseFloat(updated.moyenne_devoirs || 0);
            const examens = parseFloat(updated.examens || 0);
            const coef = parseFloat(updated.coefficient || 0);

            let total = 0, poids = 0;
            if (evalCont > 0) { total += evalCont; poids += 1; }
            if (tp > 0) { total += tp; poids += 1; }
            if (moyDev > 0) { total += moyDev; poids += 1; }
            if (examens > 0) { total += examens * 2; poids += 2; }

            const moyenne = poids > 0 ? total / poids : '';
            updated.moyenne = moyenne !== '' ? roundToTwo(moyenne) : '';
            updated.moyenne_total = (!isNaN(coef) && coef > 0 && moyenne !== '') ? roundToTwo(moyenne * coef) : '';
        }

        setFormValues(updated);
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

    const renderFields = () => {
        switch (cycle) {
            case 'Primaire':
                return (
                    <>
                        {renderField('Expression orale', 'expression_orale')}
                        {renderField('Lecture', 'lecture')}
                        {renderField('Production écrite', 'production_ecrite')}
                        {renderField('Moyenne évaluation continue', 'moyenne_eval', true)}
                        {renderField('Examens', 'examens')}
                        {renderField('Moyenne', 'moyenne', true)}
                    </>
                );
            case 'Cem':
                return (
                    <>
                        {renderField('Évaluation continue', 'eval_continue')}
                        {renderField('Devoir 1', 'devoir1')}
                        {renderField('Devoir 2', 'devoir2')}
                        {renderField('Moyenne évaluation', 'moyenne_eval', true)}
                        {renderField('Examens', 'examens')}
                        {renderField('Moyenne', 'moyenne', true)}
                        {renderField('Coefficient', 'coefficient')}
                        {renderField('Moyenne totale', 'moyenne_total', true)}
                    </>
                );
            case 'Lycée':
                return (
                    <>
                        {renderField('Évaluation continue', 'eval_continue')}
                        {renderField('Travaux pratiques', 'travaux_pratiques')}
                        {renderField('Moyenne devoirs', 'moyenne_devoirs')}
                        {renderField('Examens', 'examens')}
                        {renderField('Moyenne', 'moyenne', true)}
                        {renderField('Coefficient', 'coefficient')}
                        {renderField('Moyenne totale', 'moyenne_total', true)}
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
