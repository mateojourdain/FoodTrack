// gestion des boutons et de leur conteneurs
document.addEventListener('DOMContentLoaded', function() {
    const calendarButton = document.querySelector('.calendar-button');
    const listeButton = document.querySelector('.liste-button');
    const calendarContainer = document.querySelector('.calendar-container');
    const listeContainer = document.querySelector('.liste-container');

    // Afficher le calendrier par défaut
    calendarButton.classList.add('active');
    calendarContainer.classList.add('active');

    calendarButton.addEventListener('click', function() {
        calendarButton.classList.add('active');
        listeButton.classList.remove('active');
        calendarContainer.classList.add('active');
        listeContainer.classList.remove('active');
    });

    listeButton.addEventListener('click', function() {
        listeButton.classList.add('active');
        calendarButton.classList.remove('active');
        listeContainer.classList.add('active');
        calendarContainer.classList.remove('active');
    });
});
// fin gestion des boutons et de leur conteneurs

