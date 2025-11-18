// services/SingleOnboardService.ts

import { db, pool } from '@/db';
import {
  navisionCustomerMaster,
  navisionNotifyCustomer,
  navisionRetailMaster,
  navisionVendorMaster,
  navisionSalespersonList,
  retailer,
  distributor,
  userMaster,
  salesperson,
  onboardingLogs,
} from '../db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';


type OnboardType = 'retailer' | 'distributor' | 'salesperson';

interface OnboardResult {
  success: boolean;
  user_id?: number;
  retailer_id?: number;
  distributor_id?: number;
  salesperson_id?: number;
  message?: string;
  error?: string;
}

export class SingleOnboardService {
  private static readonly DEFAULT_PASSWORD = 'default@123';
  private static readonly SALT_ROUNDS = 10;

  private static async hashPassword(): Promise<string> {
    return bcrypt.hash(this.DEFAULT_PASSWORD, this.SALT_ROUNDS);
  }

  // Main public method
  static async onboardSingle(type: OnboardType, navisionId: string): Promise<OnboardResult> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let result: OnboardResult;

      switch (type) {
        case 'retailer':
          result = await this.onboardSingleRetailer(client, navisionId);
          break;
        case 'distributor':
          result = await this.onboardSingleDistributor(client, navisionId);
          break;
        case 'salesperson':
          result = await this.onboardSingleSalesperson(client, navisionId);
          break;
        default:
          throw new Error(`Invalid type: ${type}`);
      }

      console.log(result);

