const fs = require('fs');
const path = require('path');

const vexoPkgPath = path.join(__dirname, '..', 'node_modules', 'vexo-analytics', 'package.json');

if (fs.existsSync(vexoPkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(vexoPkgPath, 'utf8'));
    if (pkg.codegenConfig) {
      delete pkg.codegenConfig;
      fs.writeFileSync(vexoPkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      console.log('Successfully patched vexo-analytics for React Native New Architecture compatibility.');
    }
  } catch (e) {
    console.warn('Failed to patch vexo-analytics:', e);
  }
}
