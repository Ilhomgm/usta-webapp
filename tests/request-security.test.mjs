import test from 'node:test';
import assert from 'node:assert/strict';
import { originAllowed,secureCookie } from '../lib/request-security.mjs';
test('loopback origins support Next hostname normalization without accepting remote origins',()=>{
 assert.equal(originAllowed('http://127.0.0.1:3000','http://localhost:3000'),true);
 assert.equal(originAllowed('http://localhost:3000','http://localhost:3000'),true);
 for(const origin of [null,'null','https://evil.example','http://localhost:3001','http://localhost.evil.example:3000','http://127.0.0.1:3000/x']) {
  assert.equal(originAllowed(origin,'http://localhost:3000'),false);
 }
 assert.equal(originAllowed('http://localhost:3000','https://usta.example'),false);
 assert.equal(originAllowed('http://localhost:3000','http://localhost:3000','https://usta.example'),false);
 assert.equal(originAllowed('https://usta.example','http://localhost:3000','https://usta.example'),true);
 assert.equal(secureCookie('http://localhost:3000'),false);
 assert.equal(secureCookie('http://127.0.0.1:3000'),false);
 assert.equal(secureCookie('https://usta.example'),true);
 assert.equal(secureCookie('http://usta.example'),true);
});