      if (result.success) {
        await client.query('COMMIT');
        console.log(`Successfully onboarded ${type}: ${navisionId}`);

        // Optionally run mapping & points sync for this user only
        //await this.runPostOnboardingSync(type, navisionId);

        return result;
      } else {
        await client.query('ROLLBACK');
        return result;
      }
    } catch (error: any) {
      await client.query('ROLLBACK');
      console.error(`Error onboarding ${type} ${navisionId}:`, error);
      return {
        success: false,
        error: error.message || 'Unknown error during onboarding',
      };
    } finally {
      client.release();
    }
  }

  // === Retailer Onboarding ===
  private static async onboardSingleRetailer(client: any, navisionId: string): Promise<OnboardResult> {
    // Search across all 3 Navision sources (priority: retail > customer > notify)
    const sources = [
      await db.select().from(navisionRetailMaster).where(eq(navisionRetailMaster.no, navisionId)).limit(1),
      await db.select().from(navisionCustomerMaster).where(eq(navisionCustomerMaster.no, navisionId)).limit(1),
      await db.select().from(navisionNotifyCustomer).where(eq(navisionNotifyCustomer.no, navisionId)).limit(1),
    ];

    const record = sources[0][0] || sources[1][0] || sources[2][0];
    if (!record) {
      return { success: false, error: `No record found for navisionId: ${navisionId}` };
    }

    const mobile = (record.whatsappNo ?? record.whatsappNo1 ?? record.whatsappMobileNumber ?? '').trim();
    if (!mobile) {
      return { success: false, error: `No WhatsApp/mobile number found for ${navisionId}` };
    }

    const existingUser = await db
      .select()
      .from(userMaster)
      .where(and(eq(userMaster.mobileNumber, mobile), eq(userMaster.userType, 'retailer')))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: true, user_id: existingUser[0].userId, message: 'Already onboarded' };
    }

    const passwordHash = await this.hashPassword();
    const username = (record.shopName ?? record.name ?? 'retailer_' + navisionId).trim();
    const shopName = (record.shopName ?? record.name ?? 'Unknown Shop').trim();

    console.log(record);

    const onboardResult = await client.query(
      `SELECT * FROM onboard_retailer($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
      [
        username,
        mobile,
        record.whatsappNo2 ?? null,
        passwordHash,
        shopName,
        record.address ?? record.shopAddress ?? null,
        record.pANNo ?? null,
        record.aadhaarNo ?? null,
        record.gstRegistrationNo ?? null,
        record.postCode ?? record.pinCode ?? null,
        record.city ?? null,
        record.stateCode ?? record.state ?? null,
        'retailer',
        'single-onboard',
        navisionId,
        null, // device_details
        null, // home_address
      ]
    );

    const result = onboardResult.rows[0];
    await db.insert(onboardingLogs).values({ refNo: navisionId, result });

    return result.onboard_retailer;
  }

  // === Distributor Onboarding ===
  private static async onboardSingleDistributor(client: any, navisionId: string): Promise<OnboardResult> {
    const vendor = await db
      .select()
      .from(navisionVendorMaster)
      .where(eq(navisionVendorMaster.no, navisionId))
      .limit(1);

    if (!vendor[0]) {
      return { success: false, error: `Distributor not found: ${navisionId}` };
    }

    const v = vendor[0];
    const mobile = v.whatsappNo || v.whatsappMobileNumber || '';
    if (!mobile) {
      return { success: false, error: 'No mobile number for distributor' };
    }

    const passwordHash = await this.hashPassword();

    const queryResult = await client.query(
      `SELECT * FROM onboard_distributor($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        v.name,
        mobile,
        v.whatsappMobileNumber || null,
        passwordHash,
        v.name,
        v.name,
        mobile,
        null,
        v.address || null,
        v.city || null,
        v.stateCode || null,
        v.postCode || null,
        'distributor',
        null,
        navisionId,
        {},
      ]
    );

    const result = queryResult.rows[0];
    await db.insert(onboardingLogs).values({ refNo: navisionId, result });

    // Mark as onboarded
    if (result.success) {
      await db
        .update(navisionVendorMaster)
        .set({ onboarded: true, onboardedAt: new Date().toISOString() })
        .where(eq(navisionVendorMaster.no, navisionId));
    }

    return result;
  }

  // === Salesperson Onboarding ===
  private static async onboardSingleSalesperson(client: any, code: string): Promise<OnboardResult> {
    const sp = await db
      .select()
      .from(navisionSalespersonList)
      .where(eq(navisionSalespersonList.code, code))
      .limit(1);

    if (!sp[0]) {
      return { success: false, error: `Salesperson not found: ${code}` };
    }

    const s = sp[0];
    const mobile = s.whatsappMobileNumber?.trim();
    if (!mobile) {
      return { success: false, error: 'No mobile number for salesperson' };
    }

    const existing = await db
      .select()
      .from(userMaster)
      .where(and(eq(userMaster.mobileNumber, mobile), eq(userMaster.userType, 'sales')))
      .limit(1);

    if (existing.length > 0) {
      return { success: true, user_id: existing[0].userId, message: 'Salesperson already onboarded' };
    }

    const insertUser = await db
      .insert(userMaster)
      .values({
        mobileNumber: mobile,
        userType: 'sales',
        roleId: 3,
        username: s.name,
      })
      .returning();

    const userId = insertUser[0].userId;

    await db.insert(salesperson).values({
      userId,
      salespersonName: s.name,
      state: s.state,
      pinCode: s.postCode,
      mobileNumber: mobile,
      address: s.address,
      address2: s.address2,
      city: s.city,
      navisionId: s.code,
    });

    await db
      .update(navisionSalespersonList)
      .set({ onboarded: true })
      .where(eq(navisionSalespersonList.code, code));

    await db.insert(onboardingLogs).values({
      refNo: code,
      result: { success: true, user_id: userId, message: 'Salesperson onboarded via single service' },
    });

    return { success: true, user_id: userId };
  }

  // === Post-onboarding sync (optional but recommended) ===
//   private static async runPostOnboardingSync(type: OnboardType, navisionId: string) {
//     try {
//       if (type === 'retailer') {
//         // Trigger mapping & points sync for this retailer only
//         const navService = new (require('./NavisionService').default)();
//         await navService.mapDist2(); // or just update this one retailer's distributor
//         await navService.totalPoints();
//         await navService.claimPoints();
//         await navService.balancePoints();
//       }

//       if (type === 'distributor') {
//         const navService = new (require('./NavisionService').default)();
//         await navService.distributorPoints();
//       }
//     } catch (error: any) {
//       console.warn(`Post-onboarding sync failed for ${type} ${navisionId}:`, error.message);
//       // Don't fail onboarding because of sync
//     }
//   }
}

// === Usage Example (e.g., in a route or cron) ===
// await SingleOnboardService.onboardSingle('retailer', 'RET001');
// await SingleOnboardService.onboardSingle('distributor', 'VEN123');
// await SingleOnboardService.onboardSingle('salesperson', 'SP001');

export default SingleOnboardService;