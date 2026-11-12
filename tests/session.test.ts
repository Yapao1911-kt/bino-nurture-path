import {test} from 'node:test';
import assert from 'node:assert/strict';
import {signSession,readSession,requireSession} from '../src/lib/session';
process.env.BINO_SESSION_SECRET='test-only-secret-with-at-least-32-characters';
const now=1800000000000;
function req(token:string){return new Request('https://bino.test',{headers:{cookie:`bino_session=${token}`}});}
test('signed session identifies user and rejects tampering',()=>{
 const token=signSession('parent-A',now);
 assert.equal(readSession(req(token),now),'parent-A');
 const [payload,sig]=token.split('.');
 const changed=Buffer.from(JSON.stringify({sub:'parent-B',exp:now/1000+100})).toString('base64url');
 assert.equal(readSession(req(`${changed}.${sig}`),now),null);
 assert.equal(readSession(req(`${payload}.invalid`),now),null);
});
test('expired, absent, malformed sessions fail closed',()=>{
 assert.equal(readSession(req(signSession('parent-A',now)),now+43200001),null);
 assert.equal(readSession(new Request('https://bino.test'),now),null);
 assert.equal(readSession(req('a.b.c'),now),null);
 assert.throws(()=>requireSession(new Request('https://bino.test')));
});
test('secret must be supplied by operator',()=>{
 const secret=process.env.BINO_SESSION_SECRET;delete process.env.BINO_SESSION_SECRET;
 assert.throws(()=>signSession('parent-A',now));process.env.BINO_SESSION_SECRET=secret;
});
