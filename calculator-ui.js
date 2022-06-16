/**
 * This script contains logic for wiring up the calculator
 * on the html page.
 */

/**
 * Append string to the calculator input field
 */
function addToCalculatorInput(str){
    calcContainer = document.getElementById('calculator-main');
    calcInput = calcContainer.getElementsByClassName('calculator-input-field')[0];

    calcInput.innerHTML = calcInput.innerHTML + str;
}

function onNumberClick(e){
    //Custom data-number attribute
    number = e.target.dataset.number;
    addToCalculatorInput(number);
}

function onOperatorClick(e){
    //Custom data-number attribute
    operator = e.target.dataset.operator;
    addToCalculatorInput(operator);
}

function onSubmitClick(e){
    //TODO
}

function initButtons(){
    calcContainer = document.getElementById('calculator-main');
    for(let numericButton of calcContainer.getElementsByClassName('button-number')){
        numericButton.addEventListener('click', onNumberClick);
    }

    for(let operatorButton of calcContainer.getElementsByClassName('button-operator')){
        operatorButton.addEventListener('click', onOperatorClick);
    }

    let submitButton = calcContainer.getElementsByClassName('button-submit')[0];
    submitButton.addEventListener('click', onSubmitClick);

    console.log("Calculator buttons initialized");
}

function init(){
    initButtons();

    console.log("Calculator initialized");
}

//With script defer, should be no need to wait until the page is ready
init();