/**
 * This script contains logic and classes for parsing
 * and evaluating expressions for the calculator.
 */

/**
 * An expression, to represent a mathematical operation on two terms.
 * Both terms are expression objects that are recursively evaluated
 * to produce a value.
 */
class Expression{
    constructor(term1=null, term2=null){
        this.term1 = term1;
        this.term2 = term2;
    }

    evaluate(){
        throw new Error('Unimplemented');
    }

    toString(){
        throw new Error('Unimplemented');
    }
}

class NumberExpression extends Expression{
    evaluate(){
        return this.term1;
    }

    toString(){
        return this.term1.toString();
    }
}

class AddExpression extends Expression{
    evaluate(){
        return this.term1.evaluate() + this.term2.evaluate();
    }

    toString(){
        return `(${this.term1.toString()}) + (${this.term2.toString()})`
    }
}

class SubtractExpression extends Expression{
    evaluate(){
        return this.term1.evaluate() - this.term2.evaluate();
    }

    toString(){
        return `(${this.term1.toString()}) - (${this.term2.toString()})`
    }
}

class MultiplyExpression extends Expression{
    evaluate(){
        return this.term1.evaluate() * this.term2.evaluate();
    }

    toString(){
        return `(${this.term1.toString()}) * (${this.term2.toString()})`
    }
}

class DivideExpression extends Expression{
    evaluate(){
        return this.term1.evaluate() / this.term2.evaluate();
    }

    toString(){
        return `(${this.term1.toString()}) / (${this.term2.toString()})`
    }
}

class PowerExpression extends Expression{
    evaluate(){
        return this.term1.evaluate() ** this.term2.evaluate();
    }

    toString(){
        return `(${this.term1.toString()}) ^ (${this.term2.toString()})`
    }
}

//To throw when the user makes an oopsie
class ExpressionParsingError extends Error{

}

function isOperator(character){
    return "/*-+^".indexOf(character) != -1;
}

/**
 * Given an open parenthesis, find the index of the matching close paren
 * @param {*} expressionString The full expression string
 * @param {*} openParenIndex The index of the open paren
 * @param {*} endIndex The endIndex of the current expression being parsed
 * 
 * @return The index of the close parenthesis, or ExpressionParsingError
 */
function findCloseParenthesis(expressionString, openParenIndex, endIndex){
    let nestedDepth = 0;

    for(let i=openParenIndex; i<endIndex; i++){
        if(expressionString.charAt(i) == '('){
            nestedDepth += 1;
        }
        else if(expressionString.charAt(i) == ')'){
            nestedDepth -= 1;

            //If at depth zero, this must be the matching parenthesis
            if(nestedDepth == 0){
                return i;
            }
        }
    }

    //Not found
    throw new ExpressionParsingError(`Failed to find close parenthesis with [${openParenIndex}, ${endIndex}]`)
}

/**
 * Given a close parenthesis, find the index of the matching open paren
 * @param {*} expressionString The full expression string
 * @param {*} closeParenIndex The index of the close paren
 * @param {*} startIndex The startIndex of the current expression being parsed
 * 
 * @return The index of the open parenthesis, or ExpressionParsingError
 */
 function findOpenParenthesis(expressionString, startIndex, closeParenIndex){
    let nestedDepth = 0;

    for(let i=closeParenIndex; i>=startIndex; i--){
        if(expressionString.charAt(i) == ')'){
            nestedDepth += 1;
        }
        else if(expressionString.charAt(i) == '('){
            nestedDepth -= 1;

            //If at depth zero, this must be the matching parenthesis
            if(nestedDepth == 0){
                return i;
            }
        }
    }

    //Not found
    throw new ExpressionParsingError(`Failed to find open parenthesis with [${startIndex}, ${closeParenIndex}]`)
}

/**
 * Check if there is a term adjacent and before a set of parentheses.
 * Useful for checking if a term should be multiplied.
 * 
 * @returns True if there is a term adjacent and before the parentheses
 */
