//将当前项目 所有 html 自动生成书签

const path = require('path');
const fs = require('fs');

const outputName = 'index.html';

const htmlTemp = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{name}</title>
  <style>
  a{
    text-decoration: none;
    color:#444;
    transition: color .3s;
  }
  a:hover,a:active,a:visited{
    color:#396;
  }
  </style>
</head>
<body>
{path}
</body>
</html>
`;

function getDirPath(dir = path.resolve(__dirname)) {
  if (!fs.existsSync(dir)) throw new Error(`${dir}: 不存在`);
  const _dir = fs.readdirSync(dir); //当前目录列表
  const filenames = [];

  for (let filename of _dir) {
    const currentPath = path.join(dir, filename);
    const isDirectory = fs.lstatSync(currentPath).isDirectory();
    if (
      (!isDirectory && path.extname(filename) !== '.html') ||
      filename.startsWith('.')
    ) {
      continue;
    }

    if (isDirectory) {
      filenames.push(...getDirPath(currentPath));
    } else {
      filenames.push(currentPath.replace(__dirname, '..'));
    }
  }
  return filenames;
}

const createBookmark = ({ source = [], name = 'index.html' } = {}) => {
  if (path.extname(name) !== '.html') {
    throw new Error('文件名只能为:[.html]');
  }
  const temp = source.reduce((str, value, i) => {
    str += `
     <p>
      <a href="${value}" target="_blank">${i + 1}. ${path.basename(value)}</a>
     </p>
    `;
    return str;
  }, '');

  const html = htmlTemp.replace('{path}', temp).replace('{name}', name);

  fs.writeFileSync(path.resolve(__dirname, name), html);
};

createBookmark({
  source: getDirPath(),
  name: outputName
});
