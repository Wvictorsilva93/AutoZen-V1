const fs = require('fs');
const src = 'C:\\Users\\Wander\\.gemini\\antigravity-ide\\brain\\574718bc-3f16-4203-849c-a5380a233db8\\media__1781737150103.png';
const dest = 'C:\\Users\\Wander\\Desktop\\AutoZen\\autozen-app\\public\\logo-autozen.png';

try {
  fs.copyFileSync(src, dest);
  console.log('Copy successful!');
} catch (err) {
  console.error('Error copying:', err);
}
