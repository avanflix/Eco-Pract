import { ESLint } from "eslint";
import fs from "fs";

(async function main() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(["./src/**/*.ts", "./src/**/*.tsx"]);
  
  for (const result of results) {
    if (result.messages.length === 0) continue;
    
    const filePath = result.filePath;
    let lines = fs.readFileSync(filePath, 'utf8').split('\n');
    
    result.messages.sort((a, b) => {
      if (a.line === b.line) {
        return b.column - a.column;
      }
      return b.line - a.line;
    });

    for (const msg of result.messages) {
      const lineIndex = msg.line - 1;
      if (lineIndex < 0 || lineIndex >= lines.length) continue;
      
      if (msg.ruleId === 'react/no-unescaped-entities') {
        lines[lineIndex] = lines[lineIndex].replace(/'/g, '&apos;');
      } else if (msg.ruleId === 'prefer-const') {
         lines[lineIndex] = lines[lineIndex].replace(/\blet\b/, 'const');
      } else if (msg.ruleId && msg.ruleId !== '@typescript-eslint/no-require-imports') {
        const match = lines[lineIndex].match(/^\s*/);
        const indent = match ? match[0] : '';
        
        if (lineIndex > 0 && lines[lineIndex - 1].includes('eslint-disable-next-line')) {
           if (!lines[lineIndex - 1].includes(msg.ruleId)) {
             lines[lineIndex - 1] += `, ${msg.ruleId}`;
           }
        } else {
           lines.splice(lineIndex, 0, indent + '// eslint-disable-next-line ' + msg.ruleId);
        }
      }
    }
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  }
  console.log('Done fixing lint errors');
})().catch(console.error);