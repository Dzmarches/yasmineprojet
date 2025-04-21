import React, { useEffect, useRef, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios'; // Assurez-vous d'installer axios

const Calenderie = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]); // État pour stocker les événements
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour contrôler la modal
  const [eventTitle, setEventTitle] = useState(""); // État pour le titre de l'événement
  const [eventColor, setEventColor] = useState("#ff0000"); // Couleur par défaut de l'événement
  const [selectedDate, setSelectedDate] = useState(null); // Date sélectionnée pour l'événement

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events'); // Remplacez par votre URL
        setEvents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventDrop = async (info) => {
    const title = info.draggedEl.innerText; // Récupérer le titre de l'événement
    const newEvent = {
      title: title,
      start: info.date, // La date où l'événement est déposé
      allDay: true
    };

    // Ajouter l'événement à l'état et à la base de données
    try {
      await axios.post('http://localhost:8800/events', newEvent);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'événement :", error);
    }

    // Si la case "remove after drop" est cochée, supprimer l'élément de la liste d'événements
    const checkbox = document.getElementById('drop-remove');
    if (checkbox.checked) {
      info.draggedEl.parentNode.removeChild(info.draggedEl);
    }
  };

  const handleAddEvent = async () => {
    const newEvent = {
      title: eventTitle,
      start: selectedDate.toISOString(), // Convertir la date au format ISO
      allDay: true,
      backgroundColor: eventColor // Utiliser la couleur choisie pour l'événement
    };
  
    // Ajouter l'événement à l'état et à la base de données
    try {
      const response = await axios.post('http://localhost:5000/events', newEvent);
      setEvents((prevEvents) => [...prevEvents, response.data]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'événement :", error);
    }
  
    // Réinitialiser l'état
    setEventTitle("");
    setEventColor("#ff0000");
    setIsModalOpen(false); // Fermer la modal après ajout de l'événement
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date); // Sauvegarder la date sélectionnée
    setIsModalOpen(true); // Ouvrir la modal pour saisir l'événement
  };

  const handleDeleteEvent = async (eventId) => {
    console.log("Suppression de l'événement avec ID :", eventId); // Log pour débogage
    console.log("Événements avant suppression :", events); // Log pour débogage
    try {
      await axios.delete(`http://localhost:5000/events/${eventId}`);
      setEvents((prevEvents) => {
        const updatedEvents = prevEvents.filter(event => event.id !== eventId);
        console.log("Événements après suppression :", updatedEvents); // Log pour débogage
        return updatedEvents;
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement :", error);
    }
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
          </div>
          <div className="col-md-10" style={{ margin: 'auto' }}>
            <div className="card card-primary">
              <div className="card-body p-0">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  editable={true}
                  droppable={true}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={events} // Utiliser l'état pour les événements
                  eventDrop={handleEventDrop} // Gérer le dépôt d'événements
                  dateClick={handleDateClick} // Gérer le clic sur une date
                  eventContent={(arg) => {
                    // Créer l'élément de suppression
                    const deleteButton = document.createElement('button');
                    deleteButton.innerText = 'X';
                    deleteButton.style.background = 'transparent'; // Arrière-plan transparent
                    deleteButton.style.color = 'black'; // Couleur noire
                    deleteButton.style.fontSize = '11px'; // Réduction de la taille de la police
                    deleteButton.style.border = '1px 1px 1px solid black'; // Pas de bordure
                    deleteButton.style.position = 'absolute';
                    deleteButton.style.top = '0';
                    deleteButton.style.right = '0';
                    deleteButton.style.cursor = 'pointer';
                  
                    // Lier la fonction de suppression
                    deleteButton.addEventListener('click', (e) => {
                      e.stopPropagation(); // Empêche la propagation de l'événement de clic
                      handleDeleteEvent(arg.event.id);
                    });
                  
                    // Ajouter le bouton à l'élément de contenu de l'événement
                    const content = document.createElement('div');
                    content.innerHTML = arg.event.title;
                    content.style.position = 'relative';
                    content.appendChild(deleteButton);
                  
                    return { domNodes: [content] };
                  }}
                  
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter un événement */}
      {isModalOpen && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter un événement</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre de l'événement</label>
                  <input
                    type="text"
                    className="form-control"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Entrez le titre"
                  />
                </div>
                <div className="form-group">
                  <label>Couleur</label>
                  <input
                    type="color"
                    className="form-control"
                    value={eventColor}
                    onChange={(e) => setEventColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Fermer
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddEvent}
                >
                  Ajouter l'événement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Calenderie;