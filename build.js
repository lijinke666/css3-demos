//将当前项目 所有 html 自动生成书签

const path = require('path');
const fs = require('fs');

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

function getDirPath(dir = __dirname, publicPath = '..') {
  if (!fs.existsSync(dir)) throw new Error(`${dir}: not found`);
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
    const newPath = currentPath.replace(__dirname, publicPath);
    if (isDirectory) {
      filenames.push(...getDirPath(currentPath, publicPath));
    } else {
      filenames.push(newPath);
    }
  }
  return filenames;
}
const createBookmark = ({
  entry = __dirname,
  output = 'index.html',
  publicPath = ''
} = {}) => {
  if (path.extname(output) !== '.html') {
    throw new Error(`[${output}] output format should be :[.html]`);
  }
  const source = getDirPath(entry, publicPath);
  const temp = source.reduce((str, value, i) => {
    str += `
     <p>
      <a href="${value}" target="_blank">${i + 1}. ${path.basename(value)}</a>
     </p>
    `;
    return str;
  }, '');

  const html = htmlTemp.replace('{path}', temp).replace('{name}', output);

  fs.writeFileSync(path.resolve(__dirname, output), html);
};

createBookmark({
  entry: __dirname,
  output: 'index.html',
  publicPath: '/css3-demos'
});