function hasTermBeforeParentheses(expressionString, startIndex, openParenIndex){
    for(let i=openParenIndex-1; i>=startIndex; i--){
        let curChar = expressionString.charAt(i);

        //Ignore whitespace
        if(curChar == ' ')
            continue;
        
        if(curChar == ')' || isOperator(curChar))
            return true;

        //Nothing else we recognize, it can only be
        //a term if it's a number
        return !isNaN(curChar)
    }

    return false;
}

/**
 * Check if there is a term adjacent and after a set of parentheses.
 * Useful for checking if a term should be multiplied.
 * 
 * @returns True if there is a term adjacent and after the parentheses
 */
function hasTermAfterParentheses(expressionString, closeParenIndex, endIndex){
    for(let i=closeParenIndex+1; i<endIndex; i++){
        let curChar = expressionString.charAt(i);

        //Ignore whitespace
        if(curChar == ' ')
            continue;
        
        if(curChar == '(' || isOperator(curChar))
            return true;

        //Nothing else we recognize, it can only be
        //a term if it's a number
        return !isNaN(curChar)
    }

    return false;
}

/**
 * Skip characters to ignore white space in a term.
 * 
 * @returns The first non-whitespace index at the end of the string
 */
function trimTrailingWhitespace(expressionString, startIndex, endIndex){
    while(endIndex > startIndex && expressionString.charAt(endIndex - 1) == ' ')
        endIndex--;
    return endIndex;
}

/**
 * Skip characters to ignore white space in a term.
 * 
 * @returns The first non-whitespace index at the beginning of the string
 */
function trimLeadingWhitespace(expressionString, startIndex, endIndex){
    while(startIndex < endIndex && expressionString.charAt(startIndex) == ' ')
        startIndex++;
    return startIndex;
}

/**
 * Parse a numeric term into a value.
 */
function parseNumericValue(expressionString, startIndex, endIndex){
    endIndex = trimTrailingWhitespace(expressionString, startIndex, endIndex);
    startIndex = trimLeadingWhitespace(expressionString, startIndex, endIndex);
    
    if(startIndex >= endIndex)
        throw new ExpressionParsingError(`Failed to parse numeric value at [${startIndex}, ${endIndex}]`);
    
    numericString = expressionString.substring(startIndex, endIndex);

    //Catch any invalid characters, like a space in the middle
    if(isNaN(numericString)){
        throw new ExpressionParsingError(`Failed to parse numeric value '${numericString}' at [${startIndex}, ${endIndex}]`);
    }

    return parseInt(numericString);
}

function splitExpressionIntoTerms(expressionString, term1start, term1end, term2start, term2end, expressionClass){
    let term1 = parseExpressionRecursive(expressionString, term1start, term1end);
    let term2 = parseExpressionRecursive(expressionString, term2start, term2end);
    
    return new expressionClass(term1, term2);
}

function splitParenthesisExpression(expressionString, parenIndex, isCloseParen, startIndex, endIndex){
    let hasAdjacentOperator = false;
    let operator = null;
    let operatorClass = null;
    let term1 = null;
    let term2 = null;

    if(isCloseParen){
        if(isOperator(expressionString.charAt(parenIndex+1))){
            hasAdjacentOperator = true;
            operator = expressionString.charAt(parenIndex+1);
        }
    }else{
        if(isOperator(expressionString.charAt(parenIndex-1))){
            hasAdjacentOperator = true;
            operator = expressionString.charAt(parenIndex-1);
        }
    }

    if(hasAdjacentOperator){
        switch(operator){
            case '/':
                operatorClass = DivideExpression;
                break;
            case '*':
                operatorClass = MultiplyExpression;
                break;
            case '+':
                operatorClass = AddExpression;
                break;
            case '-':
                operatorClass = SubtractExpression;
                break;
            case '^':
                operatorClass = PowerExpression;
                break;
        }
    }else{
        operatorClass = MultiplyExpression;
    }

    //Now, split the terms
    if(isCloseParen){
        term1 = parseExpressionRecursive(expressionString, startIndex, parenIndex+1);

        if(hasAdjacentOperator){    
            term2 = parseExpressionRecursive(expressionString, parenIndex+2, endIndex);
        }else{
            term2 = parseExpressionRecursive(expressionString, parenIndex+1, endIndex);
        }
    }else{
        term2 = parseExpressionRecursive(expressionString, parenIndex, endIndex);

        if(hasAdjacentOperator){    
            term1 = parseExpressionRecursive(expressionString, startIndex, parenIndex-1);
        }else{
            term1 = parseExpressionRecursive(expressionString, startIndex, parenIndex);
        }
    }

    return new operatorClass(term1, term2);
}

