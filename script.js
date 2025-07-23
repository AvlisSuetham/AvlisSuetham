// Mapas principais
const suethamCode = {
  'A': '16', 'B': '26', 'C': '36', 'D': '46', 'E': '56',
  'F': '17', 'G': '27', 'H': '37', 'I': '47', 'J': '57',
  'K': '18', 'L': '28', 'M': '38', 'N': '48', 'O': '58',
  'P': '19', 'Q': '29', 'R': '39', 'S': '49', 'T': '59',
  'U': 'C6', 'V': 'C7', 'W': 'C8', 'X': 'C9',
  'Y': 'Q6', 'Z': 'Q7', ' ': ' '
};

const codeToSuetham = Object.fromEntries(
  Object.entries(suethamCode).map(([k, v]) => [v, k])
);

const numeroParaLetra = {
  '0': 'A',
  '1': 'C',
  '2': 'D',
  '3': 'E',
  '4': 'F',
  '5': 'G',
  '6': 'H',
  '7': 'I',
  '8': 'J',
  '9': 'K'
};

const letraParaNumero = Object.fromEntries(
  Object.entries(numeroParaLetra).map(([num, let]) => [let, num])
);

const pontuacaoMapCripto = {
  '?': '#',
  '!': '*',
  ',': '.'
};

const pontuacaoMapDescripto = {
  '#': '?',
  '*': '!',
  '.': ','
};

// Função que transforma códigos C6.. em (6), Q7.. em [7]
function codigoParaSimbolo(codigo) {
  if (!codigo || codigo.length !== 2) return codigo;
  const prefixo = codigo[0];
  const num = codigo[1];
  if (prefixo === 'C') return `(${num})`;
  if (prefixo === 'Q') return `[${num}]`;
  return codigo;
}

// Inverte o símbolo para o código original
function simboloParaCodigo(simbolo, texto, pos) {
  const ch = simbolo[0];
  const num = simbolo[1];
  if (ch === '(' && texto[pos + 2] === ')') return ['C' + num, 3];
  if (ch === '[' && texto[pos + 2] === ']') return ['Q' + num, 3];
  return [null, 0];
}

// Checa se letra tem acento (considerando maiúsculas acentuadas)
function temAcento(letra) {
  const mapaAcentos = {
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
  };
  return mapaAcentos[letra] || null;
}

function criptografar() {
  const texto = document.getElementById("inputText").value.toUpperCase();
  let resultado = "";

  for (const char of texto) {
    if (pontuacaoMapCripto[char]) {
      resultado += pontuacaoMapCripto[char];
      continue;
    }

    if (char === ' ') {
      resultado += ' ';
      continue;
    }

    const base = temAcento(char);
    if (base) {
      const codeBase = suethamCode[base];
      if (!codeBase) {
        resultado += '?';
      } else if (codeBase.startsWith('C') || codeBase.startsWith('Q')) {
        resultado += '0' + codigoParaSimbolo(codeBase);
      } else {
        resultado += '0' + codeBase;
      }
      continue;
    }

    if (char >= '0' && char <= '9') {
      resultado += numeroParaLetra[char] || '?';
    } else {
      const code = suethamCode[char];
      if (!code) {
        resultado += '?';
      } else if (code.startsWith('C') || code.startsWith('Q')) {
        resultado += codigoParaSimbolo(code);
      } else {
        resultado += code;
      }
    }
  }

  document.getElementById("outputText").value = resultado;
}

function descriptografar() {
  const texto = document.getElementById("inputText").value.toUpperCase();
  let resultado = "";
  let i = 0;

  while (i < texto.length) {
    const ch = texto[i];

    if (pontuacaoMapDescripto[ch]) {
      resultado += pontuacaoMapDescripto[ch];
      i++;
      continue;
    }

    if (ch === ' ') {
      resultado += ' ';
      i++;
      continue;
    }

    if (ch === '0') {
      const prox = texto[i + 1];
      if (prox === '(' || prox === '[') {
        const [codigo, salto] = simboloParaCodigo(texto.substr(i + 1, 3), texto, i + 1);
        if (codigo) {
          resultado += codeToSuetham[codigo] + '́';
          i += 1 + salto;
        } else {
          resultado += '?';
          i++;
        }
      } else {
        const codigo = texto.substr(i + 1, 2);
        if (codeToSuetham[codigo]) {
          resultado += codeToSuetham[codigo] + '́';
          i += 3;
        } else {
          resultado += '?';
          i++;
        }
      }
      continue;
    }

    if (ch === '(' || ch === '[') {
      const [codigo, salto] = simboloParaCodigo(texto.substr(i, 3), texto, i);
      if (codigo) {
        resultado += codeToSuetham[codigo] || '?';
        i += salto;
      } else {
        resultado += '?';
        i++;
      }
      continue;
    }

    if (letraParaNumero[ch]) {
      resultado += letraParaNumero[ch];
      i++;
      continue;
    }

    const codigo = texto.substr(i, 2);
    if (codeToSuetham[codigo]) {
      resultado += codeToSuetham[codigo];
      i += 2;
    } else {
      resultado += '?';
      i++;
    }
  }

  document.getElementById("outputText").value = resultado;
}