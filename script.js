// systeme de page d'intro
document.addEventListener('DOMContentLoaded', function() {
    // Afficher la page d'intro dans tous les cas
    document.getElementById('intro-page').style.display = 'block';

    // Ajouter un événement sur le bouton d'intro
    document.getElementById('intro-button').addEventListener('click', function() {
        // Redirection vers connexion.html
        window.location.href = 'connexion.html';
    });
});
