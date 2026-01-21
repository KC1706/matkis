import { Handler } from '@netlify/functions';
import { initializeFirebase, getFirestore } from './utils/firebase';
import { calculateRanksForUsers } from './utils/ranking';

export const handler: Handler = async (event, context) => {
  // Initialize Firebase Admin if not already initialized
  initializeFirebase();
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  try {
    const query = event.queryStringParameters?.q;

    if (!query || query.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "query parameter 'q' is required" }),
      };
    }

    // Prefix search: username >= query AND username < query + '\uf8ff'
    const searchQuery = query.trim().toLowerCase();
    const upperBound = searchQuery.slice(0, -1) + String.fromCharCode(searchQuery.charCodeAt(searchQuery.length - 1) + 1);

    const db = getFirestore();
    const snapshot = await db.collection('users')
      .where('username', '>=', searchQuery)
      .where('username', '<', upperBound)
      .limit(100)
      .get();

    if (snapshot.empty) {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [] }),
      };
    }

    // Get users with their ratings
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username as string,
      rating: doc.data().rating as number,
    }));

    // Calculate ranks for all users
    const rankMap = await calculateRanksForUsers(users);

    // Format response
    const results = users.map(user => ({
      global_rank: rankMap.get(user.id) || 0,
      username: user.username,
      rating: user.rating,
    }));

    // Sort by rank (ascending)
    results.sort((a, b) => a.global_rank - b.global_rank);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: results }),
    };
  } catch (error: any) {
    console.error('Error searching users:', error);
    
    // Check if it's a Firestore index error
    if (error.code === 9 || error.message?.includes('index')) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'Firestore index is building. Please wait a few minutes and try again.',
          details: error.message 
        }),
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
};
