CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PLACED', 'PROCESSING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CheckoutIdempotencyState" AS ENUM ('PROCESSING', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(254) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "display_name" VARCHAR(100),
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hmac" BYTEA NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(4000) NOT NULL,
    "price_minor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "product_id" UUID NOT NULL,
    "quantity" BIGINT NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "version" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cart_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PLACED',
    "total_minor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "placed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processing_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "product_name_snapshot" VARCHAR(120) NOT NULL,
    "unit_price_minor" BIGINT NOT NULL,
    "quantity" BIGINT NOT NULL,
    "line_total_minor" BIGINT NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_idempotencies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "key_hmac" BYTEA NOT NULL,
    "cart_version" BIGINT NOT NULL,
    "state" "CheckoutIdempotencyState" NOT NULL DEFAULT 'PROCESSING',
    "order_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "checkout_idempotencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_token_hmac_key" ON "auth_sessions"("token_hmac");

-- CreateIndex
CREATE INDEX "auth_sessions_user_expiry_idx" ON "auth_sessions"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "auth_sessions_expiry_cleanup_idx" ON "auth_sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE INDEX "cart_items_cart_id_id_idx" ON "cart_items"("cart_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_product_key" ON "cart_items"("cart_id", "product_id");

-- CreateIndex
CREATE INDEX "orders_user_history_idx" ON "orders"("user_id", "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "orders_admin_status_idx" ON "orders"("status", "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "orders_created_at_id_idx" ON "orders"("created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "order_items_order_id_id_idx" ON "order_items"("order_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_order_product_key" ON "order_items"("order_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "checkout_idempotencies_order_id_key" ON "checkout_idempotencies"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "checkout_idempotencies_user_key_hmac_key" ON "checkout_idempotencies"("user_id", "key_hmac");

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_idempotencies" ADD CONSTRAINT "checkout_idempotencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_idempotencies" ADD CONSTRAINT "checkout_idempotencies_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- PostgreSQL facilities and SQL-level invariants not represented by Prisma schema.
ALTER TABLE "users"
  ADD CONSTRAINT "users_email_normalized_check" CHECK ("email" = lower(btrim("email")) AND char_length(btrim("email")) > 0),
  ADD CONSTRAINT "users_display_name_normalized_check" CHECK ("display_name" IS NULL OR ("display_name" = btrim("display_name") AND char_length("display_name") BETWEEN 1 AND 100));

ALTER TABLE "auth_sessions"
  ADD CONSTRAINT "auth_sessions_expiry_after_creation_check" CHECK ("expires_at" > "created_at");

ALTER TABLE "categories"
  ADD CONSTRAINT "categories_name_normalized_check" CHECK ("name" = btrim("name") AND char_length(btrim("name")) > 0);

ALTER TABLE "products"
  ADD CONSTRAINT "products_name_normalized_check" CHECK ("name" = btrim("name") AND char_length(btrim("name")) > 0),
  ADD CONSTRAINT "products_description_normalized_check" CHECK ("description" = btrim("description") AND char_length(btrim("description")) > 0),
  ADD CONSTRAINT "products_price_minor_positive_check" CHECK ("price_minor" > 0),
  ADD CONSTRAINT "products_currency_usd_check" CHECK ("currency" = 'USD');

ALTER TABLE "inventories"
  ADD CONSTRAINT "inventories_quantity_nonnegative_check" CHECK ("quantity" >= 0);

ALTER TABLE "carts"
  ADD CONSTRAINT "carts_version_nonnegative_check" CHECK ("version" >= 0);

ALTER TABLE "cart_items"
  ADD CONSTRAINT "cart_items_quantity_positive_check" CHECK ("quantity" > 0);

ALTER TABLE "orders"
  ADD CONSTRAINT "orders_total_minor_positive_check" CHECK ("total_minor" > 0),
  ADD CONSTRAINT "orders_currency_usd_check" CHECK ("currency" = 'USD'),
  ADD CONSTRAINT "orders_status_dates_check" CHECK (
    ("status" = 'PLACED' AND "processing_at" IS NULL AND "completed_at" IS NULL) OR
    ("status" = 'PROCESSING' AND "processing_at" IS NOT NULL AND "processing_at" >= "placed_at" AND "completed_at" IS NULL) OR
    ("status" = 'COMPLETED' AND "processing_at" IS NOT NULL AND "completed_at" IS NOT NULL AND "processing_at" >= "placed_at" AND "completed_at" >= "processing_at")
  );

ALTER TABLE "order_items"
  ADD CONSTRAINT "order_items_snapshot_name_normalized_check" CHECK ("product_name_snapshot" = btrim("product_name_snapshot") AND char_length(btrim("product_name_snapshot")) > 0),
  ADD CONSTRAINT "order_items_unit_price_minor_positive_check" CHECK ("unit_price_minor" > 0),
  ADD CONSTRAINT "order_items_quantity_positive_check" CHECK ("quantity" > 0),
  ADD CONSTRAINT "order_items_line_total_minor_check" CHECK ("line_total_minor" = "unit_price_minor" * "quantity"),
  ADD CONSTRAINT "order_items_currency_usd_check" CHECK ("currency" = 'USD');

ALTER TABLE "checkout_idempotencies"
  ADD CONSTRAINT "checkout_idempotencies_cart_version_nonnegative_check" CHECK ("cart_version" >= 0),
  ADD CONSTRAINT "checkout_idempotencies_state_completion_check" CHECK (
    ("state" = 'PROCESSING' AND "order_id" IS NULL AND "completed_at" IS NULL) OR
    ("state" = 'COMPLETED' AND "order_id" IS NOT NULL AND "completed_at" IS NOT NULL)
  );

CREATE UNIQUE INDEX "categories_name_normalized_key" ON "categories" (lower("name"));
CREATE INDEX "categories_active_name_id_idx" ON "categories" ("name", "id") WHERE "is_active";
CREATE INDEX "products_active_category_created_id_idx" ON "products" ("category_id", "created_at" DESC, "id" DESC) WHERE "is_active";
CREATE INDEX "products_active_created_id_idx" ON "products" ("created_at" DESC, "id" DESC) WHERE "is_active";