import { Handler } from '@netlify/functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const numUsers = parseInt(body.numUsers || '10000');

    if (numUsers < 1 || numUsers > 50000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'numUsers must be between 1 and 50000' }),
      };
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

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Successfully created ${created} users`,
        count: created,
      }),
    };
  } catch (error: any) {
    console.error('Error seeding users:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
