// debug-env.js - Let's see what's actually happening
console.log('=== Environment Debug ===');
console.log('process.cwd():', process.cwd());
console.log('process.env.INIT_CWD:', process.env.INIT_CWD);
console.log('process.env.PWD:', process.env.PWD);
console.log('__dirname would be:', new URL('.', import.meta.url).pathname);
console.log('process.argv:', process.argv);
console.log('========================');
