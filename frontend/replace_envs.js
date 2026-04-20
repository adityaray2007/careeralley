const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.js') || file.endsWith('.jsx')) results.push(file);
          next();
        }
      });
    })();
  });
};

walk('/Users/adityaray/Desktop/DTI Project/careeralley_project_structure/frontend/src', (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Pattern 1: fetch("http://localhost:8080/...")
    // Convert to fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/...")
    content = content.replace(/"http:\/\/localhost:8080([^"]*)"/g, '(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "$1"');

    // Pattern 2: fetch(`http://localhost:8080/...`)
    // Convert to fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/...`)
    content = content.replace(/`http:\/\/localhost:8080([^`]*)`/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}$1`');

    // Pattern 3: ws://localhost:8080/...
    content = content.replace(/`ws:\/\/localhost:8080([^`]*)`/g, '`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace("http", "ws")}$1`');

    // Special cases like <a href="http://localhost:8080..." /> might fail, but we don't have them based on grep.
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated', file);
    }
  });
});
