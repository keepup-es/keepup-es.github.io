/**
 * Init Google services
 */
function initGoogle() {
    const firebaseConfig = {
        apiKey: "AIzaSyB8UebBBTHhtj8ohLPA9pWPki2YFjZishE",
        authDomain: "keepup-273915.firebaseapp.com",
        databaseURL: "https://keepup-273915.firebaseio.com",
        projectId: "keepup-273915",
        storageBucket: "keepup-273915.appspot.com",
        messagingSenderId: "1076647191746",
        appId: "1:1076647191746:web:72e79c6034520239c4875b",
        measurementId: "G-YS1C9B9JGH"
    };

    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
}

/**
 * Store data functions
 */
function storeEmail(data, callback) {
    let database = firebase.database();
    let ref = database.ref("/contacts").push();
    ref.set(data)
        .then(() => callback(true))
        .catch(() => callback(false));
}

/**
 * Buttons handlers
 */

function setButtonsHandlers() {
    // Submit button handler
    let submitButton = $("button#submit");
    submitButton.on("click", event => {
        let email = $("input#email").val();
        if (email !== "") {
            let data = { email, page: "particulares" }
            storeEmail(data, result => {
                if (result) alert("¡Gracias! En seguida te avisaremos...");
                else alert("Ops... Ha habido un problema. Escribenos un correo desde la páginas de contacto.")
            });
        }    
    });
}

(function($) {
    initGoogle();
    setButtonsHandlers();
})(jQuery);