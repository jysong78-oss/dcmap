import fs from 'fs';

const src = fs.readFileSync('pp_data.js', 'utf8');
// "const PP_DATA = [...];" → JSON 배열 추출
const jsonStr = src.replace(/^const PP_DATA\s*=\s*/, '').replace(/;?\s*$/, '');
const data = JSON.parse(jsonStr);

// 컬럼 압축: 필드명을 한 번만 저장
const cols = Object.keys(data[0]);
const rows = data.map(d => cols.map(c => d[c] ?? null));

const output = JSON.stringify({ cols, rows });
fs.writeFileSync('pp_data.json', output, 'utf8');

console.log(`원본 JS: ${(src.length/1024).toFixed(1)} KB`);
console.log(`압축 JSON: ${(output.length/1024).toFixed(1)} KB`);
console.log(`절감률: ${(100 - output.length/src.length*100).toFixed(1)}%`);
console.log(`레코드 수: ${rows.length}`);
