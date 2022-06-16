/**
 * This script contains logic for wiring up the calculator
 * on the html page.
 */

/**
 * Given a click event on a calculator, find the closest
 * parent calculator container.
 * 
 * Implemented this way to allow for embedding calculators
 * at a later date.
 * 
 * @param {*} clickEvent The click event raised from a button click
 * @return The calculator container element
 */
function getCalculatorContainer(clickEvent){
    return clickEvent.target.closest('.calculator-container');
}

/**
 * Append string to the calculator input field
 */
function addToCalculatorInput(clickEvent, str){
    let calcContainer = getCalculatorContainer(clickEvent);
    let calcInput = calcContainer.getElementsByClassName('calculator-input-display')[0];

    calcInput.value = calcInput.value + str;
}

function getCalculatorInput(clickEvent){
    let calcContainer = getCalculatorContainer(clickEvent);
    let calcInput = calcContainer.getElementsByClassName('calculator-input-display')[0];

    return calcInput.value;
}

/**
 * Append string to the calculator input field
 */
 function setCalculatorOutput(clickEvent, str){
    let calcContainer = getCalculatorContainer(clickEvent);
    let calcOutput = calcContainer.getElementsByClassName('calculator-output-display')[0];

    calcOutput.value = str;
}

function onNumberClick(e){
    //Custom data-number attribute
    let number = e.target.dataset.number;
    addToCalculatorInput(e, number);
}

function onOperatorClick(e){
    //Custom data-number attribute
    let operator = e.target.dataset.operator;
    addToCalculatorInput(e, operator);
}

function onSubmitClick(e){
    let expressionString = getCalculatorInput(e);
    console.log(`Expression submitted: ${expressionString}`);

    let expressionResult = 'Invalid Expression';

    try{
        let expression = parseExpression(expressionString);
        console.log(`Expression parsed: ${expression.toString()}`);

        expressionResult = expression.evaluate();
        console.log(`Expression value: ${expressionResult}`);
    }catch(exc){
        console.error(`Failed to parse or evaluate expression: "${exc.message}"`);
    }

    setCalculatorOutput(e, expressionResult);
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