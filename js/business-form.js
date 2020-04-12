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
    $(`.step[data-step="${step}"] .step-control.next`).removeClass("disabled");
}

function disableStepControls(step) {
    $(`.step[data-step="${step}"] .step-control.next`).addClass("disabled");
}

/**
 * Step enablers & disablers 
 */

function showNextStep(next) {
    let current = $(".step").not(".hidden");
    let following = $(`.step[data-step="${next}"]`);

    current.fadeOut("", () => {
        following.fadeIn(1000, () => {
            current.addClass("hidden");
            following.removeClass("hidden")
        });
    });

    setProgressBar(next);
}

function setProgressBar(next) {
    let steps = {
        1: "7%",
        2: "50%",
        3: "100%"
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

(function($) {
    // Next button handler
    let nextButtons = $("button.step-control.next");
    nextButtons.on("click", event => {
        let button = $(event.target);
        let nextStep = button.attr("data-next");

        if (nextStep === "2" && checkStepOne()) {
            showNextStep(nextStep);
            enableQuestion(4);
        } else if (nextStep === "3" && checkStepTwo()) {
            showNextStep(nextStep);
            enableQuestion(7);
        }
    })


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