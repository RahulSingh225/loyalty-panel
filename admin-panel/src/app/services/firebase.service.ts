import * as admin from 'firebase-admin';

// Interface for Firebase configuration
interface FirebaseConfig {
  type: string;
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authUri: string;
  tokenUri: string;
  authProviderCertUrl: string;
  clientCertUrl: string;
  universeDomain: string;
}

// Interface for notification payload
interface NotificationPayload {
  title: string;
  body: string;
  imageUrl?: string;
  data?: { [key: string]: string };
  android?: {
    priority?: 'normal' | 'high';
    ttl?: number; // Time to live in seconds
    channelId?: string; // Notification channel ID for Android
  };
  ios?: {
    badge?: number;
    sound?: string;
    contentAvailable?: boolean; // For background updates
  };
}

// Interface for notification targets
interface NotificationTarget {
  type: 'single' | 'selected' | 'all';
  token?: string; // For single user
  tokens?: string[]; // For selected or all users
}


export const FIREBASE_CONFIG = {
  type: process.env.FIREBASE_TYPE,
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI,
  tokenUri: process.env.FIREBASE_TOKEN_URI,
  authProviderCertUrl: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  clientCertUrl: process.env.FIREBASE_CLIENT_CERT_URL,
  universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};
class FirebaseService {
  constructor(config: FirebaseConfig) {
    // Initialize Firebase Admin SDK if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(config),
      });
    }
  }

  // Verify Firebase ID token
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new Error('Failed to verify ID token');
    }
  }

  // Send notification to specified targets
  async sendNotification(payload: NotificationPayload, target: NotificationTarget): Promise<void> {
    try {
      let tokens: string[] = [];

      // Determine target tokens based on type
      switch (target.type) {
        case 'single':
          if (!target.token) {
            throw new Error('FCM token is required for single user notification');
          }
          tokens = [target.token];
          break;
        case 'selected':
          if (!target.tokens || target.tokens.length === 0) {
            throw new Error('At least one FCM token is required for selected users notification');
          }
          tokens = target.tokens;
          break;
        case 'all':
          if (!target.tokens || target.tokens.length === 0) {
            throw new Error('FCM tokens are required for all users notification');
          }
          tokens = target.tokens;
          break;
        default:
          throw new Error('Invalid target type');
      }

      // Construct FCM message
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data,
        android: payload.android
          ? {
              priority: payload.android.priority || 'high',
              ttl: payload.android.ttl || 3600, // 1 hour default
              notification: {
                channelId: payload.android.channelId || 'default_channel_id',
              },
            }
          : undefined,
        apns: payload.ios
          ? {
              payload: {
                aps: {
                  badge: payload.ios.badge || 0,
                  sound: payload.ios.sound || 'default',
                  'content-available': payload.ios.contentAvailable ? 1 : 0,
                },
              },
            }
          : undefined,
      };

      // Send notifications in batches (FCM supports up to 500 tokens per request)
      const batchSize = 500;
      for (let i = 0; i < tokens.length; i += batchSize) {
        const batchTokens = tokens.slice(i, i + batchSize);
        const batchMessage = { ...message, tokens: batchTokens };
        const response = await admin.messaging().sendEachForMulticast(batchMessage);

        // Handle response
        console.log(`Successfully sent to ${response.successCount} devices`);
        if (response.failureCount > 0) {
          console.error(`Failed to send to ${response.failureCount} devices`);
          response.responses.forEach((result, index) => {
            if (result.error) {
              console.error(`Error for token ${batchTokens[index]}:`, result.error.message);
              // Note: Caller should handle invalid tokens (e.g., remove from their storage)
            }
          });
        }
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }

  // Optional: Validate FCM token
  async validateToken(token: string): Promise<boolean> {
    try {
      await admin.messaging().send({
        token,
        data: { test: 'validation' },
      });
      return true;
    } catch (error) {
      console.error(`Invalid token ${token}:`, error);
      return false;
    }
  }
}

// Export singleton instance with FIREBASE_CONFIG
export const firebaseService = new FirebaseService(FIREBASE_CONFIG as FirebaseConfig);