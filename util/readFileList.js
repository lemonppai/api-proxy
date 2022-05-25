const fs = require('fs');
const path = require('path');

function readFileList(dir, filesList = []) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    // console.log(files);
    files.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readFileList(path.join(dir, item), filesList);  //递归读取文件
      } else {
        filesList.push(
          fullPath.replace(/\\/g, '/')
        );
      }
    });
  }
  return filesList;
}

// 传入文件夹路径
module.exports = (dirPath) => {
  return readFileList(dirPath).map(a => a.replace(dirPath, ''));
}
