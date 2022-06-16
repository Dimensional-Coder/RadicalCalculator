
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

//To throw when the user makes an oopsie
class ExpressionParsingError extends Error{

}

/**
 * Given an open parenthesis, find the index of the matching close paren
 * @param {*} expressionString The full expression string
 * @param {*} openParenIndex The index of the open paren
 * @param {*} endIndex The endIndex of the current expression being parsed
 * 
 * @return The index of the close parenthesis, or -1 if not found
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
    return -1;
}

function trimTrailingWhitespace(expressionString, startIndex, endIndex){
    while(endIndex > startIndex && expressionString.charAt(endIndex - 1) == ' ')
        endIndex--;
    return endIndex;
}

function trimLeadingWhitespace(expressionString, startIndex, endIndex){
    while(startIndex < endIndex && expressionString.charAt(startIndex) == ' ')
        startIndex++;
    return startIndex;
}

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

/**
 * Parse a string into expressions that can be evaluated
 * @param {*} expressionString 
 * @return An array of expressions that can be evaluated for a value.
 */
function parseExpressionRecursive(expressionString, startIndex, endIndex){
    endIndex = trimTrailingWhitespace(expressionString, startIndex, endIndex);
    startIndex = trimLeadingWhitespace(expressionString, startIndex, endIndex);

    if(expressionString.charAt(startIndex) == '(' && expressionString.charAt(endIndex-1) == ')'){
        //No need for parentheses if the whole expression is inside them
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
    for(let i=startIndex; i<endIndex; i++){
        let curChar = expressionString.charAt(i);
        if(curChar == '+' || curChar == '-'){
            let term1 = parseExpressionRecursive(expressionString, startIndex, i);
            let term2 = parseExpressionRecursive(expressionString, i+1, endIndex);
            
            if(curChar == '+')
                return new AddExpression(term1, term2);
            else
                return new SubtractExpression(term1, term2);
        }

        //Skip over parentheses, they will be processed as a separate expression
        if(curChar == '('){
            i = findCloseParenthesis(expressionString, i, endIndex);
        }
    }

    //No more addition terms, do second pass for multiplication/division
    for(let i=startIndex; i<endIndex; i++){
        let curChar = expressionString.charAt(i);
        if(curChar == '*' || curChar == '/'){
            let term1 = parseExpressionRecursive(expressionString, startIndex, i);
            let term2 = parseExpressionRecursive(expressionString, i+1, endIndex);
            
            if(curChar == '*')
                return new MultiplyExpression(term1, term2);
            else
                return new DivideExpression(term1, term2);
        }

        //Skip over parentheses, they will be processed as a separate expression
        if(curChar == '('){
            i = findCloseParenthesis(expressionString, i, endIndex);
        }
    }

    //No operators found, this must be a numeric term or invalid
    let numericTerm = parseNumericValue(expressionString, startIndex, endIndex);
    return new NumberExpression(numericTerm);
}

function parseExpression(expressionString){
    return parseExpressionRecursive(expressionString, 0, expressionString.length);
}
