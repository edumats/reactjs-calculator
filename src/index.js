import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const mathOperators = ['+', '-', '*', '/']

function hasTwoOperators(string) {
  const reversedString = string.split('').reverse().slice(0, 2)
  return reversedString.every(value => {
    if (!isNaN(value)) {
      return false
    }
    return true
  })
}

// Checks if the last number in a Math operation already has a decimal mark
function numberHasDot(string) {
  const reversedString = string.split('').reverse().join()
  let lastOperand = ''
  for (const char of reversedString) {
    if (mathOperators.includes(char)) {
      break
    } else {
      lastOperand += char
    }
  }
  if (lastOperand.includes('.')) {
    return true
  } 
  return false
}

function Display(props) {
  return <div id="display">{props.display}</div>
}

function Button(props) {
  return <button id={props.id} onClick={props.function} value={props.value}>{props.value === '*' ? 'x' : props.value}</button>
}

function DotButton(props) {
  return <button id="decimal" value="." onClick={props.insertDecimal}>.</button>
}

function App() {
  const [display, setDisplay] = React.useState('0')
  const [previousResult, setPreviousResult] = React.useState(null)
  
  // When decimal button is pressed
  const insertDecimal = e => {
    const decimal = e.target.value
    // Do not allow repeated dots
    if (display.slice(-1) === '.') {
      return
    }
    
    if (numberHasDot(display)) {
      return
    }
    // If not a number before decimal, add a zero
    if (isNaN(display.slice(-1))) {
      setDisplay(display => display + '0' + decimal)
      return
    }
    setDisplay(lastDisplay => lastDisplay + decimal)
  }
  
  // When a number is pressed
  const insertToDisplay = e => {
    const insertedChar = e.target.innerHTML

    // In case of inserting the first character
    if (display === '0') {
      switch(insertedChar) {
        // Not allows more than one zero at the beginning
        case '0':
          break
        // Erases the default zero and inserts digit
        default:
          setDisplay(insertedChar)
      }
      return
    }
    setDisplay(display + insertedChar)
  }
  
  // When an operator button is pressed
  const setOperation = e => {
    const operator = e.target.value
    const ops = ['+', '*', '/']
    // Not allows consecutive repeating of elements contained in ops variable
    if (ops.includes(display.slice(-1)) && ops.includes(operator) && display.slice(-1) === operator) {
      return
    }
    // If display already have --, a third - will not be included
    if (display.slice(-2) === '--' && operator === '-') {
      return
    }
    // If 2 or more operators are entered consecutively, the operation performed should be the last operator entered
    if (hasTwoOperators(display) && mathOperators.includes(operator)) {
      setDisplay(display => display.slice(0, -2) + operator)
      return
    }
    setDisplay(display => display + operator)
  }
  
  // When Clear button is pressed, clear formula and display fields
  const clearDisplay = () => {
    setDisplay('0')
    setPreviousResult(null)
  }
  
  // When Equal button is pressed, calculate result of formula
  const calculateResult = () => {
    const result = parse(display)
    setDisplay(result)
    setPreviousResult(result)
  }
  
  // Takes a string and returns as a Javascript operation result
  const parse = str => {
    return Function(`'use strict'; return (${str})`)().toString()
  }
  
  return (
    <div id="calculator">
      <Display display={display} />
      <button id="clear" onClick={clearDisplay}>Clear</button>
      <Button id="divide" value="/" function={setOperation} />
      <Button id="multiply" value="*" function={setOperation} />
      <Button id="subtract" value="-" function={setOperation} />
      <Button id="add" value="+" function={setOperation} />
      <button id="equals" value="=" onClick={calculateResult}>=</button>
      <DotButton insertDecimal={insertDecimal}/>
      <Button id="zero" value="0" function={insertToDisplay} />
      <Button id="one" value="1" function={insertToDisplay} />
      <Button id="two" value="2" function={insertToDisplay} />
      <Button id="three" value="3" function={insertToDisplay} />
      <Button id="four" value="4" function={insertToDisplay} />
      <Button id="five" value="5" function={insertToDisplay} />
      <Button id="six" value="6" function={insertToDisplay} />
      <Button id="seven" value="7" function={insertToDisplay} />
      <Button id="eight" value="8" function={insertToDisplay} />
      <Button id="nine" value="9" function={insertToDisplay} />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);