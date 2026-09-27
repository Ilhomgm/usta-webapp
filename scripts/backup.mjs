import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const source=resolve(process.env.USTA_DB_PATH || 'data/usta.sqlite');
if(!existsSync(source))throw new Error('Start USTA and create an account before making a backup.');
mkdirSync('backups',{recursive:true});
const destination=resolve('backups',`usta-${new Date().toISOString().replaceAll(':','-')}.sqlite`);
const db=new DatabaseSync(source);
try{db.prepare('VACUUM INTO ?').run(destination);console.log(destination)}finally{db.close()}
