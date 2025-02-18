import Complex from "Lib/Complex";

const TokenTypes = Object.freeze({
  OPERATION: 0,
  PARAMETR: 1,
  NUMBER: 2,
  OPEN_PAR: 3,
  CLOSE_PAR: 4,
  INVALID: 5
});

function isSingleCharToken(str, start_pos) {
  switch (str[start_pos]) {
    case "+":
    case "-":
    case "*":
    case "/":
    case "^":
      return {
        token: { type: TokenTypes.OPERATION, val: str[start_pos] },
        next: start_pos + 1
      };
    case "(":
      return {
        token: { type: TokenTypes.OPEN_PAR, val: str[start_pos] },
        next: start_pos + 1
      };
    case ")":
      return {
        token: { type: TokenTypes.CLOSE_PAR, val: str[start_pos] },
        next: start_pos + 1
      };
    default:
      return {
        token: { type: TokenTypes.INVALID, val: null },
        next: start_pos
      };
  }
}

function tryInt(str, start_pos) {
  const allDigits = "0123456789";
  let num = 0;
  for (
    var i = start_pos;
    i < str.length && allDigits.indexOf(str[i]) != -1;
    i++
  ) {
    num *= 10;
    num += parseInt(str[i], 10);
  }

  return {
    num: i != start_pos ? num : NaN,
    next: i
  };
}

function isNumber(str, start_pos) {
  const int_part = tryInt(str, start_pos);
  start_pos = int_part.next;

  if (!isNaN(int_part.num)) {
    let real = int_part.num,
      num;
    if (str[start_pos] == ".") {
      start_pos++;
      const float_part = tryInt(str, start_pos);
      if (!isNaN(float_part.num)) {
        real = parseFloat(int_part.num + "." + float_part.num);
      } else {
        real = int_part.num;
      }
      start_pos = float_part.next;
    }

    if (str[start_pos] == "i") {
      start_pos++;
      num = new Complex(0, real);
    } else {
      num = new Complex(real, 0);
    }

    return {
      token: { type: TokenTypes.NUMBER, val: num },
      next: start_pos
    };
  } else {
    return {
      token: { type: TokenTypes.INVALID, val: null },
      next: start_pos
    };
  }
}

function isParametr(str, start_pos) {
  function isalpha(c) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
  }
  function isdigit(c) {
    return c >= "0" && c <= "9";
  }
  function isalnum(c) {
    return isalpha(c) || isdigit(c);
  }

  let parametr = "";

  for (var i = start_pos; i < str.length && isalnum(str[i]); i++) {
    parametr += str[i];
  }

  if (parametr.length) {
    return {
      token: { type: TokenTypes.PARAMETR, val: parametr },
      next: i
    };
  } else {
    return {
      token: { type: TokenTypes.INVALID, val: null },
      next: start_pos
    };
  }
}

export class Formula {
  constructor(node, text) {
    this.root = node;
    this.text = text;
    this.params = new Set();

    let params = this.getParams(this.root);
    for (let param of params) {
      this.params[param] = new Complex(0, 0);
    }
  }

  setConstants(constParams) {
    for (let param of constParams) {
      this.params[param] = constParams[this.params];
    }
  }

  setVariable(param, val) {
    this.params[param] = val;
  }

  getParams() {
    return this.params;
  }

  getParam(paramName) {
    return this.params[paramName];
  }

  calc(node) {
    try {
      if (!node) node = this.root;
      if (node.token.type == TokenTypes.OPERATION) {
        let operandA = this.calc(node.left);
        let operandB = this.calc(node.right);
        if (!(operandA instanceof Complex)) {
          operandA = new Complex(operandA.re, operandA.im);
        }
        if (!(operandB instanceof Complex)) {
          operandB = new Complex(operandB.re, operandB.im);
        }
        //console.log(operandA);
        //console.log(operandB);
        switch (node.token.val) {
          case "+":
            return operandA.add(operandB);
          case "-":
            return operandA.sub(operandB);
          case "/":
            return operandA.divide(operandB);
          case "*":
            return operandA.mult(operandB);
          case "^":
            return operandA.pow(operandB);
        }
      } else if (node.token.type == TokenTypes.NUMBER) {
        return node.token.val;
      } else if (node.token.type == TokenTypes.PARAMETR) {
        return this.params[node.token.val];
      }
    } catch (err) {
      return new Complex();
    }
  }

