import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const seedUsers = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const numUsers = parseInt(req.body.numUsers as string) || 10000;

    if (numUsers < 1 || numUsers > 50000) {
      res.status(400).json({ error: 'numUsers must be between 1 and 50000' });
      return;
    }

    const firstNames = [
      'rahul', 'brandon', 'cody', 'lee', 'leslie', 'wade', 'soham', 'brandie',
      'jorge', 'kristin', 'alex', 'sam', 'taylor', 'jordan', 'casey', 'riley',
      'avery', 'quinn', 'dakota', 'skyler', 'morgan', 'cameron', 'hayden',
      'logan', 'blake', 'sage', 'river', 'phoenix', 'rowan', 'finley',
    ];

    const lastNames = [
      'burman', 'mathur', 'kumar', 'singh', 'patel', 'sharma', 'gupta', 'verma',
      'reddy', 'rao', 'mehta', 'jain', 'agarwal', 'malik', 'kapoor', 'chopra',
      'nair', 'iyer', 'menon', 'krishnan', 'raman', 'sundaram',
    ];

    const batchSize = 500;
    let created = 0;
    const usernames = new Set<string>();

    // Generate unique usernames
    const generateUsername = (): string => {
      let username: string;
      let attempts = 0;
      
      do {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const rand = Math.random();
        
        if (rand < 0.3) {
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          username = `${firstName}_${lastName}`;
        } else if (rand < 0.5) {
          username = `${firstName}${Math.floor(Math.random() * 1000)}`;
        } else {
          username = firstName;
        }
        
        attempts++;
        if (attempts > 100) {
          username = `${firstName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
      } while (usernames.has(username) && attempts < 200);
      
      usernames.add(username);
      return username;
    };

    // Batch write users
    for (let i = 0; i < numUsers; i += batchSize) {
      const batch = db.batch();
      const currentBatch = Math.min(batchSize, numUsers - i);

      for (let j = 0; j < currentBatch; j++) {
        const username = generateUsername();
        const rating = 100 + Math.floor(Math.random() * 4901); // 100-5000
        const userId = `${Date.now()}_${i}_${j}`;
        const userRef = db.collection('users').doc(userId);

        batch.set(userRef, {
          username: username.toLowerCase(),
          rating: rating,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await batch.commit();
      created += currentBatch;

      if (created % 1000 === 0) {
        console.log(`Created ${created} users...`);
      }
    }

    res.json({
      message: `Successfully created ${created} users`,
      count: created,
    });
  } catch (error) {
    console.error('Error seeding users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
