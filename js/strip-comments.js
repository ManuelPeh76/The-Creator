/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */
const strip = (function() {
   'use strict';
   class Node {
     constructor(node) {
       this.type = node.type;
       if (node.value) this.value = node.value;
       if (node.match) this.match = node.match;
       this.newline = node.newline || '';
     }
     get protected() {
       return Boolean(this.match) && this.match[1] === '!';
     }
   }
   class Block extends Node {
     constructor(node) {
       super(node);
       this.nodes = node.nodes || [];
     }
     push(node) {
       this.nodes.push(node);
     }
     get protected() {
       return this.nodes.length > 0 && this.nodes[0].protected === true;
     }
   }
   const languages = {
       ada: { LINE_REGEX: /^--.*/ },
       apl: { LINE_REGEX: /^⍝.*/ },
       applescript: { BLOCK_OPEN_REGEX: /^\(\*/, BLOCK_CLOSE_REGEX: /^\*\)/ },
       csharp: { LINE_REGEX: /^\/\/.*/ },
       haskell: { BLOCK_OPEN_REGEX: /^\{-/, BLOCK_CLOSE_REGEX: /^-\}/, LINE_REGEX: /^--.*/ },
       html: { BLOCK_OPEN_REGEX: /^\n*<!--(?!-?>)/, BLOCK_CLOSE_REGEX: /^(?<!(?:<!-))-->/, BLOCK_CLOSE_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>/, BLOCK_CLOSE_STRICT_NEWLINE_REGEX: /^(?<!(?:<!-))-->(\s*\n+|\n*)/, BLOCK_CLOSE_STRICT_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>(\s*\n+|\n*)/ },
       javascript: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       lua: { BLOCK_OPEN_REGEX: /^--\[\[/, BLOCK_CLOSE_REGEX: /^\]\]/, LINE_REGEX: /^--.*/ },
       matlab: { BLOCK_OPEN_REGEX: /^%{/, BLOCK_CLOSE_REGEX: /^%}/, LINE_REGEX: /^%.*/ },
       perl: { LINE_REGEX: /^#.*/ },
       php: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^(#|\/\/).*?(?=\?>|\n)/ },
       python: { BLOCK_OPEN_REGEX: /^"""/, BLOCK_CLOSE_REGEX: /^"""/, LINE_REGEX: /^#.*/ },
       ruby: { BLOCK_OPEN_REGEX: /^=begin/, BLOCK_CLOSE_REGEX: /^=end/, LINE_REGEX: /^#.*/ },
       shebang: { LINE_REGEX: /^#!.*/ },
       hashbang: { LINE_REGEX: /^#!.*/ },
       c: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       csharp: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       css: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       java: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       js: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       less: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       pascal: { BLOCK_OPEN_REGEX: /^\(\*/, BLOCK_CLOSE_REGEX: /^\*\)/ },
       ocaml: { BLOCK_OPEN_REGEX: /^\(\*/, BLOCK_CLOSE_REGEX: /^\*\)/ },
       sass: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       sql: { LINE_REGEX: /^--.*/ },
       swift: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       ts: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       typscript: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
       xml: { BLOCK_OPEN_REGEX: /^\n*<!--(?!-?>)/, BLOCK_CLOSE_REGEX: /^(?<!(?:<!-))-->/, BLOCK_CLOSE_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>/, BLOCK_CLOSE_STRICT_NEWLINE_REGEX: /^(?<!(?:<!-))-->(\s*\n+|\n*)/, BLOCK_CLOSE_STRICT_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>(\s*\n+|\n*)/ }
   };

   const constants = {
     ESCAPED_CHAR_REGEX: /^\\./,
     QUOTED_STRING_REGEX: /^(['"`])((?:\\.|[^\1])+?)(\1)/,
     NEWLINE_REGEX: /^\r*\n/
   };

   const parse = (input, options = {}) => {
     if (typeof input !== 'string') throw new TypeError('Expected input to be a string');
     const cst = new Block({ type: 'root', nodes: [] });
     const stack = [cst];
     const name = (options.language || 'javascript').toLowerCase();
     const lang = languages[name];
     if (typeof lang === 'undefined') throw new Error(`Language "${name}" is not supported by strip-comments`);
     const { LINE_REGEX, BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX } = lang;
     let block = cst;
     let remaining = input;
     let token;
     let prev;
     const source = [BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX].filter(Boolean);
     let tripleQuotes = false;
     if (source.every(regex => regex.source === '^"""')) tripleQuotes = true;
     const consume = (value = remaining[0] || '') => {
       remaining = remaining.slice(value.length);
       return value;
     };
     const scan = (regex, type = 'text') => {
       const match = regex.exec(remaining);
       if (match) {
         consume(match[0]);
         return { type, value: match[0], match };
       }
     };
     const push = node => {
       if (prev && prev.type === 'text' && node.type === 'text') {
         prev.value += node.value;
         return;
       }
       block.push(node);
       if (node.nodes) {
         stack.push(node);
         block = node;
       }
       prev = node;
     };
     const pop = () => {
       if (block.type === 'root') throw new SyntaxError('Unclosed block comment');
       stack.pop();
       block = stack[stack.length - 1];
     };
     while (remaining !== '') {
       // escaped characters
       if ((token = scan(constants.ESCAPED_CHAR_REGEX, 'text'))) {
         push(new Node(token));
         continue;
       }
       if (block.type !== 'block' && (!prev || !/\w$/.test(prev.value)) && !(tripleQuotes && remaining.startsWith('"""'))) {
         if ((token = scan(constants.QUOTED_STRING_REGEX, 'text'))) {
           push(new Node(token));
           continue;
         }
       }
       if ((token = scan(constants.NEWLINE_REGEX, 'newline'))) {
         push(new Node(token));
         continue;
       }
       if (BLOCK_OPEN_REGEX && options.block && !(tripleQuotes && block.type === 'block')) {
         if ((token = scan(BLOCK_OPEN_REGEX, 'open'))) {
           push(new Block({ type: 'block' }));
           push(new Node(token));
           continue;
         }
       }
       if (BLOCK_CLOSE_REGEX && block.type === 'block' && options.block) {
         if ((token = scan(BLOCK_CLOSE_REGEX, 'close'))) {
           token.newline = token.match[1] || '';
           push(new Node(token));
           pop();
           continue;
         }
       }
       if (LINE_REGEX && block.type !== 'block' && options.line) {
         if ((token = scan(LINE_REGEX, 'line'))) {
           push(new Node(token));
           continue;
         }
       }
       if ((token = scan(/^[a-zABD-Z0-9\t ]+/, 'text'))) {
         push(new Node(token));
         continue;
       }
       push(new Node({ type: 'text', value: consume(remaining[0]) }));
     }
     return cst;
   };
   const compile = (cst, options = {}) => {
     const keepProtected = options.safe === true || options.keepProtected === true;
     let firstSeen = false;
     const walk = (node, parent) => {
       let output = '';
       let inner;
       let lines;
       for (const child of node.nodes) {
         switch (child.type) {
           case 'block':
             if (options.first && firstSeen === true) {
               output += walk(child, node);
               break;
             }
             if (options.preserveNewlines === true) {
               inner = walk(child, node);
               lines = inner.split('\n');
               output += '\n'.repeat(lines.length - 1);
               break;
             }
             if (keepProtected === true && child.protected === true) {
               output += walk(child, node);
               break;
             }
             firstSeen = true;
             break;
           case 'line':
             if (options.first && firstSeen === true) {
               output += child.value;
               break;
             }
             if (keepProtected === true && child.protected === true) {
               output += child.value;
             }
             firstSeen = true;
             break;
           case 'open':
           case 'close':
           case 'text':
           case 'newline':
           default: {
             output += child.value || '';
             break;
           }
         }
       }
       return output;
     };
     return walk(cst);
   };
   const strip = (input, options) => {
     const opts = { ...options, block: true, line: true };
     return compile(parse(input, opts), opts);
   };
   strip.block = (input, options) => {
     const opts = { ...options, block: true };
     return compile(parse(input, opts), opts);
   };
   strip.line = (input, options) => {
     const opts = { ...options, line: true };
     return compile(parse(input, opts), opts);
   };
   strip.first = (input, options) => {
     const opts = { ...options, block: true, line: true, first: true };
     return compile(parse(input, opts), opts);
   };
   strip.parse = parse;
   return strip;
})();