  _getParams(node) {
    let params = [];
    if (node.token.type == TokenTypes.OPERATION) {
      params = params.concat(this._getParams(node.left));
      params = params.concat(this._getParams(node.right));
      return params;
    } else if (node.token.type == TokenTypes.PARAMETR) {
      if (node.token.val != "x") params.push(node.token.val);
    }
    return params;
  }

  getParamNames() {
    let params = this._getParams(this.root);
    let ans = [];
    params = params.filter(x => {
      if (ans.indexOf(x) == -1) {
        ans.push(x);
        return true;
      } else return false;
    });
    console.log(ans);
    return params;
  }
}

export class Parser {
  tokenize(str) {
    str = str.split(" ").join("");
    let i = 0,
      tokens = [];
    const reducers = [isSingleCharToken, isNumber, isParametr];
    while (i < str.length) {
      let isReduced = false;
      //console.log(str.substring(i));
      for (let reducer of reducers) {
        const token = reducer(str, i);
        //console.log(token);
        if (token.token.type != TokenTypes.INVALID) {
          isReduced = true;
          i = token.next;
          tokens.push(token.token);
          break;
        }
      }

      if (!isReduced) {
        throw new Error("Unknown type of token");
      }
    }

    return tokens;
  }

  tryBinaryOperator(operators, tokens) {
    let level = 0;
    for (let i = tokens.length - 1; i >= 0; i--) {
      if (
        level == 0 &&
        tokens[i].type == TokenTypes.OPERATION &&
        operators.indexOf(tokens[i].val) != -1
      ) {
        return {
          token: tokens[i],
          left: this.buildTree(tokens.slice(0, i)),
          right: this.buildTree(tokens.slice(i + 1))
        };
      } else if (tokens[i].type == TokenTypes.OPEN_PAR) {
        level++;
      } else if (tokens[i].type == TokenTypes.CLOSE_PAR) {
        level--;
      }
    }
    return null;
  }

  ruleSum(tokens) {
    return this.tryBinaryOperator("+-", tokens);
  }

  ruleMul(tokens) {
    return this.tryBinaryOperator("*/", tokens);
  }

  rulePow(tokens) {
    return this.tryBinaryOperator("^", tokens);
  }

  rulePar(tokens) {
    if (tokens[0].type == TokenTypes.OPEN_PAR) {
      return this.buildTree(tokens.slice(1, tokens.length - 1));
    } else return null;
  }

  atom(tokens) {
    if (
      (tokens.length == 1 && tokens[0].type == TokenTypes.PARAMETR) ||
      tokens[0].type == TokenTypes.NUMBER
    ) {
      return {
        token: tokens[0]
      };
    } else {
      return null;
    }
  }

  buildTree(tokens) {
    const rules = [
      this.ruleSum.bind(this),
      this.ruleMul.bind(this),
      this.rulePow.bind(this),
      this.rulePar.bind(this),
      this.atom.bind(this)
    ];

    for (let rule of rules) {
      const node = rule(tokens);
      if (node != null) {
        return node;
      }
    }

    throw new Error("Unknown rule");
  }

  eval(stringExpression) {
    try {
      let tokens = this.tokenize(stringExpression);
      let root = this.buildTree(tokens);
      return new Formula(root, stringExpression);
    } catch (err) {
      console.log(err);
    }
  }

  setParam(param, val) {
    this.params[param] = val;
  }
}
