document.addEventListener('DOMContentLoaded', function() {
     const appleLoginBtn = document.getElementById('apple-login-button');
    
    appleLoginBtn.addEventListener('click', function() {
        // Vérifier si Sign in with Apple est disponible
        if (window.AppleID) {
            AppleID.auth.signIn()
                .then(function(response) {
                    console.log('Connexion Apple réussie:', response);
                    
                    // Vérifier si l'utilisateur a déjà répondu au QCM
                    if (localStorage.getItem('qcmCompleted')) {
                        window.location.replace('calendrier.html');
                    } else {
                        window.location.replace('qcm.html');
                    }
                })
                .catch(function(error) {
                    console.error('Erreur de connexion Apple:', error);
                });
        } else {
            console.error('Sign in with Apple n\'est pas disponible');
        }
    });
});
