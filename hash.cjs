const fs = require('node:fs');
const crypto = require('node:crypto');

const [action, file] = process.argv.slice(2);

if (!['create', 'check'].includes(action) || !file) {
  console.log('Пример: node hash.cjs create vroom.js');
  process.exit(2);
}

const data = fs.readFileSync(file);

const current = {
  md5: crypto.createHash('md5').update(data).digest('hex'),
  sha256: crypto.createHash('sha256').update(data).digest('hex')
};

console.log('Файл:', file);
console.log('MD5:', current.md5);
console.log('SHA-256:', current.sha256);

if (action === 'create') {
  fs.writeFileSync('hashes.json', JSON.stringify(current, null, 2));
  console.log('Хеши исходного файла сохранены в hashes.json');
} else {
  const saved = JSON.parse(fs.readFileSync('hashes.json', 'utf8'));

  const md5Same = current.md5 === saved.md5;
  const shaSame = current.sha256 === saved.sha256;

  console.log('Проверка MD5:', md5Same ? 'совпадает' : 'НЕ СОВПАДАЕТ');
  console.log('Проверка SHA-256:', shaSame ? 'совпадает' : 'НЕ СОВПАДАЕТ');

  console.log(md5Same && shaSame ? 'Файл не изменён.' : 'Файл изменён.');
  process.exitCode = md5Same && shaSame ? 0 : 1;
}