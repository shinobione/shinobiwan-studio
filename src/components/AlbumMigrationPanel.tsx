import { useEffect, useMemo, useState } from 'react';
import { AlbumAdminError } from '../services/album-admin-api';
import { applyAdminAlbumMigration, getAdminAlbumMigrationDryRun, type AlbumMigrationCandidate, type AlbumMigrationDryRun } from '../services/album-migration-api';

function messageOf(reason: unknown) {
  if (reason instanceof AlbumAdminError) return `${reason.message}${reason.code ? ` [${reason.code}]` : ''}`;
  return reason instanceof Error ? reason.message : String(reason);
}
function move(list: string[], from: number, to: number) {
  if (to < 0 || to >= list.length || from === to) return list;
  const next = [...list]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next;
}
function CandidateCard({ candidate, order, setOrder, typed, setTyped, orderConfirmed, setOrderConfirmed, busy, onApply }:{
  candidate: AlbumMigrationCandidate; order:string[]; setOrder:(ids:string[])=>void; typed:string; setTyped:(value:string)=>void;
  orderConfirmed:boolean; setOrderConfirmed:(value:boolean)=>void; busy:boolean; onApply:()=>Promise<void>;
}) {
  const byId = useMemo(() => new Map(candidate.tracks.map(track => [track.id, track])), [candidate.tracks]);
  const expected = `MIGRATE ${candidate.id}`;
  const locked = candidate.canonicalExists || candidate.blockers.length > 0;
  const canApply = !locked && candidate.readyToApply && typed === expected && (!candidate.requiresOrderConfirmation || orderConfirmed) && order.length === candidate.candidateCount;
  return <article className={`panel album-migration-card${candidate.canonicalExists ? ' canonical' : ''}`}>
    <div className="album-migration-head"><div><span className="eyebrow">{candidate.canonicalExists ? 'CANONICAL / DONE' : 'LEGACY → CANONICAL'}</span><h3>{candidate.title}</h3><p><code>{candidate.id}</code> · {candidate.candidateCount} candidate track{candidate.candidateCount === 1 ? '' : 's'}</p></div><span className={`album-migration-state ${candidate.canonicalExists ? 'done' : candidate.blockers.length ? 'blocked' : 'ready'}`}>{candidate.canonicalExists ? 'CANONICAL' : candidate.blockers.length ? 'BLOCKED' : 'DRY-RUN READY'}</span></div>
    <div className="album-migration-source"><span>Cover source</span><code>{candidate.cover?.repositoryPath || 'missing'}</code></div>
    {candidate.blockers.length > 0 && <div className="album-migration-issues blockers"><strong>Blockers</strong>{candidate.blockers.map(issue => <p key={issue.code}><b>{issue.code}</b> — {issue.message}{issue.trackIds?.length ? ` (${issue.trackIds.join(', ')})` : ''}</p>)}</div>}
    {candidate.warnings.length > 0 && <div className="album-migration-issues warnings"><strong>Warnings</strong>{candidate.warnings.map(issue => <p key={issue.code}><b>{issue.code}</b> — {issue.message}{issue.trackIds?.length ? ` (${issue.trackIds.join(', ')})` : ''}</p>)}</div>}
    <div className="album-migration-order"><div className="album-migration-order-head"><strong>Proposed artistic order</strong><small>{candidate.deterministicOrder ? 'Derived from unique sequence/order/position values.' : 'Must be reviewed and explicitly confirmed.'}</small></div><ol>{order.map((id,index)=><li key={id}><span>{String(index+1).padStart(2,'0')}</span><div><strong>{byId.get(id)?.title || id}</strong><small>{id}{byId.get(id)?.sequence != null ? ` · source order ${byId.get(id)?.sequence}` : ''}</small></div><div><button disabled={busy||index===0||candidate.canonicalExists} onClick={()=>setOrder(move(order,index,index-1))}>↑</button><button disabled={busy||index===order.length-1||candidate.canonicalExists} onClick={()=>setOrder(move(order,index,index+1))}>↓</button></div></li>)}</ol></div>
    {!candidate.canonicalExists && candidate.requiresOrderConfirmation && <label className="album-migration-confirm-order"><input type="checkbox" checked={orderConfirmed} disabled={busy} onChange={event=>setOrderConfirmed(event.target.checked)}/><span>I reviewed and confirm this artistic track order.</span></label>}
    {!candidate.canonicalExists && <div className="album-migration-apply"><label><span>Type <code>{expected}</code> to unlock this Album only</span><input value={typed} disabled={busy||locked} onChange={event=>setTyped(event.target.value)} autoComplete="off" spellCheck={false}/></label><button className="primary-btn" disabled={busy||!canApply} onClick={()=>void onApply()}>{busy ? 'Migrating…' : `Migrate ${candidate.title}`}</button></div>}
  </article>;
}

