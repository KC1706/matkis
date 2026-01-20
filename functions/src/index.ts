import * as admin from 'firebase-admin';

admin.initializeApp();

// Export functions
export { getLeaderboard } from './leaderboard';
export { searchUsers } from './search';
export { seedUsers } from './seed';
