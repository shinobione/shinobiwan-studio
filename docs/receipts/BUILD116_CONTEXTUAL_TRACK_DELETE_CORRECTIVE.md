# Build116 corrective — contextual Track delete

Real-user smoke exposed a discoverability failure: Safe Track Delete existed only on the Tracks library surface, while the user was naturally inside the current Track workspace.

Corrective scope stays inside Build116 / v0.19.38:
- expose `Delete Track…` directly on every current Track page through the existing Track action/receipt surface;
- reread the exact current Track privately before enabling the destructive flow;
- require exact canonical Track ID typing plus a second destructive confirmation;
- reuse the existing Build116 `deleteAdminTrackResilient()` contract unchanged;
- preserve canonical Album ownership blocking, no implicit Album membership mutation, canonical absence verification, and zero blind retries;
- redirect to Tracks only after verified deletion.

No backend change and no Worker redeploy are required for this corrective.