/**
 * Recursive helper for parseExpression
 * 
 * @param {*} expressionString The expression input
 * @param {*} startIndex The start index for the current substring being processed
 * @param {*} endIndex The end index for the current substring being processed
 * @returns 
 */
function parseExpressionRecursive(expressionString, startIndex, endIndex){
    endIndex = trimTrailingWhitespace(expressionString, startIndex, endIndex);
    startIndex = trimLeadingWhitespace(expressionString, startIndex, endIndex);

    //Trim redundant parentheses if the whole expression is inside parens
    while(expressionString.charAt(startIndex) == '(' && findCloseParenthesis(expressionString, startIndex, endIndex) == endIndex-1){
        startIndex++;
        endIndex--;

        endIndex = trimTrailingWhitespace(expressionString, startIndex, endIndex);
        startIndex = trimLeadingWhitespace(expressionString, startIndex, endIndex);
    }

    if(startIndex >= endIndex)
        throw new ExpressionParsingError(`Did not find a valid expression at [${startIndex}, ${endIndex}]`);
    
    //Make multiple passes to split expression into smaller
    //expressions to be evaluated.
    
    //First pass: split on add/subtract operations.
    //These will be evaluated last.
    for(let i=endIndex-1; i>=startIndex; i--){
        let curChar = expressionString.charAt(i);
        if(curChar == '+' || curChar == '-'){
            if(curChar == '+')
                return splitExpressionIntoTerms(expressionString, startIndex, i, i+1, endIndex, AddExpression);
            else
                return splitExpressionIntoTerms(expressionString, startIndex, i, i+1, endIndex, SubtractExpression);
        }

        //Skip over parentheses, they will be processed as a separate expression
        if(curChar == ')'){
            i = findOpenParenthesis(expressionString, startIndex, i);
        }
    }

    //No more addition terms, do second pass for multiplication/division
    for(let i=endIndex-1; i>=startIndex; i--){
        let curChar = expressionString.charAt(i);
        if(curChar == '*' || curChar == '/'){
            if(curChar == '*')
                return splitExpressionIntoTerms(expressionString, startIndex, i, i+1, endIndex, MultiplyExpression);
            else
                return splitExpressionIntoTerms(expressionString, startIndex, i, i+1, endIndex, DivideExpression);
        }

        //Skip over parentheses, they will be processed as a separate expression
        if(curChar == ')'){
            let openParenIndex = findOpenParenthesis(expressionString, startIndex, i);

            //If there's another term right next to the parentheses,
            //treat it as a multiplication expression
            if(hasTermAfterParentheses(expressionString, i, endIndex)){
                return splitParenthesisExpression(expressionString, i, true, startIndex, endIndex);
            }else if(hasTermBeforeParentheses(expressionString, startIndex, openParenIndex)){
                return splitParenthesisExpression(expressionString, openParenIndex, false, startIndex, endIndex);
            }
        }
    }

    for(let i=endIndex-1; i>=startIndex; i--){
        let curChar = expressionString.charAt(i);
        if(curChar == '^')
            return splitExpressionIntoTerms(expressionString, startIndex, i, i+1, endIndex, PowerExpression);
        
        if(curChar == ')')
            i = findOpenParenthesis(expressionString, startIndex, i);
    }

    //No operators found, this must be a numeric term or invalid
    let numericTerm = parseNumericValue(expressionString, startIndex, endIndex);
    return new NumberExpression(numericTerm);
}

/**
 * Parse a string into expressions that can be evaluated
 * @param {*} expressionString 
 * @return An array of expressions that can be evaluated for a value.
 */
function parseExpression(expressionString){
    return parseExpressionRecursive(expressionString, 0, expressionString.length);
}
