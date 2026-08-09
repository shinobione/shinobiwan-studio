# C2.5-A frontend dependency order

1. Merge and publish LRC Maker 6.3.7.
2. Verify `build/embed/lyrics-studio.js` Pages deployment.
3. Merge and publish Studio v0.10.8 / Build 30, which cache-busts the embed URL to 6.3.7.
4. LaunchPAD Build 71 may merge independently once its own CI is green.
5. Perform real-user smoke before declaring these refinements accepted.

No Worker deployment or R2 mutation belongs to this sequence.
