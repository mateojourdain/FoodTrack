let date = new Date();
let selectedDate = null;
let repasData = {};

document.addEventListener('DOMContentLoaded', function () {
    afficherCalendrier();

    document.getElementById('prevMonth').addEventListener('click', () => {
        date.setMonth(date.getMonth() - 1);
        afficherCalendrier();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        date.setMonth(date.getMonth() + 1);
        afficherCalendrier();
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    document.getElementById('save-repas').addEventListener('click', sauvegarderRepas);

    console.log('Valeur de modeSportif dans localStorage:', localStorage.getItem('modeSportif')); // Debug

    const modeSportif = localStorage.getItem('modeSportif') === 'true';
    console.log('Mode sportif interprété:', modeSportif); // Debug

    const collationDivs = document.querySelectorAll('.collation-div');
    console.log('Nombre de divs collation trouvés:', collationDivs.length); // Debug

    function updateCollationVisibility() {
        const modeSportif = localStorage.getItem('modeSportif') === 'true';

        // Mettre à jour les classes du body
        if (modeSportif) {
            document.body.classList.add('mode-sportif');
        } else {
            document.body.classList.remove('mode-sportif');
        }

        // Mettre à jour uniquement la visibilité des collations
        const collationSlots = document.querySelectorAll(
            '[data-repas-id="collation-matin"], [data-repas-id="collation-aprem"]'
        );

        collationSlots.forEach(slot => {
            slot.style.display = modeSportif ? 'block' : 'none';
        });
    }

    // Appeler la fonction au chargement
    updateCollationVisibility();

    // Écouter les changements du mode sportif
    window.addEventListener('storage', function (e) {
        if (e.key === 'modeSportif') {
            updateCollationVisibility();
        }
    });

    // Gestion de l'affichage des collations
    const reponseActivitePhysique = localStorage.getItem('activitePhysique');

    if (reponseActivitePhysique === 'oui') {
        collationDivs.forEach(div => {
            div.style.display = 'block';
        });
        console.log('Collations affichées car activité physique = oui'); // Debug
    } else {
        console.log('Collations masquées car activité physique =', reponseActivitePhysique); // Debug
    }

    // Vérifier si les collations doivent être masquées
    const hideCollations = localStorage.getItem('hideCollations');
    if (hideCollations === 'true') {
        const collations = document.querySelectorAll('.repas'); // Sélectionner les éléments de collation
        collations.forEach(repas => {
            if (repas.querySelector('h4').innerText === 'Collation') {
                repas.style.display = 'none'; // Masquer les collations
            }
        });
    }

    const copyButton = document.getElementById('copyToList');

    if (copyButton) {
        console.log('Bouton trouvé !'); // Pour déboguer

        copyButton.addEventListener('click', function () {
            console.log('Bouton cliqué !'); // Pour déboguer

            // Récupérer tous les contenus des textarea
            const repasInputs = document.querySelectorAll('.repas-input');
            let aliments = [];

            // Récupérer le contenu de chaque textarea
            repasInputs.forEach(input => {
                const contenu = input.value.trim();
                if (contenu) {
                    const lignes = contenu.split('\n');
                    aliments = aliments.concat(lignes.filter(ligne => ligne.trim()));
                }
            });

            if (aliments.length > 0) {
                // Récupérer la liste existante
                let listeExistante = [];
                try {
                    listeExistante = JSON.parse(localStorage.getItem('listeItems')) || [];
                } catch (e) {
                    console.error('Erreur lors de la lecture du localStorage:', e);
                    listeExistante = [];
                }

                // Créer un Set des textes existants pour une recherche plus rapide
                const textesExistants = new Set(listeExistante.map(item => item.text.toLowerCase().trim()));

                // Filtrer les nouveaux aliments pour éviter les doublons
                const alimentsUniques = aliments.filter(aliment => {
                    const alimentTrimLC = aliment.toLowerCase().trim();
                    return !textesExistants.has(alimentTrimLC);
                });

                // Ajouter uniquement les nouveaux aliments
                const nouvelleList = [...listeExistante];
                alimentsUniques.forEach(aliment => {
                    if (aliment.trim()) {
                        nouvelleList.push({
                            text: aliment.trim(),
                            checked: false
                        });
                    }
                });

                // Sauvegarder dans le localStorage
                try {
                    localStorage.setItem('listeItems', JSON.stringify(nouvelleList));
                    console.log('Sauvegardé dans localStorage:', nouvelleList);

                    // Message de confirmation d'envoi de la liste de courses
                    const notification = document.createElement('div');
                    notification.textContent = `Ton aliment a été ajouté a ta liste de course`;
                    notification.style.cssText = `
                             position: fixed;
                            bottom: 95px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #8E8E93;
                            color: #ffffff;
                            padding: 8px 16px;
                            border-radius: 8px;
                            font-size: 14px;
                            z-index: 9999;
                    `;

                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                } catch (e) {
                    console.error('Erreur lors de la sauvegarde:', e);
                }
            } else {
                // Message si aucun aliment n'est trouvé dans les inputs
                const notification = document.createElement('div');
                notification.textContent = "Aucun aliment à ajouter";
                notification.style.cssText = `
                            position: fixed;
                            bottom: 95px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #8E8E93;
                            color: #ffffff;
                            padding: 8px 16px;
                            border-radius: 8px;
                            font-size: 14px;
                            z-index: 9999;
                `;

                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        });
    } else {
        console.error('Bouton non trouvé !'); // Pour déboguer
    }

    document.getElementById('retourMois').addEventListener('click', () => {
        window.location.href = 'calendrier.html'; // Redirige vers la page calendrier
    });
});

function afficherCalendrier() {
    const aujourdhui = new Date();
    const premier = new Date(date.getFullYear(), date.getMonth(), 1);
    const dernier = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    document.getElementById('monthDisplay').textContent =
        premier.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    const calendrier = document.getElementById('calendrier-jours');
    calendrier.innerHTML = '';

    for (let i = 0; i < premier.getDay(); i++) {
        const jour = document.createElement('div');
        jour.classList.add('jour', 'autre-mois');
        calendrier.appendChild(jour);
    }

    for (let i = 1; i <= dernier.getDate(); i++) {
        const jour = document.createElement('div');
        jour.classList.add('jour');
        jour.textContent = i;

        // Ajouter uniquement l'indicateur
        const indicateur = document.createElement('div');
        indicateur.classList.add('repas-indicateur');
        jour.appendChild(indicateur);

        const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
        const dateStr = currentDate.toISOString().split('T')[0];

        // Vérifier s'il y a des repas pour cette date
        const repasExistants = localStorage.getItem(`meals_${dateStr}`);
        if (repasExistants) {
            const repas = JSON.parse(repasExistants);
            const hasContent = Object.values(repas).some(value => value && value.trim() !== '');
            if (hasContent) {
                indicateur.classList.add('active');
            }
        }

        if (currentDate.toDateString() === aujourdhui.toDateString()) {
            jour.classList.add('aujourd-hui');
        }

        jour.addEventListener('click', () => {
            const dateCliquee = new Date(date.getFullYear(), date.getMonth(), i);
            showDailyView(dateCliquee);
        });

        calendrier.appendChild(jour);
    }
}

function ouvrirModal(jour) {
    selectedDate = new Date(date.getFullYear(), date.getMonth(), jour);
    const dateStr = selectedDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    document.getElementById('modal-date').textContent = dateStr;

    const dateKey = selectedDate.toISOString().split('T')[0];
    const repasJour = repasData[dateKey] || {};

    document.getElementById('petit-dejeuner').value = repasJour.petitDejeuner || '';
    document.getElementById('collation-matin').value = repasJour.collationMatin || '';
    document.getElementById('dejeuner').value = repasJour.dejeuner || '';
    document.getElementById('collation-aprem').value = repasJour.collationAprem || '';
    document.getElementById('diner').value = repasJour.diner || '';

    document.getElementById('modal').style.display = 'block';
}

function sauvegarderRepas() {
    const dateKey = selectedDate.toISOString().split('T')[0];

    repasData[dateKey] = {
        petitDejeuner: document.getElementById('petit-dejeuner').value,
        collationMatin: document.getElementById('collation-matin').value,
        dejeuner: document.getElementById('dejeuner').value,
        collationAprem: document.getElementById('collation-aprem').value,
        diner: document.getElementById('diner').value
    };

    document.getElementById('modal').style.display = 'none';
}

// Gestionnaire pour le clic sur un jour
function handleDayClick(date) {
    const vueMensuelle = document.getElementById('vue-mensuelle');
    const vueJournaliere = document.getElementById('vue-journaliere');
    const dateDisplay = document.getElementById('dateDisplay');

    // Formater la date pour l'affichage
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    dateDisplay.textContent = date.toLocaleDateString('fr-FR', options);

    // Animation de transition
    vueMensuelle.style.transform = 'translateX(-100%)';
    vueJournaliere.style.transform = 'translateX(0)';
    vueJournaliere.style.display = 'block';

    // Charger les repas pour cette date
    loadMealsForDate(date);
}

// Fonction pour charger les repas d'une date
function loadMealsForDate(date) {
    // Récupérer les repas depuis le stockage local
    const dateStr = date.toISOString().split('T')[0];
    const meals = JSON.parse(localStorage.getItem(`meals_${dateStr}`)) || {};

    // Mettre à jour l'affichage des repas
    document.getElementById('petit-dejeuner-texte').textContent =
        meals['petit-dejeuner'] || 'Aucun repas prévu';
    document.getElementById('collation-matin-texte').textContent =
        meals['collation-matin'] || 'Aucune collation prévue';
    document.getElementById('dejeuner-texte').textContent =
        meals['dejeuner'] || 'Aucun repas prévu';
    document.getElementById('collation-aprem-texte').textContent =
        meals['collation-aprem'] || 'Aucune collation prévue';
    document.getElementById('diner-texte').textContent =
        meals['diner'] || 'Aucun repas prévu';
}

// Gestionnaire pour les boutons "Modifier"
document.querySelectorAll('.modifier-repas').forEach(button => {
    button.addEventListener('click', (e) => {
        const repasType = e.target.dataset.repas;
        const modal = document.getElementById('modal');
        modal.style.display = 'block';

        // Pré-remplir le modal avec les repas existants
        const dateStr = currentDate.toISOString().split('T')[0];
        const meals = JSON.parse(localStorage.getItem(`meals_${dateStr}`)) || {};
        document.getElementById(repasType).value = meals[repasType] || '';
    });
});

// Gestionnaire pour sauvegarder les repas
document.getElementById('save-repas').addEventListener('click', () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const meals = {
        'petit-dejeuner': document.getElementById('petit-dejeuner').value,
        'collation-matin': document.getElementById('collation-matin').value,
        'dejeuner': document.getElementById('dejeuner').value,
        'collation-aprem': document.getElementById('collation-aprem').value,
        'diner': document.getElementById('diner').value
    };

    // Sauvegarder dans le stockage local
    localStorage.setItem(`meals_${dateStr}`, JSON.stringify(meals));

    // Mettre à jour l'affichage
    loadMealsForDate(currentDate);

    // Fermer le modal
    document.getElementById('modal').style.display = 'none';
});

// Ajouter les gestionnaires tactiles pour une expérience native
let startX;
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.addEventListener('touchmove', (e) => {
    if (!startX) return;

    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    // Si on glisse vers la gauche depuis la vue mensuelle
    if (diff > 50 && document.getElementById('vue-journaliere').style.display === 'none') {
        handleDayClick(currentDate);
    }
    // Si on glisse vers la droite depuis la vue journalière
    else if (diff < -50 && document.getElementById('vue-journaliere').style.display === 'block') {
        document.getElementById('retourMois').click();
    }

    startX = null;
});

// Désactiver le défilement du body quand on est dans la vue journalière
document.body.style.overflow = 'hidden';

// Ajouter le "bounce effect" style iOS
document.querySelector('.timeline').addEventListener('scroll', (e) => {
    const timeline = e.target;
    if (timeline.scrollTop <= 0) {
        timeline.style.overflow = 'hidden';
        setTimeout(() => {
            timeline.style.overflow = 'auto';
        }, 300);
    }
});

function initCalendar() {
    // ... existing calendar initialization code ...

    // Ajouter l'événement de clic sur chaque jour
    document.querySelectorAll('.jour').forEach(day => {
        day.addEventListener('click', () => {
            if (!day.classList.contains('autre-mois')) {
                const selectedDate = new Date(day.dataset.date);
                showDailyView(selectedDate);
            }
        });
    });
}

function scrollToNearestMeal() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Définir les heures approximatives des repas
    const repasHeures = [
        { nom: 'petit-dejeuner', heure: 7 },
        { nom: 'collation-matin', heure: 10 },
        { nom: 'dejeuner', heure: 12 },
        { nom: 'gouter', heure: 16 },
        { nom: 'diner', heure: 19 }
    ];

    // Convertir l'heure actuelle en minutes
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    // Trouver le repas le plus proche
    let repasProche = repasHeures[0];
    let minDifference = Infinity;

    repasHeures.forEach(repas => {
        const repasEnMinutes = repas.heure * 60;
        const difference = Math.abs(repasEnMinutes - currentTimeInMinutes);

        if (difference < minDifference) {
            minDifference = difference;
            repasProche = repas;
        }
    });

    // Trouver l'élément correspondant au repas le plus proche
    const repasElement = document.querySelector(`[data-repas-id="${repasProche.nom}"]`);
    if (repasElement) {
        // Faire défiler jusqu'au repas avec une animation douce
        repasElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showDailyView(selectedDate) {
    const vueMensuelle = document.getElementById('vue-mensuelle');
    const vueJournaliere = document.getElementById('vue-journaliere');
    const dateDisplay = document.getElementById('dateDisplay');
    const heuresContainer = document.querySelector('.heures-container');

    // Ajuster la hauteur pour la version mobile
    if (window.innerWidth <= 480) {
        heuresContainer.style.minHeight = '200vh';  // Double la hauteur minimale
        heuresContainer.style.height = '200vh';     // Double la hauteur
    }

    // Formater la date - Supprimer le bouton de copie global
    dateDisplay.textContent = selectedDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    // Vider le conteneur
    heuresContainer.innerHTML = '';

    // Définir les repas avec leurs périodes
    const repas = [
        { nom: 'Petit déjeuner', periode: 'Matin', id: 'petit-dejeuner' },
        { nom: 'Collation matinale', periode: 'Matin', id: 'collation-matin', isCollation: true },
        { nom: 'Déjeuner', periode: 'Midi', id: 'dejeuner' },
        { nom: 'Goûter', periode: 'Après-midi', id: 'collation-aprem', isCollation: true },
        { nom: 'Dîner', periode: 'Soir', id: 'diner' }
    ];

    // Récupérer les repas sauvegardés
    const dateStr = selectedDate.toISOString().split('T')[0];
    const savedMeals = JSON.parse(localStorage.getItem(`meals_${dateStr}`)) || {};

    // Vérifier le mode sportif
    const modeSportif = localStorage.getItem('modeSportif') === 'true';

    let lastPeriode = '';
    repas.forEach(repas => {
        // Vérifier si on doit afficher ce repas en mode non sportif
        if (!modeSportif && repas.isCollation) {
            return; // Sauter complètement la création des éléments pour les collations
        }

        // Créer le slot pour la période seulement si elle est différente de la précédente
        if (lastPeriode !== repas.periode) {
            const periodeSlot = document.createElement('div');
            periodeSlot.className = 'periode-slot';

            const periodeLabel = document.createElement('div');
            periodeLabel.className = 'periode-label';
            periodeLabel.textContent = repas.periode;
            periodeSlot.appendChild(periodeLabel);
            heuresContainer.appendChild(periodeSlot);

            lastPeriode = repas.periode;
        }

        const repasSlot = document.createElement('div');
        repasSlot.className = 'repas-slot';
        repasSlot.setAttribute('data-repas-id', repas.id);

        const contenuRepas = document.createElement('div');
        contenuRepas.className = 'contenu-repas';

        const nomRepas = document.createElement('div');
        nomRepas.className = 'nom-repas';
        nomRepas.textContent = repas.nom;

        // Créer la zone de contenu du repas
        const repasContent = document.createElement('div');
        repasContent.className = 'repas-content';

        if (savedMeals[repas.id]) {
            // Afficher le repas sauvegardé
            repasContent.textContent = savedMeals[repas.id];

            // Ajouter un bouton de modification
            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = 'Modifier';
            repasContent.appendChild(editButton);
        } else {
            // Afficher le bouton "Ajouter un repas"
            const addButton = document.createElement('button');
            addButton.className = 'add-button';
            addButton.textContent = 'Ajouter un repas';
            repasContent.appendChild(addButton);
        }

        // Gestionnaire d'événements pour l'ajout/modification
        repasContent.addEventListener('click', (e) => {
            if (e.target.matches('.add-button, .edit-button') || e.target.matches('.repas-content')) {
                const input = document.createElement('textarea');
                input.className = 'repas-input';
                input.value = savedMeals[repas.id] || '';
                input.placeholder = '';

                // Fonction pour ajuster automatiquement la hauteur
                const adjustHeight = (element) => {
                    element.style.height = '45px';  // Hauteur minimale
                    element.style.height = element.scrollHeight + 'px';
                };

                // Ajuster la hauteur initiale
                input.addEventListener('input', function () {
                    adjustHeight(this);
                });

                // Ajuster aussi au chargement initial
                setTimeout(() => adjustHeight(input), 0);

                // Créer le conteneur pour les boutons
                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'buttons-container';

                // Créer le bouton de sauvegarde
                const saveButton = document.createElement('button');
                saveButton.className = 'save-button';
                saveButton.textContent = 'Valider';

                // Créer le bouton de copie
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-button';
                copyButton.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5H6C5.44772 5 5 5.44772 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V6C19 5.44772 18.5523 5 18 5H16M8 5V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V5M8 5H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;

                // Ajouter l'événement de copie
                copyButton.addEventListener('click', () => {
                    const repasText = input.value.trim();
                    if (repasText) {
                        let listeExistante = [];
                        try {
                            listeExistante = JSON.parse(localStorage.getItem('listeItems')) || [];
                        } catch (e) {
                            console.error('Erreur lors de la lecture du localStorage:', e);
                            listeExistante = [];
                        }

                        const textesExistants = new Set(listeExistante.map(item => item.text.toLowerCase().trim()));
                        const aliments = repasText.split('\n').filter(ligne => ligne.trim());
                        const alimentsUniques = aliments.filter(aliment => {
                            const alimentTrimLC = aliment.toLowerCase().trim();
                            return !textesExistants.has(alimentTrimLC);
                        });

                        const nouvelleList = [...listeExistante];
                        alimentsUniques.forEach(aliment => {
                            if (aliment.trim()) {
                                nouvelleList.push({
                                    text: aliment.trim(),
                                    checked: false
                                });
                            }
                        });

                        localStorage.setItem('listeItems', JSON.stringify(nouvelleList));

                        // Notification aliment ajouté à la liste de courses
                        const notification = document.createElement('div');
                        notification.textContent = `Ton aliment a été ajouté a ta liste de course`;
                        notification.style.cssText = `
                            position: fixed;
                            bottom: 95px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #8E8E93;
                            color: #ffffff;
                            padding: 8px 16px;
                            border-radius: 8px;
                            font-size: 14px;
                            z-index: 9999;
                           
                        `;
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 2000);
                    }
                });

                // Ajouter les boutons au conteneur
                buttonsContainer.appendChild(saveButton);
                buttonsContainer.appendChild(copyButton);

                // Ajouter le bouton de suppression
                const deleteButton = document.createElement('span');
                deleteButton.className = 'delete-repas';
                deleteButton.innerHTML = '&times;';
                deleteButton.addEventListener('click', () => {
                    input.value = '';
                    delete savedMeals[repas.id];
                    localStorage.setItem(`meals_${dateStr}`, JSON.stringify(savedMeals));

                    const repasContent = input.closest('.repas-content');
                    repasContent.innerHTML = '';
                    const addButton = document.createElement('button');
                    addButton.className = 'add-button';
                    addButton.textContent = 'Ajouter un repas';
                    repasContent.appendChild(addButton);
                });

                // Vider le contenu actuel et ajouter les nouveaux éléments
                repasContent.innerHTML = '';
                const inputContainer = document.createElement('div');
                inputContainer.className = 'input-container';
                inputContainer.appendChild(input);
                inputContainer.appendChild(deleteButton);
                repasContent.appendChild(inputContainer);
                repasContent.appendChild(buttonsContainer);

                input.focus();

                // Modifier l'événement de sauvegarde
                saveButton.addEventListener('click', () => {
                    const newContent = input.value.trim();

                    // Sauvegarder dans savedMeals
                    if (!savedMeals[repas.id]) {
                        savedMeals[repas.id] = {};
                    }
                    savedMeals[repas.id] = newContent;

                    // Sauvegarder dans localStorage
                    localStorage.setItem(`meals_${dateStr}`, JSON.stringify(savedMeals));

                    // Mettre à jour l'affichage
                    repasContent.innerHTML = '';
                    if (newContent) {
                        repasContent.textContent = newContent;
                        const editButton = document.createElement('button');
                        editButton.className = 'edit-button';
                        editButton.textContent = 'Modifier';
                        repasContent.appendChild(editButton);
                    } else {
                        const addButton = document.createElement('button');
                        addButton.className = 'add-button';
                        addButton.textContent = 'Ajouter un repas';
                        repasContent.appendChild(addButton);
                    }

                    // Mettre à jour l'indicateur dans la vue mensuelle
                    afficherCalendrier();
                });
            }
        });

        contenuRepas.appendChild(nomRepas);
        contenuRepas.appendChild(repasContent);
        repasSlot.appendChild(contenuRepas);
        heuresContainer.appendChild(repasSlot);
    });

    // Afficher la vue journalière
    vueJournaliere.style.display = 'block';
    vueJournaliere.offsetHeight;
    vueJournaliere.classList.add('active');
    vueMensuelle.style.transform = 'translateX(-100%)';

    // Appeler la fonction de défilement après avoir affiché la vue
    setTimeout(scrollToNearestMeal, 100); // Petit délai pour s'assurer que la vue est bien rendue
}

// Fonction pour mettre à jour la position de l'indicateur d'heure
function updateCurrentTimeIndicator() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Calculer la position en pourcentage (considérant 6h-23h comme période active)
    const startHour = 6; // 6h du matin
    const endHour = 23; // 23h du soir
    const totalHours = endHour - startHour;

    const currentHourDecimal = hours + (minutes / 60);
    let percentage = ((currentHourDecimal - startHour) / totalHours) * 100;

    // Limiter le pourcentage entre 0 et 100
    percentage = Math.max(0, Math.min(100, percentage));

    const indicator = document.querySelector('.current-time-indicator');
    if (indicator) {
        indicator.style.top = `${percentage}%`;
        indicator.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
}

// Mettre à jour l'indicateur toutes les minutes
setInterval(updateCurrentTimeIndicator, 60000);

// Mettre à jour la position toutes les minutes
setInterval(() => {
    if (document.getElementById('vue-journaliere').style.display === 'block') {
        scrollToNearestMeal();
    }
}, 60000);


// bouton pour supprimer un repas
document.querySelectorAll('.delete-repas').forEach(button => {
    button.addEventListener('click', function () {
        const repasDiv = this.closest('.repas');
        const input = repasDiv.querySelector('.repas-input');
        input.value = ''; // Efface le contenu du repas
    });
});

// Style pour l'animation du message
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, 20px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);
