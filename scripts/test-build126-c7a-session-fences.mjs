// Build126 C7a: pure mocked-worker race tests. Invented sizes/reports only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const raw=fs.readFileSync('src/catalogue/c7a-preview-session.ts','utf8');
const compiled=ts.transpileModule(raw,{
  fileName:'src/catalogue/c7a-preview-session.ts',
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
}).outputText;
const exports={};
vm.runInNewContext(compiled,{exports,require(name){
  if(name==='./import')return {MAX_BYTES:10*1024*1024};
  if(name==='./c7a-preview')return {rejectC7a:code=>({status:'rejected',code})};
  throw Error('Unexpected test dependency');
}});
const {createC7aSession}=exports;
const accepted={status:'accepted',counts:{recordings:1}};
const rejected={status:'rejected',code:'SOURCE_NOT_ACCEPTED'};
const jobs=[],events=[];
const factory=()=>{
  const job={onmessage:null,onerror:null,terminated:false,
    postMessage(file){this.file=file;},terminate(){this.terminated=true;}};
  jobs.push(job);return job;
};
const session=createC7aSession(factory,state=>events.push(JSON.parse(JSON.stringify(state))));
let tests=0;
const test=(label,run)=>{run();tests++;console.log('Build126 C7a session: '+label+' PASS');};
const file=(name,size=22)=>({name,size});

test('first local selection starts worker and emits no source fields',()=>{
  session.select(file('invented.json'));
  assert.deepEqual(events.at(-1),{phase:'reading'});
  assert.equal(jobs.length,1);
  assert.deepEqual(jobs[0].file,file('invented.json'));
});
const stale=jobs[0].onmessage;
test('second selection cancels worker and fence rejects late first completion',()=>{
  session.select(file('other.json'));
  assert.equal(jobs[0].terminated,true);
  assert.equal(jobs.length,2);
  const before=events.length;
  stale({data:accepted});
  assert.equal(events.length,before);
  assert.deepEqual(events.at(-1),{phase:'reading'});
});
const live=jobs[1].onmessage;
test('current worker reports only summary and is terminated at completion',()=>{
  live({data:accepted});
  assert.equal(jobs[1].terminated,true);
  assert.deepEqual(events.at(-1),{phase:'complete',report:accepted});
});
test('Reset forgets report and stale completion cannot resurrect it',()=>{
  session.select(file('third.json'));
  const old=jobs[2].onmessage;
  session.reset();
  assert.equal(jobs[2].terminated,true);
  assert.deepEqual(events.at(-1),{phase:'empty'});
  const before=events.length;
  old({data:accepted});
  assert.equal(events.length,before);
});
test('wrong extension empty and oversized inputs reject without starting workers',()=>{
  for(const [f,code] of [[file('invented.txt'), 'JSON_ONLY'],[file('empty.json',0),'FILE_EMPTY'],[file('too-big.json',10*1024*1024+1),'FILE_TOO_LARGE']]){
    const before=jobs.length;session.select(f);
    assert.equal(jobs.length,before);
    assert.deepEqual(events.at(-1),{phase:'complete',report:{status:'rejected',code}});
  }
});
test('active parser error stops worker and returns fixed rejection only',()=>{
  session.select(file('error.json'));
  const job=jobs.at(-1);
  let prevented=false;
  job.onerror({preventDefault(){prevented=true;}});
  assert.equal(prevented,true);
  assert.equal(job.terminated,true);
  assert.deepEqual(events.at(-1),{phase:'complete',report:{status:'rejected',code:'LOCAL_PREVIEW_FAILED'}});
});
test('dispose fences all late results and prevents further source reads',()=>{
  session.select(file('pending.json'));
  const job=jobs.at(-1),handler=job.onmessage;
  session.dispose();
  assert.equal(job.terminated,true);
  const before=events.length,count=jobs.length;
  handler({data:rejected});
  session.select(file('never-read.json'));
  session.reset();
  assert.equal(jobs.length,count);
  assert.equal(events.length,before);
});
console.log('Build126 C7a: '+tests+' pure worker-generation/Reset/dispose cases PASS, invented-only.');
