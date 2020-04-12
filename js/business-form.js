/**
 * Question validators 
 */

function optionsValidator(question) {
    let element = $(`.question[data-question="${question}"]`);
    let options = element.find("input[type=\"radio\"], .option-input");

    options.on("input", e => {
        let value = $(e.target).val() || $(e.target).text();

        if (value !== "") {
            if (value === "other") {
                element.removeClass("completed");
                let input = element.find(".option-input");
                input.empty().attr("contenteditable", "true").focus();
            } else element.addClass("completed");
        } else element.removeClass("completed");
    });
}

function selectionValidator(question) {
    let element = $(`.question[data-question="${question}"]`);
    let options = element.find("input[type=\"checkbox\"]");

    let validated = $(options).is(":checked");
    if (validated) element.addClass("completed");
    else element.removeClass("completed");

    options.on("input", () => {
        validated = $(options).is(":checked");

        if (validated) element.addClass("completed");
        else element.removeClass("completed");
    });
}

function numberValidator(question) {
    let element = $(`.question[data-question="${question}"]`);
    let input = element.find("input.user-input");

    input.on("input", e => {
        let value = $(e.target).val();
        if (value === "property") value = 0; 

        if (value !== "" && parseFloat(value) >= 0) element.addClass("completed");
        else element.removeClass("completed");
    });
}

function emailValidator(question) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let element = $(`.question[data-question="${question}"]`);
    let input = element.find("input[type=\"email\"]");

    input.on("input", e => {
        let value = $(e.target).val();

        if (re.test(value.toLowerCase())) element.addClass("completed");
        else element.removeClass("completed");
    });
}

/**
 * 
 * Question answer getter 
 */
function getAnswerTo(question, callback, time = 2000) {
    let element = $(`.question[data-question="${question}"]`);
    let option = element.find("input:checked");
    let optionInput = element.find(".option-input");
    let input = element.find(".user-input");

    if (option.length && option.val() !== "") {
        if (option.val() === "other") {
            if (time === 0) callback(optionInput.text());

            let timeout = null;
            optionInput.on("input", () => {
                clearInterval(timeout);
                timeout = setTimeout(() => callback(optionInput.text()), time);
            });
        } else if (option.length > 1) {
            let selection = [];
            $.each(option, (_, checked) => selection.push($(checked).val()));
            callback(selection);
        } else callback(option.val());
    } else if (input.length) {
        let value = input.val() || input.text();

        if (input.length > 1) {
            let target = null;
            $.each(input, (_, i) => {
                if (i.value && i.value !== "") target = i;
            });
            value = $(target).val() || $(target).text();
        }

        if (value !== "") {
            if (time === 0) callback(value);

            let timeout = null;
            input.on("input", () => {
                clearInterval(timeout);
                timeout = setTimeout(() => callback(value), time);
            });
        }
    } else callback(undefined);
}

/**
 * Form data getter
 */
function getFormData() {
    let data = {
        location: null,
        sector: null,
        services: [],
        employees: 0,
        billing: 0,
        yearly: true,
        rental: 0,
        email: "",
        extra: ""
    }

    getAnswerTo(1, location => data.location = location, 0);
    getAnswerTo(2, sector => data.sector = sector, 0); 
    getAnswerTo(3, services => data.services = services, 0); 
    getAnswerTo(4, employees => data.employees = employees, 0); 
    getAnswerTo(5, billing => data.billing = billing, 0);
    data.yearly = $("input#yearly-billing").val() !== "";
    getAnswerTo(6, rental => data.rental = rental, 0); 
    getAnswerTo(7, email => data.email = email, 0); 
    getAnswerTo(8, extra => data.extra = extra, 0); 

    return data;
}

/**
 * Question enablers & disablers 
 */

function enableQuestion(question) {
    $(`[data-question="${question}"]`).removeClass("disabled");
}

function disableQuestionsFrom(first, last = 6) {
    for (let i = first; i <= last; i++) {
        let questionElement = $(`[data-question="${i}"]`);
        questionElement.addClass("disabled");
    }
}

/**
 * Step control enablers & disablers 
 */

function enableStepControls(step) {
    $(`.step[data-step="${step}"] .step-control.disabled`).removeClass("disabled");
}

function disableStepControls(step) {
    $(`.step[data-step="${step}"] .step-control.next`).addClass("disabled");
    $(`.step[data-step="${step}"] .step-control.submit`).addClass("disabled");
}

/**
 * Step enablers & disablers 
 */

