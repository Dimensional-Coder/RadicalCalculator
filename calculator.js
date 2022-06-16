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
