function lexer(input) {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    let char = input[cursor];

    // skip whitespace
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let word = '';
      while (/[a-zA-Z0-9]/.test(char)) {
        word += char;
        char = input[++cursor];
      }
      if (word === 'ye' || word === 'bol') {
        tokens.push({ type: 'Keyword', value: word });
      } else {
        tokens.push({ type: 'identifier', value: word });
      }
      continue;
    }

    if (/[0-9]/.test(char)) {
      let num = '';
      while (/[0-9]/.test(char)) {
        num += char;
        char = input[++cursor];
      }
      tokens.push({ type: 'number', value: parseInt(num) });
      continue;
    }

    //tokenize operators and equals sign 
    if (/[\+\-\*\/=]/.test(char)) {
      tokens.push({ type: 'operator', value: char });
      cursor++;
      continue;
    }
  }
  return tokens;
}

function parser(tokens) {
  const ast = {
    type: 'Program',
    body: []
  };

  while (tokens.length > 0) {
    let token = tokens.shift();

    if (token.type === 'Keyword' && token.value === 'ye') {
      let declaration = {
        type: 'Declaration',
        name: tokens.shift().value,
        value: null
      };

      // check for assignment 
      if (tokens[0].type === 'operator' && tokens[0].value === '=') {
        tokens.shift(); // consume '='

        //parse the expression
        let expression = '';
        while (tokens.length > 0 && tokens[0].type !== 'Keyword') {
          expression += tokens.shift().value;
        }
        declaration.value = expression.trim();
      }
      ast.body.push(declaration);
    }

    if (token.type === 'Keyword' && token.value === 'bol') {
      ast.body.push({
        type: 'Print',
        expression: tokens.shift().value
      });
    }
  }
  return ast;
}

function codeGen(node){
  switch(node.type){
    case 'Program': return node.body.map(codeGen).join('\n');
    case 'Declaration': return `const ${node.name}= ${node.value}`
    case 'Print': return `console.log(${node.expression})`
  }
}

function compiler(input) {
  const tokens = lexer(input);
  const ast = parser([...tokens]);
   /*the spread operator [...tokens], create a shallow copy of the tokens array.
   This ensures that any modifications made to the array inside the parser function won't affect the original tokens array.*/
  const executableCode = codeGen(ast)   
  
   //console.log(ast); // Print the original tokens array

   return executableCode
}

function runner (input){
  eval(input)
}


const code = `
ye x = 10
ye y = 20 

ye sum = x + y
bol sum 
`;

const exec =compiler(code);

runner(exec)