function showStep(next) {
    let current = $(".step").not(".hidden");
    let following = $(`.step[data-step="${next}"]`);

    current.fadeOut("", () => {
        following.fadeIn(1000, () => {
            current.addClass("hidden");
            following.removeClass("hidden");
        });
    });

    setProgressBar(next);
}

function setProgressBar(next) {
    let steps = {
        1: "7%",
        2: "50%",
        3: "100%",
        "success": "100%",
        "error": "0%",
        "wip-location": "0%",
        "wip-sector": "0%"
    }

    $(".form-progress .steps-indicator .progress-bar").css("width", steps[next]);
}

/**
 * Checkers
 */

function isQuestionCompleted(question) {
    return $(`.question[data-question="${question}"]`).hasClass("completed");
}

function checkStepOne() {
    if (isQuestionCompleted(1)) {
        enableQuestion(2);
        if (isQuestionCompleted(2)) {
            enableQuestion(3);
            if (isQuestionCompleted(3)) enableStepControls(1);
            else disableStepControls(1);
        } else {
            disableQuestionsFrom(3);
            disableStepControls(1);
        }
    } else {
        disableQuestionsFrom(2);
        disableStepControls(1);
    }

    return isQuestionCompleted(1) && isQuestionCompleted(2) && isQuestionCompleted(3);
}

function checkStepTwo() {
    if (isQuestionCompleted(4)) {
        enableQuestion(5);
        if (isQuestionCompleted(5)) {
            enableQuestion(6);
            if (isQuestionCompleted(6)) enableStepControls(2);
            else disableStepControls(2);
        } else {
            disableQuestionsFrom(6);
            disableStepControls(2);
        }
    } else {
        disableQuestionsFrom(5);
        disableStepControls(2);
    }

    return isQuestionCompleted(4) && isQuestionCompleted(5) && isQuestionCompleted(6);
}

function checkStepThree() {
    if (isQuestionCompleted(7)) enableStepControls(3);
    else disableStepControls(3);
        
    return isQuestionCompleted(7);
}

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
function storeForm(data, callback) {
    let database = firebase.database();
    let ref = database.ref("/submits").push();
    ref.set(data)
        .then(() => callback(true))
        .catch(() => callback(false));
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
    // Next button handler
    let nextButtons = $("button.step-control.next");
    nextButtons.on("click", event => {
        let button = $(event.target);
        let nextStep = button.attr("data-next");

        if (nextStep === "2" && checkStepOne()) {
            showStep(nextStep);
            enableQuestion(4);
        } else if (nextStep === "3" && checkStepTwo()) {
            showStep(nextStep);
            enableQuestion(7);
        }
    });

    // Next button handler
    let prevButtons = $("button.step-control.prev");
    prevButtons.on("click", event => {
        let button = $(event.target);
        let prevStep = button.attr("data-prev");

        if (prevStep === "2") showStep(prevStep);
        else if (prevStep === "1") showStep(prevStep);
    });

    // Submit form handler
    let submitButton = $("button.step-control.submit");
    submitButton.on("click", e => {
        e.preventDefault();
        let data = getFormData();
        storeForm(data, success => {
            if (success) showStep("success");
            else showStep("error");
        });
    });

    // Contact location form handler
    let contactLocationButton = $("button#contact-location-submit");
    contactLocationButton.on("click", e => {
        e.preventDefault();
        
        let email = $('input#contact-location').val();
        getAnswerTo(1, location => {
            storeEmail({ location, email }, success => {
                if (success) showStep("success");
                else showStep("error");
            });
        }, 0);
    });

    // Contact location form handler
    let contactSectorButton = $("button#contact-sector-submit");
    contactSectorButton.on("click", e => {
        e.preventDefault();
        
        let email = $('input#contact-sector').val();
        getAnswerTo(2, sector => {
            storeEmail({ sector, email }, success => {
                if (success) showStep("success");
                else showStep("error");
            });
        }, 0);
    });
}

(function($) {
    initGoogle();

    setButtonsHandlers();

    // Set step 1 validators by question number
    optionsValidator(1);
    optionsValidator(2);
    selectionValidator(3);
    numberValidator(4);
    numberValidator(5);
    numberValidator(6);
    emailValidator(7);

    // Watch for step 1
    let options = $(".step[data-step=\"1\"] input, .step[data-step=\"1\"] .option-input");
    options.on("input", () => checkStepOne());

    // Watch for step 2
    let inputs = $(".step[data-step=\"2\"] input");
    inputs.on("input", () => checkStepTwo());

    // Watch for step 2
    let lasts = $(".step[data-step=\"3\"] input");
    lasts.on("input", () => checkStepThree());

})(jQuery);