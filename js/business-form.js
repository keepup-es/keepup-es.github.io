function onChangeStep(callback) {
    let prevs = $('.step-control.prev');
    prevs.on('click', event => {
        let following = $(event.target).attr("data-prev");
        callback(following);
    });
    
    let nexts = $('.step-control.next');
    nexts.on('click', () => {
        let disabled = $(event.target).hasClass("disabled");
        if (!disabled) {
            let following = $(event.target).attr("data-next");
            callback(following);
        }
    });
}

function onOptionSelected(question, callback) {
    let path = `[data-question="${question}"] .hidden-input`;
    let siblings = document.querySelectorAll(path);
    let filled = Array.of(...siblings).some(input => input.checked);
    
    $(path).on("change", event => {
        let value = $(event.target).val();

        if (value === "other") {
            onInputUser(question, completed => callback(completed));
        } else {
            restoreUserInput(question);
            if (value !== "") callback(true);
            else callback(false);
        }
    });

    callback(filled);
}

function onFieldFilled(question, callback) {
    let path = `[data-question="${question}"] input`
    let siblings = document.querySelectorAll(path);
    let filled = Array.of(...siblings).some(input => input.value && input.value !== "");

    $(path).on("input", () => {
        filled = Array.of(...siblings).some(input => input.value && input.value !== "");
        callback(filled);
    });
    callback(filled);
}

function setQuestionEnabled(question, enabled) {
    let questionElement = $(`[data-question="${question}"]`);
    if (enabled) questionElement.removeClass("disabled");
    else questionElement.addClass("disabled");
}

function onInputUser(question, callback) {
    let input = $(`[data-question="${question}"] .option-input`);
    input.empty();
    input.attr("contenteditable", "true");
    input.on("input", () => {
        if (input.text() !== "") callback(true);
        else callback(false);
    });
    callback(false);
}

function restoreUserInput(question) {
    let input = $(`[data-question="${question}"] .option-input`);
    input.attr("contenteditable", "false");
    input.text("Otro");
}

function allowsToContinue(step, enabled) {
    let controls = $(`.step[data-step="${step}"] .step-control.next`);
    if (enabled) controls.removeClass("disabled");
    else controls.addClass("disabled");
}

function updateProgress(next) {
    let steps = {
        1: "7%",
        2: "50%",
        3: "100%"
    }

    $(".form-progress .steps-indicator .progress-bar").css("width", steps[next]);
}

function showNextStep(next) {
    let current = $(".step").not(".hidden");
    let following = $(`.step[data-step="${next}"]`);

    current.fadeOut("", () => {
        following.fadeIn(1000, () => {
            current.addClass("hidden");
            following.removeClass("hidden")
        });
    });
}

(function($) {
    onChangeStep(following => {
        if (0 < following && following <= 3) {
            updateProgress(following);
            showNextStep(following);
        } else console.log(following);
    });

    onOptionSelected(1, first => {
        setQuestionEnabled(2, first);

        onOptionSelected(2, second => {
            setQuestionEnabled(3, second);

            onOptionSelected(3, third => allowsToContinue(1, third));
            if (!second) allowsToContinue(1, false);
        });

        if (!first) {
            setQuestionEnabled(3, false);
            allowsToContinue(1, false);
        }
    });

    onFieldFilled(4, fourth => {
        setQuestionEnabled(5, fourth);

        onFieldFilled(5, fiveth => {
            setQuestionEnabled(6, fiveth);
    
            onFieldFilled(6, sixth => {
                allowsToContinue(2, sixth)
                console.log(sixth)
            });
            if (!fiveth) allowsToContinue(2, false);
        });

        if (!fourth) {
            setQuestionEnabled(6, false);
            allowsToContinue(2, false);
        }
    });

})(jQuery);