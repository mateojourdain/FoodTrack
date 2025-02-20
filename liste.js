document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('liste-input');
    const listeItems = document.getElementById('liste-items');
    const clearButton = document.querySelector('.clear-button');

    // Charger les éléments sauvegardés au démarrage
    loadItems();

    // Ajouter un écouteur pour le localStorage
    window.addEventListener('storage', function (e) {
        if (e.key === 'listeItems') {
            // Recharger la liste quand le localStorage est modifié
            listeItems.innerHTML = ''; // Vider la liste actuelle
            loadItems(); // Recharger les items
        }
    });

    // Ajuster la hauteur de l'input automatiquement
    input.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.value.trim() !== '') {
                addItem(input.value);
                input.value = ''; // Vider l'input
                input.style.height = 'auto'; // Réinitialiser la hauteur
            }
        }
    });

    // Fonction pour ajouter un item
    function addItem(itemText) {
        const li = document.createElement('li');
        li.className = 'liste-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'item-checkbox';

        // Ajouter l'événement pour sauvegarder l'état du checkbox
        checkbox.addEventListener('change', function () {
            saveItems();
        });

        const text = document.createElement('span');
        text.textContent = itemText;
        text.className = 'item-text';

        // Modifier le texte en un seul clic
        text.addEventListener('click', function () {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = text.textContent;
            editInput.className = 'edit-input';

            text.replaceWith(editInput);
            editInput.focus();

            // Sauvegarder les modifications quand on appuie sur Enter
            editInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (editInput.value.trim() !== '') {
                        text.textContent = editInput.value;
                        editInput.replaceWith(text);
                        saveItems();
                    }
                }
            });

            // Sauvegarder les modifications quand on perd le focus
            editInput.addEventListener('blur', function () {
                if (editInput.value.trim() !== '') {
                    text.textContent = editInput.value;
                    editInput.replaceWith(text);
                    saveItems();
                }
            });
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        listeItems.appendChild(li);

        saveItems();
    }

    // Fonction pour sauvegarder les items
    function saveItems() {
        const items = [];
        document.querySelectorAll('.liste-item').forEach(item => {
            items.push({
                text: item.querySelector('.item-text').textContent,
                checked: item.querySelector('.item-checkbox').checked
            });
        });
        localStorage.setItem('listeItems', JSON.stringify(items));
    }

    // Fonction pour charger les items
    function loadItems() {
        const savedItems = localStorage.getItem('listeItems');
        if (savedItems) {
            const items = JSON.parse(savedItems);
            items.forEach(item => {
                const li = document.createElement('li');
                li.className = 'liste-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'item-checkbox';
                checkbox.checked = item.checked;

                checkbox.addEventListener('change', function () {
                    saveItems();
                });

                const text = document.createElement('span');
                text.textContent = item.text;
                text.className = 'item-text';

                text.addEventListener('click', function () {
                    const editInput = document.createElement('input');
                    editInput.type = 'text';
                    editInput.value = text.textContent;
                    editInput.className = 'edit-input';

                    text.replaceWith(editInput);
                    editInput.focus();

                    editInput.addEventListener('keypress', function (e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (editInput.value.trim() !== '') {
                                text.textContent = editInput.value;
                                editInput.replaceWith(text);
                                saveItems();
                            }
                        }
                    });

                    editInput.addEventListener('blur', function () {
                        if (editInput.value.trim() !== '') {
                            text.textContent = editInput.value;
                            editInput.replaceWith(text);
                            saveItems();
                        }
                    });
                });

                li.appendChild(checkbox);
                li.appendChild(text);
                listeItems.appendChild(li);
            });
        }
    }

    // Ajouter l'événement de suppression
    clearButton.addEventListener('click', function () {
        if (confirm('Voulez-vous vraiment supprimer toute la liste ?')) {
            listeItems.innerHTML = ''; // Vider la liste
            localStorage.removeItem('listeItems'); // Supprimer du localStorage
        }
    });
});
// faire en sorte que le scrol de la liste descende de lui meme 


// Fonction pour faire défiler la div jusqu'en bas
function scrollToBottom() {
    const textContainer = document.getElementById('liste-container');
    textContainer.scrollTop = textContainer.scrollHeight;
  }

  // Appel de la fonction au chargement de la page
  window.onload = function() {
    scrollToBottom(); // S'assure qu'on est bien en bas au début
  };


