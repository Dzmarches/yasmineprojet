import React, { useEffect, useRef, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import frLocale from '@fullcalendar/core/locales/fr';
import { FaTimes, FaCalendarAlt, FaPalette, FaEdit } from 'react-icons/fa';

const Calenderie = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventColor, setEventColor] = useState("#3a87ad");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [ecoleId, setEcoleId] = useState(null);
  const [ecoleeId, setEcoleeId] = useState(null);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.map(event => ({
        ...event,
        start: event.start,
        end: event.end,
        backgroundColor: event.backgroundColor || "#3a87ad",
        borderColor: event.borderColor || "#3a87ad",
        textColor: event.textColor || getContrastColor(event.backgroundColor || "#3a87ad")
      })));
    } catch (error) {
      console.error("Erreur lors de la récupération des événements :", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    const storedEcoleId = localStorage.getItem("ecoleId");
    const storedEcoleeId = localStorage.getItem("ecoleeId");

    if (storedEcoleId) setEcoleId(storedEcoleId);
    if (storedEcoleeId) setEcoleeId(storedEcoleeId);
  }, []);

  const handleEventClick = (info) => {
    setCurrentEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      backgroundColor: info.event.backgroundColor,
      borderColor: info.event.borderColor
    });
    setEventTitle(info.event.title);
    setEventColor(info.event.backgroundColor || "#3a87ad");
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (!eventTitle.trim()) {
      alert("Veuillez entrer un titre pour l'événement");
      return;
    }

    const updatedEvent = {
      title: eventTitle,
      start: currentEvent.start,
      backgroundColor: eventColor,
      borderColor: eventColor,
      textColor: getContrastColor(eventColor),
      ecoleId: ecoleId || null,
      ecoleeId: ecoleeId || null
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/events/${currentEvent.id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Rafraîchir les événements après modification
      await fetchEvents();

      setIsEditModalOpen(false);
      setEventTitle("");
      setEventColor("#3a87ad");
      setCurrentEvent(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement :", error);
      alert("Vous n'avez pas les droits pour modifier cet événement");
    }
  };

  const handleAddEvent = async () => {
    if (!eventTitle.trim()) {
      alert("Veuillez entrer un titre pour l'événement");
      return;
    }

    const newEvent = {
      title: eventTitle,
      start: selectedDate.toISOString(),
      allDay: true,
      backgroundColor: eventColor,
      borderColor: eventColor,
      textColor: getContrastColor(eventColor),
      ecoleId: ecoleId || null,
      ecoleeId: ecoleeId || null
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post('http://localhost:5000/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Rafraîchir les événements après ajout
      await fetchEvents();

      setEventTitle("");
      setEventColor("#3a87ad");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'événement :", error);
      alert("Vous n'avez pas les droits pour créer cet événement");
    }
  };

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Rafraîchir les événements après suppression
        await fetchEvents();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        alert("Vous n'avez pas les droits pour supprimer cet événement");
      }
    }
  };

  const handleEventDrop = async (info) => {
    const title = info.draggedEl.innerText;
    const newEvent = {
      title: title,
      start: info.date,
      allDay: true,
      ecoleId: ecoleId || null,
      ecoleeId: ecoleeId || null
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post('http://localhost:5000/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Rafraîchir les événements après déplacement
      await fetchEvents();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'événement :", error);
      alert("Vous n'avez pas les droits pour déplacer cet événement");
    }

    const checkbox = document.getElementById('drop-remove');
    if (checkbox?.checked) {
      info.draggedEl.parentNode.removeChild(info.draggedEl);
    }
  };

  const renderEventContent = (arg) => {
    const eventEl = document.createElement('div');
    eventEl.className = 'fc-event-content';

    const titleEl = document.createElement('div');
    titleEl.className = 'fc-event-title';
    titleEl.textContent = arg.event.title;
    titleEl.style.whiteSpace = 'normal';
    titleEl.style.overflow = 'hidden';
    titleEl.style.textOverflow = 'ellipsis';
    titleEl.style.display = '-webkit-box';
    titleEl.style.webkitLineClamp = '3';
    titleEl.style.webkitBoxOrient = 'vertical';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'fc-event-buttons';

    // Bouton de suppression avec FaTimes
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'fc-event-delete-btn';
    deleteBtn.innerHTML = '<FaTimes />';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteEvent(arg.event.id);
    });

    // Bouton d'édition avec FaEdit
    const editBtn = document.createElement('button');
    editBtn.className = 'fc-event-edit-btn';
    editBtn.innerHTML = '<FaEdit />';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleEventClick({ event: arg.event });
    });

    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(deleteBtn);

    eventEl.appendChild(titleEl);
    eventEl.appendChild(buttonsContainer);

    return { domNodes: [eventEl] };
  };

  return (
    <section className="calendar-section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card calendar-card">
              <div className="card-body p-0">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  editable={true}
                  selectable={true}
                  droppable={true}
                  locale={frLocale} // ✅ langue française
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={events}
                  eventDrop={handleEventDrop}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  eventContent={renderEventContent}
                  eventClassNames="custom-event"
                  dayHeaderClassNames="custom-day-header"
                />

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter un événement */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  <FaCalendarAlt className="modal-icon" />
                  Nouvel Événement
                </h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FaTimes />
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
                  <label>Titre de l'événement</label>
                  <input
                    type="text"
                    className="form-control"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Entrez le titre de l'événement"
                    autoFocus
                  />
                </div>
                <div className="form-group color-picker-group">
                  <label>
                    <FaPalette className="color-icon" />
                    Couleur de l'événement
                  </label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      className="color-picker"
                      value={eventColor}
                      onChange={(e) => setEventColor(e.target.value)}
                    />
                    <div
                      className="color-preview"
                      style={{ backgroundColor: eventColor }}
                    ></div>
                    <span className="color-value">{eventColor}</span>
                  </div>
                </div>
                <div className="selected-date">
                  Date sélectionnée: {selectedDate && selectedDate.toLocaleDateString()}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  className="btn btn-save"
                  onClick={handleAddEvent}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour modifier un événement */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h3>
                  <FaCalendarAlt className="modal-icon" />
                  Modifier l'Événement
                </h3>
                <button
                  className="modal-close-btn"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setCurrentEvent(null);
                    setEventTitle("");
                    setEventColor("#3a87ad");
                  }}
                >
                  <FaTimes />
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
                  <label>Titre de l'événement</label>
                  <input
                    type="text"
                    className="form-control"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Modifier le titre de l'événement"
                    autoFocus
                  />
                </div>
                <div className="form-group color-picker-group">
                  <label>
                    <FaPalette className="color-icon" />
                    Couleur de l'événement
                  </label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      className="color-picker"
                      value={eventColor}
                      onChange={(e) => setEventColor(e.target.value)}
                    />
                    <div
                      className="color-preview"
                      style={{ backgroundColor: eventColor }}
                    ></div>
                    <span className="color-value">{eventColor}</span>
                  </div>
                </div>
                <div className="selected-date">
                  Date de l'événement: {currentEvent?.start && new Date(currentEvent.start).toLocaleDateString()}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-cancel"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setCurrentEvent(null);
                    setEventTitle("");
                    setEventColor("#3a87ad");
                  }}
                >
                  Annuler
                </button>
                <button
                  className="btn btn-save"
                  onClick={handleUpdateEvent}
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .calendar-section {
            padding: 20px;
            background-color: #f5f7fa;
          }

          .calendar-card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }

          .fc {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .fc-event-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 2px 5px;
          }

          .fc-event-title {
            flex-grow: 1;
            padding-right: 5px;
          }

          .fc-event-buttons {
            display: flex;
            gap: 5px;
          }

          .fc-event-delete-btn, .fc-event-edit-btn {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0 3px;
            font-size: 0.8rem;
            opacity: 0.7;
            transition: opacity 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .fc-event-delete-btn:hover, .fc-event-edit-btn:hover {
            opacity: 1;
          }

          /* Reste des styles inchangés... */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-container {
            width: 100%;
            max-width: 500px;
            margin: 0 20px;
          }

          .modal-content {
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
          }

          .modal-header {
            padding: 20px;
            background-color: #3a87ad;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-header h3 {
            margin: 0;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .modal-icon, .color-icon {
            font-size: 1.2rem;
          }

          .modal-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 5px;
          }

          .modal-body {
            padding: 20px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #495057;
            display: flex;
            align-items: center;
            gap: 8px;
          }


.form-control {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #3a87ad;
  box-shadow: 0 0 0 2px rgba(58, 135, 173, 0.2);
}

.color-picker-group {
  margin-top: 25px;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 8px;
}

.color-picker {
  width: 50px;
  height: 30px;
  padding: 0;
  border: none;
  cursor: pointer;
}

.color-preview {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.color-value {
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
}

.selected-date {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #495057;
}

.modal-footer {
  padding: 15px 20px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background-color: #f1f1f1;
  color: #495057;
}

.btn-cancel:hover {
  background-color: #e2e2e2;
}

.btn-save {
  background-color: #3a87ad;
  color: white;
}

.btn-save:hover {
  background-color: #2c6a8a;
}`
        }
      </style>
    </section>
  );
};

export default Calenderie;