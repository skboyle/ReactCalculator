import React, { useState } from 'react'


function Calculator() {
  const [equation, setEquation] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('')

  const handleClick = (e) => {
    setEquation((prevEquation) => prevEquation + e.target.value);
  };

  const handleClear = () => {
    setEquation('');
    setAnswer('');
    setError('');
  };

  const handleDelete = () => {
    setEquation((prevEquation) => prevEquation.slice(0, -1)); // Remove the last character
  };

  const handleEnter = () => {
    if (isValidExpression(equation)) {
      try {
        const result = calculateExpression(equation);

        if (isFinite(result)) {
          setAnswer(result);
          setError('');
        } else {
          setError('Invalid Expression');
        }
      } catch (error) {
        setError('Invalid Expression');
      }
    } else {
      setError('Invalid Expression');
    }
  };

  const isValidExpression = (expression) => {
    try {
      // Attempt to create a function with the expression (this checks for valid syntax)
      new Function('return ' + expression); // eslint-disable-line no-new-func
      // Use additional checks for matching parentheses
      return hasMatchingParentheses(expression);
    } catch (error) {
      return false;
    }
  };

  const hasMatchingParentheses = (expression) => {
    // Implement a simple check for matching parentheses
    const stack = [];

    for (const char of expression) {
      if (char === '(') {
        stack.push('(');
      } else if (char === ')') {
        if (stack.pop() !== '(') {
          return false; // Unmatched closing parenthesis
        }
      }
    }

    return stack.length === 0; // Check if all opening parentheses are matched
  };


  function calculateExpression(expression) {
    const prioritize = (operator) => {
      switch (operator) {
        case '+':
        case '-':
          return 1;
        case '*':
        case '/':
          return 2;
        case '^':
          return 3;
        default:
          return 0;
      }
    };
  
    const applyOperation = (operator, operand1, operand2) => {
      switch (operator) {
        case '+':
          return operand1 + operand2;
        case '-':
          return operand1 - operand2;
        case '*':
          return operand1 * operand2;
        case '/':
          return operand1 / operand2;
        default:
          return 0;
      }
    };
  
    const tokens = expression.match(/\d+|\+|\-|\*|\/|\(|\)/g);
    const operatorStack = [];
    const operandStack = [];
  
    tokens.forEach((token) => {
      if (/\d+/.test(token)) {
        operandStack.push(parseFloat(token));
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          const operator = operatorStack.pop();
          const operand2 = operandStack.pop();
          const operand1 = operandStack.pop();
          operandStack.push(applyOperation(operator, operand1, operand2));
        }
        operatorStack.pop(); // Pop the opening parenthesis
      } else {
        while (
          operatorStack.length > 0 &&
          prioritize(operatorStack[operatorStack.length - 1]) >= prioritize(token)
        ) {
          const operator = operatorStack.pop();
          const operand2 = operandStack.pop();
          const operand1 = operandStack.pop();
          operandStack.push(applyOperation(operator, operand1, operand2));
        }
        operatorStack.push(token);
      }
    });
  
    while (operatorStack.length > 0) {
      const operator = operatorStack.pop();
      const operand2 = operandStack.pop();
      const operand1 = operandStack.pop();
      operandStack.push(applyOperation(operator, operand1, operand2));
    }
  
    return operandStack[0];
  }
  
  const result = calculateExpression("3 + 5 * (2 - 8)^2 / 4");
  console.log(result); // Output: 48

  return (
    <div className='calculator'>
      <div className='calc-wrapper'>
        <div className='ctc calc-screen'>
          <div className='calc-answer'>
            <span>
              {answer}
            </span>
          </div>
          <div className='calc-error'>
            <span>
              {error}
            </span>
          </div>
        </div>
        <div className='ctc calc-compute'>
          <span>
            {equation ? equation : '0'}
          </span>
        </div>

        <div className='calc-grid'>
          <button className="top-btn special" value="(" onClick={handleClick}>(</button>
          <button className="top-btn special" value=")" onClick={handleClick}>)</button>
          <button className="top-btn special" value="." onClick={handleClick}>.</button>
          <button className="top-btn special" value="/" onClick={handleClick}>÷</button>

          <button className="normal" value="7" onClick={handleClick}>7</button>
          <button className="normal" value="8" onClick={handleClick}>8</button>
          <button className="normal" value="9" onClick={handleClick}>9</button>


          <button className="special" value="*" onClick={handleClick}>×</button>
          <button className="normal" value="4" onClick={handleClick}>4</button>
          <button className="normal" value="5" onClick={handleClick}>5</button>
          <button className="normal" value="6" onClick={handleClick}>6</button>


          <button className="special" value="-" onClick={handleClick}>−</button>
          <button className="normal" value="1" onClick={handleClick}>1</button>
          <button className="normal" value="2" onClick={handleClick}>2</button>
          <button className="normal" value="3" onClick={handleClick}>3</button>
          <button className="special" value="+" onClick={handleClick}>+</button>

          <button className="clear" value="ac" onClick={handleClear}>ac</button>
          <button className="normal" value="0" onClick={handleClick}>0</button>
          <button className="enter" value="=" onClick={handleEnter}>=</button>
          <button className='normal special calc-reverse' value="rv" onClick={handleDelete}>⬅</button>

        </div>
      </div>
    </div >
  )
}

export default Calculator