export function AlbumMigrationPanel() {
  const [plan,setPlan] = useState<AlbumMigrationDryRun|null>(null);
  const [orders,setOrders] = useState<Record<string,string[]>>({});
  const [typed,setTyped] = useState<Record<string,string>>({});
  const [orderConfirmed,setOrderConfirmed] = useState<Record<string,boolean>>({});
  const [busy,setBusy] = useState<string|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);
  const [notice,setNotice] = useState<string|null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const next = await getAdminAlbumMigrationDryRun();
      setPlan(next);
      setOrders(current => Object.fromEntries(next.albums.map(album => [album.id, current[album.id] && current[album.id].length === album.proposedTrackIds.length && current[album.id].every(id => album.proposedTrackIds.includes(id)) ? current[album.id] : [...album.proposedTrackIds]])));
    } catch (reason) { setError(messageOf(reason)); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ void load(); },[]);

  async function apply(candidate: AlbumMigrationCandidate) {
    if (busy) return;
    const order = orders[candidate.id] || candidate.proposedTrackIds;
    const phrase = typed[candidate.id] || '';
    if (phrase !== `MIGRATE ${candidate.id}`) return;
    if (!globalThis.confirm(`Migrate “${candidate.title}” to a canonical R2 Album?\n\nThis is the FIRST real R2 mutation for this Album. The operation is one-Album-only, stale-guarded and rollback-protected. Singles is untouched.`)) return;
    setBusy(candidate.id); setError(null); setNotice(null);
    try {
      const result = await applyAdminAlbumMigration({ albumId:candidate.id, expectedStateToken:candidate.stateToken, trackIds:order, orderConfirmed: candidate.requiresOrderConfirmation ? Boolean(orderConfirmed[candidate.id]) : true, confirm:phrase });
      setNotice(`${candidate.title} migrated and canonically reread. Catalog projection rebuilt; ${result.trackCachesRewritten ?? 0} track compatibility caches rewritten.`);
      setTyped(current=>({...current,[candidate.id]:''}));
      await load();
    } catch (reason) {
      setError(`${messageOf(reason)} Reload the dry-run before any retry.`);
      await load().catch(()=>{});
    } finally { setBusy(null); }
  }

  return <section className="album-migration-stack" aria-label="C2.5-E Album migration">
    <article className="panel album-migration-intro"><div><span className="eyebrow">PHASE UX · C2.5-E</span><h2>Legacy Albums → canonical R2</h2><p>This cockpit starts read-only. It derives candidates from live R2 track manifests, never from a stale hardcoded track list. There is no batch migration.</p></div><button className="ghost-btn" disabled={loading||Boolean(busy)} onClick={()=>void load()}>{loading?'Reading…':'Refresh dry-run'}</button></article>
    {plan && <article className="panel album-migration-proof"><div><span>Migration</span><code>{plan.migrationId}</code></div><div><span>Source ref</span><code>{plan.sourceRef.slice(0,12)}…</code></div><div><span>Generated</span><strong>{new Date(plan.generatedAt).toLocaleString()}</strong></div><div><span>Writes</span><strong>{plan.writesPerformed ? 'UNEXPECTED' : '0 · READ ONLY'}</strong></div></article>}
    {error && <div className="album-error">{error}</div>}{notice && <div className="album-notice">{notice}</div>}
    {plan?.albums.map(candidate => <CandidateCard key={candidate.id} candidate={candidate} order={orders[candidate.id]||candidate.proposedTrackIds} setOrder={ids=>setOrders(current=>({...current,[candidate.id]:ids}))} typed={typed[candidate.id]||''} setTyped={value=>setTyped(current=>({...current,[candidate.id]:value}))} orderConfirmed={Boolean(orderConfirmed[candidate.id])} setOrderConfirmed={value=>setOrderConfirmed(current=>({...current,[candidate.id]:value}))} busy={busy===candidate.id} onApply={()=>apply(candidate)}/>)}
    {plan && <article className="panel album-migration-singles"><div><span className="eyebrow">SINGLES / LOCKED</span><h3>Singles stays transitional in C2.5-E</h3><p>{plan.singles.candidateCount} track{plan.singles.candidateCount===1?'':'s'} currently use the legacy Singles cache. They are <strong>not</strong> converted into a canonical Album here.</p><small>{plan.singles.reason}</small></div><span className="album-migration-state locked">FUTURE VIRTUAL COLLECTION</span></article>}
  </section>;
}
