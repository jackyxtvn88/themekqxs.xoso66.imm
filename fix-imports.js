const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const original = content;
            // Replace all instances of ../component/ with ../components/
            content = content.replace(/from ['"](\.\.\/.*)component\//g, "from '$1components/");
            content = content.replace(/from ['"](\.\.\/)([^'"]*)component\//g, "from '$1$2components/");
            content = content.replace(/['"]\.\.\/component\//g, "'../components/");
            content = content.replace(/['"]\.\.\/\.\.\/component\//g, "'../../components/");
            content = content.replace(/['"]\.\.\/\.\.\/\.\.\/component\//g, "'../../../components/");
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Fixed: ${fullPath}`);
            }
        }
    });
}

walkDir('.');
console.log('All imports fixed!');
