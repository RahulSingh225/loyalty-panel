-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "schemedetails" (
	"id" serial PRIMARY KEY NOT NULL,
	"scheme_id" integer NOT NULL,
	"group_name" text NOT NULL,
	"multiplier" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_points_claim_transfer" (
	"document_no" varchar(50),
	"is_master" boolean,
	"line_no" integer,
	"entry_type" varchar(50),
	"line_type" varchar(50),
	"customer_no" varchar(50),
	"customer_name" varchar(100),
	"agent_code" varchar(50),
	"agent_name" varchar(100),
	"retailer_no" varchar(50),
	"retailer_name" varchar(100),
	"notify_customer" varchar(50),
	"notify_customer_name" varchar(100),
	"sales_person_code" varchar(50),
	"customer_posting_group" varchar(50),
	"status" varchar(20),
	"scheme" varchar(50),
	"sales_point" varchar(10),
	"quantity" numeric(20, 2),
	"quality_desc" varchar(50),
	"multiplier" numeric(20, 2),
	"etag" varchar(100),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"doc_line_no" text NOT NULL,
	CONSTRAINT "document_line_no" UNIQUE("doc_line_no")
);
--> statement-breakpoint
CREATE TABLE "sales_point_ledger_entry" (
	"entry_no" integer,
	"document_type" varchar(50),
	"document_no" varchar(50),
	"customer_no" varchar(50),
	"customer_name" varchar(100),
	"notify_customer_no" varchar(50),
	"notify_customer_name" varchar(100),
	"agent_code" varchar(50),
	"agent_name" varchar(100),
	"retailer_no" varchar(50),
	"retailer_name" varchar(100),
	"scheme" varchar(50),
	"sales_points" numeric,
	"customer_is_agent" boolean,
	"etag" varchar(100),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"quantity" numeric,
	"item_group" text,
	CONSTRAINT "sales_point_ledger_entry_entry_no_key" UNIQUE("entry_no")
);
--> statement-breakpoint
CREATE TABLE "navision_salesperson_list" (
	"code" varchar(50),
	"name" varchar(100),
	"address" varchar(255),
	"address_2" varchar(255),
	"city" varchar(100),
	"state" varchar(100),
	"post_code" varchar(20),
	"whatsapp_mobile_number" varchar(20),
	"etag" varchar(500),
	"onboarded" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"onboardedAt" timestamp with time zone,
	CONSTRAINT "navision_salesperson_list_whatsapp_mobile_number_key" UNIQUE("whatsapp_mobile_number")
);
--> statement-breakpoint
CREATE TABLE "navision_notify_customer" (
	"no" varchar(50),
	"name" varchar(100),
	"address" varchar(255),
	"address_2" varchar(255),
	"city" varchar(100),
	"post_code" varchar(20),
	"state_code" varchar(50),
	"country_region_code" varchar(50),
	"whatsapp_no" varchar(20),
	"whatsapp_no_2" varchar(20),
	"sales_agent" varchar(50),
	"sales_agent_name" varchar(100),
	"sales_person" varchar(50),
	"agent_code_visibility" boolean,
	"p_a_n_no" varchar(50),
	"gst_registration_no" varchar(50),
	"etag" varchar(500),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"onboarded" boolean DEFAULT false NOT NULL,
	"onboardedAt" timestamp with time zone,
	CONSTRAINT "navision_notify_customer_no_key" UNIQUE("no")
);
--> statement-breakpoint
CREATE TABLE "retailer_reward_point_entry" (
	"entry_no" integer,
	"entry_date" timestamp,
	"purchase_from_vendor_no" varchar(50),
	"status" varchar(50),
	"scheme" varchar(50),
	"agent_code" varchar(50),
	"agent_name" varchar(100),
	"party_no" varchar(50),
	"party_name" varchar(100),
	"document_no" varchar(50),
	"whatsapp_no" varchar(20),
	"whatsapp_no_2" varchar(20),
	"courier_name" varchar(50),
	"gift_article_name" varchar(100),
	"qty" integer,
	"etag" varchar(100),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "retailer_reward_point_entry_entry_no_key" UNIQUE("entry_no")
);
--> statement-breakpoint
CREATE TABLE "app_settings" (
	"setting_id" serial PRIMARY KEY NOT NULL,
	"app_name" varchar(255) NOT NULL,
	"short_description" varchar(255),
	"company_logo_url" varchar(255),
	"theme_color" varchar(50),
	"getting_started_image_url" varchar(255),
	"primary_color" varchar(20),
	"secondary_color" varchar(20),
	"language" varchar(50),
	"font" varchar(50),
	"banner_image_url" varchar(255),
	"home_image_url" varchar(255),
	"landing_image_url" varchar(255),
	"resource_base_url" varchar(255),
	"api_base_url" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "content_management" (
	"content_id" serial PRIMARY KEY NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"content" text,
	"image_pdf_url" varchar(255),
	"last_updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "distributor" (
	"distributor_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"distributor_name" varchar(255) NOT NULL,
	"contact_person" varchar(255),
	"phone_number" varchar(20),
	"email" varchar(255),
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"zip_code" varchar(20),
	"gst_number" varchar(15),
	"navision_id" varchar(100),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"total_points" integer DEFAULT 0,
	"balance_points" integer DEFAULT 0,
	"consumed_points" integer DEFAULT 0,
	CONSTRAINT "distributor_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "distributor_navision_id_key" UNIQUE("navision_id")
);
--> statement-breakpoint
CREATE TABLE "media_links" (
	"link_id" serial PRIMARY KEY NOT NULL,
	"platform_name" varchar(100) NOT NULL,
	"link_url" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "media_links_platform_name_key" UNIQUE("platform_name")
);
--> statement-breakpoint
CREATE TABLE "gifts" (
	"gift_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gifts_gift_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"gift_name" text,
	"image_url" text,
	"unique_id" text,
	"is_active" boolean,
	"value" integer
);
--> statement-breakpoint
CREATE TABLE "navision_customer_master" (
	"No" varchar(20) PRIMARY KEY NOT NULL,
	"Name" varchar(100),
	"Address" varchar(100),
	"Address_2" varchar(100),
	"City" varchar(50),
	"Post_Code" varchar(20),
	"State_Code" varchar(10),
	"Country_Region_Code" varchar(10),
	"Whatsapp_No_1" varchar(15),
	"Whatsapp_No_2" varchar(15),
	"P_A_N_No" varchar(20),
	"GST_Registration_No" varchar(20),
	"Sales_Agent" varchar(20),
	"Sales_Agent_Name" varchar(100),
	"Salesperson_Code" varchar(20),
	"ETag" varchar(500),
	"CreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"Onboarded" boolean DEFAULT false,
	"OnboardedAt" timestamp,
	CONSTRAINT "customer_unique" UNIQUE("No")
);
--> statement-breakpoint
CREATE TABLE "navision_vendor_master" (
	"No" varchar(20) PRIMARY KEY NOT NULL,
	"Name" varchar(100),
	"Address" varchar(100),
	"Address_2" varchar(100),
	"City" varchar(50),
	"Post_Code" varchar(20),
	"State_Code" varchar(10),
	"Country_Region_Code" varchar(10),
	"Whatsapp_No" varchar(15),
	"Whatsapp_Mobile_Number" varchar(15),
	"P_A_N_No" varchar(20),
	"GST_Registration_No" varchar(20),
	"Beat_Name" varchar(50),
	"Sales_Agent_Customer" varchar(20),
	"Point_Claim_Customer_Type" varchar(50),
	"OGS" boolean,
	"Gujarat" boolean,
	"ETag" varchar(500),
	"CreatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"Onboarded" boolean DEFAULT false,
	"OnboardedAt" timestamp with time zone,
	CONSTRAINT "vendor_unique" UNIQUE("No")
);
--> statement-breakpoint
CREATE TABLE "redemption_request" (
	"request_id" serial PRIMARY KEY NOT NULL,
	"redemption_id" varchar(100) NOT NULL,
	"user_id" integer,
	"distributor_id" integer,
	"method" varchar(50) NOT NULL,
	"points_redeemed" numeric NOT NULL,
	"points_value" numeric(10, 2),
	"monetary_value" numeric(10, 2),
	"request_date" timestamp DEFAULT CURRENT_TIMESTAMP,
	"status" varchar(100) DEFAULT 'pending',
	"payment_cleared" boolean DEFAULT false,
	"fulfillment_details" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"delivery_address" text,
	"quantity" numeric,
	"reward" text,
	"reward_id" integer,
	"navision_id" text,
	"retailer_code" text,
	"distributor_code" text,
	"document_no" text,
	CONSTRAINT "entry_no_navision_id" UNIQUE("navision_id")
);
--> statement-breakpoint
CREATE TABLE "point_allocation_log" (
	"allocation_id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer,
	"source_user_id" integer,
	"target_user_id" integer NOT NULL,
	"points_allocated" integer NOT NULL,
	"allocation_date" timestamp DEFAULT CURRENT_TIMESTAMP,
	"allocation_method" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'success',
	"admin_approved_by" integer,
	"admin_approval_date" timestamp,
	"description" text,
	"details" json[]
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"permission_id" serial PRIMARY KEY NOT NULL,
	"permission_name" varchar(100) NOT NULL,
	CONSTRAINT "permissions_permission_name_key" UNIQUE("permission_name")
);
--> statement-breakpoint
CREATE TABLE "schemes" (
	"scheme_id" integer PRIMARY KEY NOT NULL,
	"scheme_name" text NOT NULL,
	"scheme_resourcee" text NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"applicable_roles" integer[],
	"start_date" date,
	"end_date" date,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"transaction_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"transaction_type" varchar(50) NOT NULL,
	"points_amount" integer NOT NULL,
	"transaction_date" timestamp DEFAULT CURRENT_TIMESTAMP,
	"reference_id" integer,
	"reference_table" varchar(50),
	"description" text
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar(50) NOT NULL,
	CONSTRAINT "user_roles_role_name_key" UNIQUE("role_name")
);
--> statement-breakpoint
CREATE TABLE "notification_log" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"template_id" integer,
	"channel_used" varchar(50) NOT NULL,
	"message_content" text NOT NULL,
	"sent_status" varchar(50) NOT NULL,
	"sent_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"response_data" text
);
--> statement-breakpoint
CREATE TABLE "retailer" (
	"retailer_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"distributor_id" integer,
	"shop_name" varchar(255) NOT NULL,
	"shop_address" text,
	"pin_code" varchar(20),
	"city" varchar(100),
	"state" varchar(100),
	"whatsapp_no" varchar(20),
	"pan_no" varchar(20),
	"gst_registration_no" varchar(50),
	"aadhaar_card_no" varchar(20),
	"navision_id" varchar(100),
	"onboarding_status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"total_points" numeric(15, 2) DEFAULT '0',
	"balance_points" numeric(15, 2) DEFAULT '0',
	"consumed_points" numeric(15, 2) DEFAULT '0',
	"home_address" text,
	"work_address" text,
	"beat_name" text,
	"retailer_code" text,
	"sales_agent_codee" text,
	"sales_agent_namee" text,
	"sales_agent_id" integer,
	CONSTRAINT "Retailer_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "salesperson" (
	"salesperson_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"salesperson_name" varchar(255) NOT NULL,
	"distributor_id" integer,
	"navision_id" varchar(100),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"address" text,
	"address_2" text,
	"city" text,
	"state" text,
	"pin_code" text,
	"mobile_number" text,
	CONSTRAINT "salesperson_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "salesperson_navision_id_key" UNIQUE("navision_id")
);
--> statement-breakpoint
CREATE TABLE "user_master" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	"mobile_number" varchar(20) NOT NULL,
	"secondary_mobile_number" varchar(20),
	"user_type" varchar(50) NOT NULL,
	"role_id" integer,
	"is_active" boolean DEFAULT true,
	"bank_account_name" varchar(255),
	"account_number" varchar(50),
	"ifsc_code" varchar(20),
	"upi" varchar(100),
	"total_points" numeric(15, 2) DEFAULT '0',
	"balance_points" numeric(15, 2) DEFAULT '0',
	"redeemed_points" numeric(15, 2) DEFAULT '0',
	"fcm_token" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_login_at" timestamp,
	"device_details" jsonb,
	CONSTRAINT "user_master_email_key" UNIQUE("email"),
	CONSTRAINT "user_master_mobile_number_key" UNIQUE("mobile_number"),
	CONSTRAINT "user_master_secondary_mobile_number_key" UNIQUE("secondary_mobile_number")
);
--> statement-breakpoint
CREATE TABLE "navision_retail_master" (
	"No" varchar(20) PRIMARY KEY NOT NULL,
	"Address_2" varchar(100),
	"City" varchar(50),
	"Country_Region_Code" varchar(10),
	"Whatsapp_No" varchar(15),
	"P_A_N_No" varchar(20),
	"GST_Registration_No" varchar(30),
	"Beat_Name" varchar(50),
	"Gujarat" boolean,
	"ETag" varchar(500),
	"CreatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
	"Onboarded" boolean DEFAULT false,
	"OnboardedAt" timestamp,
	"Shop_Name" varchar(100),
	"Shop_Address" varchar(100),
	"Pin_Code" varchar(20),
	"State" varchar(20),
	"Whatsapp_No_2" varchar(15),
	"Agent_Name" varchar(100),
	"Supply_From" varchar(50),
	"Aadhaar_No" varchar(20),
	"Sales_Person_Code" varchar(20),
	"Sales_Person_Name" varchar(100),
	"Agent_Code" varchar(20),
	CONSTRAINT "retail_unique" UNIQUE("No")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "role_permissions_pkey" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
ALTER TABLE "distributor" ADD CONSTRAINT "distributor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_master"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_request" ADD CONSTRAINT "redemption_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_master"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_allocation_log" ADD CONSTRAINT "point_allocation_log_admin_approved_by_fkey" FOREIGN KEY ("admin_approved_by") REFERENCES "public"."user_master"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_allocation_log" ADD CONSTRAINT "point_allocation_log_source_user_id_fkey" FOREIGN KEY ("source_user_id") REFERENCES "public"."user_master"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "point_allocation_log" ADD CONSTRAINT "point_allocation_log_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "public"."user_master"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_master"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_master"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retailer" ADD CONSTRAINT "Retailer_distributor_id_fkey" FOREIGN KEY ("distributor_id") REFERENCES "public"."distributor"("distributor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retailer" ADD CONSTRAINT "Retailer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_master"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesperson" ADD CONSTRAINT "salesperson_distributor_id_fkey" FOREIGN KEY ("distributor_id") REFERENCES "public"."distributor"("distributor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salesperson" ADD CONSTRAINT "salesperson_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_master"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_master" ADD CONSTRAINT "user_master_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."user_roles"("role_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("permission_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."user_roles"("role_id") ON DELETE no action ON UPDATE no action;
*/