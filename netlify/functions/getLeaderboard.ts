import { Handler } from '@netlify/functions';
import { initializeFirebase } from './utils/firebase';
import { getLeaderboardEntries } from './utils/ranking';

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
    const page = parseInt(event.queryStringParameters?.page || '1');
    const limit = parseInt(event.queryStringParameters?.limit || '50');

    if (page < 1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Page must be >= 1' }),
      };
    }

    if (limit < 1 || limit > 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Limit must be between 1 and 100' }),
      };
    }

    const offset = (page - 1) * limit;
    const entries = await getLeaderboardEntries(limit, offset);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: entries,
        page,
        limit,
      }),
    };
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    
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
