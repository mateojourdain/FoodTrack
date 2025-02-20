document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('qcmForm');
    
    // Gérer la sélection des options
    document.querySelectorAll('.option').forEach(button => {
        button.addEventListener('click', function() {
            // Désélectionner les autres options du même groupe
            const parentBlock = this.closest('.question-block');
            parentBlock.querySelectorAll('.option').forEach(btn => {
                btn.classList.remove('selected');
            });
            // Sélectionner l'option cliquée
            this.classList.add('selected');
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer la réponse à la question sur l'activité physique
        const activitePhysique = document.querySelector('.question-block:first-child .option.selected')?.dataset.value;
        
        // Sauvegarder la préférence dans le localStorage
        localStorage.setItem('modeSportif', activitePhysique === 'oui');
        localStorage.setItem('questionnaireComplete', 'true');
        
        // Redirection vers le calendrier
        window.location.href = 'calendrier.html';
    });
});


// ... existing code ...
// Ajout d'un écouteur d'événements pour les boutons de réponse
document.querySelectorAll('.option').forEach(button => {
    button.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        if (value === 'non') {
            // Si la réponse est "Non", masquer les collations
            hideCollations();
        }
        // ... logique pour gérer d'autres réponses ...
    });
});

// Fonction pour masquer les collations
function hideCollations() {
    const collations = document.querySelectorAll('.repas'); // Sélectionner les éléments de collation
    collations.forEach(repas => {
        if (repas.querySelector('h4').innerText === 'Collation') {
            repas.style.display = 'none'; // Masquer les collations
        }
    });
}
