CREATE TABLE "address" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "address_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"streetAddress" text NOT NULL,
	"postalCode" text NOT NULL,
	"userId" integer NOT NULL,
	"city" text NOT NULL,
	"phone" text NOT NULL,
	"country" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"name" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3),
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"userId" integer NOT NULL,
	"estimatedDeliveryTime" timestamp,
	"actualDeliveryTime" timestamp,
	"items" integer NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"discount" numeric(12, 2) DEFAULT '0',
	"totalPrice" numeric(12, 2) NOT NULL,
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "orderProductItem" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orderProductItem_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"orderId" integer NOT NULL,
	"productId" integer NOT NULL,
	"size" text NOT NULL,
	"colour" text NOT NULL,
	"quantity" integer NOT NULL,
	"itemPrice" numeric(12, 2) NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"comment" text,
	"createdAt" timestamp (3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orderStatus" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orderStatus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"orderId" integer NOT NULL,
	"statusCatalogId" integer NOT NULL,
	"createdAt" timestamp (3) DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"discountPrice" numeric DEFAULT '0',
	"countInStock" numeric NOT NULL,
	"sku" text NOT NULL,
	"categoryId" integer NOT NULL,
	"brand" text,
	"sizes" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"colours" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"collections" text NOT NULL,
	"material" text,
	"gender" text NOT NULL,
	"images" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"imageAlt" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"isFeatured" boolean DEFAULT false,
	"isPublished" boolean DEFAULT false,
	"rating" integer DEFAULT 0,
	"numberOfReviews" integer DEFAULT 0,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"metaTitle" text,
	"metaDescription" text,
	"metaKeywords" text,
	"dimensionsLength" numeric DEFAULT '0',
	"dimensionsWidth" numeric DEFAULT '0',
	"dimensionsHeight" numeric DEFAULT '0',
	"weight" numeric DEFAULT '0',
	"creatorIdd" integer NOT NULL,
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3),
	CONSTRAINT "products_name_unique" UNIQUE("name"),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "refreshTokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "refreshTokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"hashedToken" text NOT NULL,
	"userId" integer NOT NULL,
	"revoked" boolean DEFAULT false,
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3),
	"expireAt" timestamp,
	CONSTRAINT "refreshTokens_hashedToken_unique" UNIQUE("hashedToken")
);
--> statement-breakpoint
CREATE TABLE "statusCatalog" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "statusCatalog_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"name" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3),
	CONSTRAINT "statusCatalog_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"userImage" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'customer',
	"createdAt" timestamp (3) DEFAULT now(),
	"updatedAt" timestamp (3),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderProductItem" ADD CONSTRAINT "orderProductItem_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderProductItem" ADD CONSTRAINT "orderProductItem_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderStatus" ADD CONSTRAINT "orderStatus_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderStatus" ADD CONSTRAINT "orderStatus_statusCatalogId_statusCatalog_id_fk" FOREIGN KEY ("statusCatalogId") REFERENCES "public"."statusCatalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_creatorIdd_users_id_fk" FOREIGN KEY ("creatorIdd") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;