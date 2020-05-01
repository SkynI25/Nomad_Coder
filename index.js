const cBtn = document.querySelector("#C");
const sevenBtn = document.querySelector("#seven");
const eightBtn = document.querySelector("#eight");
const nineBtn = document.querySelector("#nine");
const fourBtn = document.querySelector("#four");
const fiveBtn = document.querySelector("#five");
const sixBtn = document.querySelector("#six");
const oneBtn = document.querySelector("#one");
const twoBtn = document.querySelector("#two");
const threeBtn = document.querySelector("#three");
const zeroBtn = document.querySelector("#zero");

const calcBtn = document.querySelector("#calc");
const plusBtn = document.querySelector("#plus");
const subBtn = document.querySelector("#sub");
const multiBtn = document.querySelector("#multi");
const divideBtn = document.querySelector("#divide");
const resultText = document.querySelector(".calc-text");

let calcString = "0";

function numberPadHandler(evt) {
  let prevText = calcString === "0" ? "" : resultText.textContent;
  if (/[\+\/\-\*]/.test(calcString[calcString.length - 1])) {
    prevText = "";
  }
  prevText += evt.target.textContent;
  calcString += evt.target.textContent;
  resultText.textContent = Number(prevText);
}

function cBtnHandler() {
  resultText.textContent = 0;
  calcString = "0";
}

function carryCheck(arr) {
  return arr[arr.length - 1] === arr[arr.length - 2];
}

function calc4Carry(op, operArray, numberArray) {
  let carryResult = 0;
  for (let i = 0; i < operArray.length; i++) {
    if (operArray[i] === op && i !== operArray.length - 1) {
      carryResult = operator4Calc(numberArray[i], op, numberArray[i + 1]);
      operArray.splice(i, 1);
      numberArray.splice(i, 2, carryResult);
    }
  }
  resultText.textContent = carryResult;
  calcString = "";
  numberArray.forEach((num, i) => {
    calcString += num;
    calcString += operArray[i];
  });
}

function operHandler(evt) {
  if (!/[\+\/\-\*]/.test(calcString[calcString.length - 1])) {
    calcString += evt.target.textContent;
    let operArray = [];
    let numberArray = [];
    numberArray = calcString
      .split(/[\+\/\-\*]/)
      .map(el => parseInt(el))
      .filter(el => el);
    calcString.split("").forEach(op => {
      if (isNaN(Number(op))) {
        operArray.push(op);
      }
    });
    if (numberArray.length >= 2 && carryCheck(operArray)) {
      calc4Carry(evt.target.textContent, operArray, numberArray);
    }
  }
}

function calcHandler(evt) {
  if (evt && evt.target.textContent === "=") {
    const isNumber = Number(calcString[calcString.length - 1]);
    if (isNaN(isNumber)) {
      calcString += resultText.textContent;
    }
  } else {
    calcString = calcString.substring(0, calcString.length - 1);
  }
  const totalResult = parsing4Calc();
  resultText.textContent = totalResult;
  calcString = "0";
}

function operator4Calc(prevNum, oper, currNum) {
  if (oper === "-") {
    return prevNum - currNum;
  } else if (oper === "*") {
    return prevNum * currNum;
  } else if (oper === "/") {
    return prevNum / currNum;
  }
  return prevNum + currNum;
}

function parsing4Calc() {
  let operArray = [];
  let numberArray = [];
  numberArray = calcString.split(/[\+\/\-\*]/).map(el => parseInt(el));
  calcString.split("").forEach(op => {
    if (isNaN(Number(op))) {
      operArray.push(op);
    }
  });
  operArray.forEach((op, i) => {
    let result = 0;
    if (op === "*" || op === "/") {
      result = operator4Calc(numberArray[i], op, numberArray[i + 1]);
      operArray.splice(i, 1);
      numberArray.splice(i, 2, result);
    }
  });
  let currNumber = operArray.length > 0 ? 0 : numberArray[0];
  for (let i = 0; i < operArray.length; i++) {
    if (currNumber === 0) {
      currNumber = operator4Calc(
        parseInt(numberArray[i]),
        operArray[i],
        parseInt(numberArray[i + 1])
      );
    } else {
      currNumber = operator4Calc(
        currNumber,
        operArray[i],
        parseInt(numberArray[i + 1])
      );
    }
  }
  return currNumber;
}

function init() {
  sevenBtn.addEventListener("click", numberPadHandler);
  eightBtn.addEventListener("click", numberPadHandler);
  nineBtn.addEventListener("click", numberPadHandler);
  fourBtn.addEventListener("click", numberPadHandler);
  fiveBtn.addEventListener("click", numberPadHandler);
  sixBtn.addEventListener("click", numberPadHandler);
  oneBtn.addEventListener("click", numberPadHandler);
  twoBtn.addEventListener("click", numberPadHandler);
  threeBtn.addEventListener("click", numberPadHandler);
  zeroBtn.addEventListener("click", numberPadHandler);
  cBtn.addEventListener("click", cBtnHandler);
  plusBtn.addEventListener("click", operHandler);
  subBtn.addEventListener("click", operHandler);
  multiBtn.addEventListener("click", operHandler);
  divideBtn.addEventListener("click", operHandler);
  calcBtn.addEventListener("click", calcHandler);
}
console.log("Ready to work!");
init();
