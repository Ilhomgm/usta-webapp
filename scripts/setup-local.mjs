import { existsSync,writeFileSync,readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
const filename='.env.local';
const existing=existsSync(filename)?readFileSync(filename,'utf8'):'';
if(/^ADMIN_PASSWORD=\S{16,}/m.test(existing)&&/^SESSION_SECRET=\S{32,}/m.test(existing)){
 console.log('Admin credentials already configured. Existing values were preserved.');
}else{
 if(/^ADMIN_PASSWORD=.+/m.test(existing)||/^SESSION_SECRET=.+/m.test(existing))throw new Error('Existing partial configuration found. Configure credentials manually to avoid overwriting secrets.');
 const password=randomBytes(24).toString('base64url');
 const secret=randomBytes(48).toString('base64url');
 const base=existing.replace(/^ADMIN_PASSWORD=.*$/gm,'').replace(/^SESSION_SECRET=.*$/gm,'');
 writeFileSync(filename,`${base}\nADMIN_PASSWORD=${password}\nSESSION_SECRET=${secret}\n`,{mode:0o600});
 writeFileSync('ADMIN-ACCESS.local.txt',`USTA local admin\nURL: http://localhost:3000/login\nPassword: ${password}\n\nKeep this file private. Do not publish it or include it in Git.\n`,{mode:0o600});
 console.log('Admin configured. Password saved to ADMIN-ACCESS.local.txt (not printed).');
}
