


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."stock_out_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" numeric NOT NULL,
    "selling_price" numeric NOT NULL,
    "customer_id" "uuid",
    "invoice_number" "text",
    "entry_date" "date" DEFAULT CURRENT_DATE,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."stock_out_entries" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_stock_out_transaction"("p_business_id" "uuid", "p_product_id" "uuid", "p_quantity" numeric, "p_selling_price" numeric, "p_customer_id" "uuid" DEFAULT NULL::"uuid", "p_invoice_number" "text" DEFAULT NULL::"text", "p_entry_date" "date" DEFAULT CURRENT_DATE) RETURNS "public"."stock_out_entries"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_remaining numeric := p_quantity;
  v_deduct numeric;
  v_batch record;
  v_result public.stock_out_entries;
BEGIN

  -- Basic validation
  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'Stock out quantity must be greater than zero';
  END IF;

  -- Process batches FIFO.
  -- FOR UPDATE locks the rows during this transaction.
  FOR v_batch IN
    SELECT
      id,
      quantity_available
    FROM public.inventory_batches
    WHERE business_id = p_business_id
      AND product_id = p_product_id
      AND status = 'ACTIVE'
      AND quantity_available > 0
    ORDER BY created_at ASC
    FOR UPDATE
  LOOP

    EXIT WHEN v_remaining <= 0;

    v_deduct := LEAST(
      v_remaining,
      v_batch.quantity_available
    );

    UPDATE public.inventory_batches
    SET
      quantity_available =
        quantity_available - v_deduct,
      status =
        CASE
          WHEN quantity_available - v_deduct <= 0
            THEN 'DEPLETED'
          ELSE 'ACTIVE'
        END,
      updated_at = NOW()
    WHERE id = v_batch.id;

    v_remaining := v_remaining - v_deduct;

  END LOOP;

  -- Never create the sale if inventory was insufficient.
  IF v_remaining > 0 THEN
    RAISE EXCEPTION 'Insufficient batch quantity';
  END IF;

  -- Create the stock-out transaction.
  INSERT INTO public.stock_out_entries (
    business_id,
    product_id,
    quantity,
    selling_price,
    customer_id,
    invoice_number,
    entry_date
  )
  VALUES (
    p_business_id,
    p_product_id,
    p_quantity,
    p_selling_price,
    p_customer_id,
    p_invoice_number,
    p_entry_date
  )
  RETURNING * INTO v_result;

  RETURN v_result;

END;
$$;


ALTER FUNCTION "public"."create_stock_out_transaction"("p_business_id" "uuid", "p_product_id" "uuid", "p_quantity" numeric, "p_selling_price" numeric, "p_customer_id" "uuid", "p_invoice_number" "text", "p_entry_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_workspace_onboarding"("p_user_id" "uuid", "p_business_name" "text", "p_country" "text", "p_currency" "text", "p_phone" "text", "p_email" "text", "p_industry_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$

DECLARE

    new_workspace_id uuid;

BEGIN


    -- Create Profile
    INSERT INTO public.profiles
    (
        id,
        full_name,
        phone,
        created_at,
        updated_at
    )
    VALUES
    (
        p_user_id,
        p_business_name,
        p_phone,
        now(),
        now()
    )
    ON CONFLICT (id)
    DO UPDATE SET
        phone = EXCLUDED.phone,
        updated_at = now();



    -- Create Workspace
    INSERT INTO public.workspaces
    (
        name,
        slug,
        owner_id,
        industry_id,
        status
    )
    VALUES
    (
        p_business_name,
        lower(regexp_replace(p_business_name, '[^a-zA-Z0-9]+', '-', 'g')),
        p_user_id,
        p_industry_id,
        'ACTIVE'
    )
    RETURNING id INTO new_workspace_id;



    -- Create Organization
    INSERT INTO public.organizations
    (
        workspace_id,
        name,
        legal_name,
        country,
        currency,
        phone,
        email
    )
    VALUES
    (
        new_workspace_id,
        p_business_name,
        p_business_name,
        p_country,
        p_currency,
        p_phone,
        p_email
    );



    -- Create Owner Membership
    INSERT INTO public.user_workspaces
    (
        workspace_id,
        user_id,
        role
    )
    VALUES
    (
        new_workspace_id,
        p_user_id,
        'OWNER'
    );



    -- Install Industry Modules
    INSERT INTO public.workspace_modules
    (
        workspace_id,
        module_id,
        enabled,
        installed_at,
        installed_by,
        updated_at
    )

    SELECT
        new_workspace_id,
        im.module_id,
        true,
        now(),
        p_user_id,
        now()

    FROM public.industry_modules im

    WHERE im.industry_id = p_industry_id;



    RETURN new_workspace_id;


END;

$$;


ALTER FUNCTION "public"."create_workspace_onboarding"("p_user_id" "uuid", "p_business_name" "text", "p_country" "text", "p_currency" "text", "p_phone" "text", "p_email" "text", "p_industry_id" "uuid") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Businesses" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_name" "text" NOT NULL,
    "owner_name" "text" NOT NULL,
    "mobile" "text",
    "email" "text",
    "address" "text",
    "gst_number" "text",
    "status" "text" NOT NULL
);


ALTER TABLE "public"."Businesses" OWNER TO "postgres";


ALTER TABLE "public"."Businesses" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Businesses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."batch_consumptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "batch_id" "uuid" NOT NULL,
    "stock_out_entry_id" "uuid" NOT NULL,
    "quantity" numeric(14,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."batch_consumptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "customer_name" "text" NOT NULL,
    "mobile" "text",
    "email" "text",
    "address" "text",
    "status" "text" NOT NULL
);


ALTER TABLE "public"."customers" OWNER TO "postgres";


ALTER TABLE "public"."customers" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."customers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."industries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "description" "text",
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."industries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."industry_modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "industry_id" "uuid" NOT NULL,
    "module_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."industry_modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inventory_batches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "stock_entry_id" bigint,
    "batch_number" "text" NOT NULL,
    "manufacturing_date" "date",
    "expiry_date" "date",
    "quantity_received" numeric(14,2) DEFAULT 0 NOT NULL,
    "quantity_available" numeric(14,2) DEFAULT 0 NOT NULL,
    "purchase_price" numeric(14,2) DEFAULT 0 NOT NULL,
    "status" "text" DEFAULT 'ACTIVE'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "inventory_batches_status_check" CHECK (("status" = ANY (ARRAY['ACTIVE'::"text", 'DEPLETED'::"text", 'EXPIRED'::"text", 'ARCHIVED'::"text"])))
);


ALTER TABLE "public"."inventory_batches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "description" "text",
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "legal_name" "text",
    "country" "text",
    "currency" "text",
    "phone" "text",
    "email" "text",
    "address" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."organizations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_status" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sale_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "quantity" numeric NOT NULL,
    "selling_price" numeric NOT NULL,
    "total" numeric NOT NULL
);


ALTER TABLE "public"."payment_status" OWNER TO "postgres";


ALTER TABLE "public"."payment_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."payment_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "product_name" "text" NOT NULL,
    "sku" "text" NOT NULL,
    "category" "text",
    "unit" "text",
    "purchase_price" numeric DEFAULT 0 NOT NULL,
    "selling_price" numeric DEFAULT 0 NOT NULL,
    "minimum_stock" numeric DEFAULT 0 NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "description" "text",
    "barcode" "text",
    "brand" "text",
    "tax_rate" numeric DEFAULT 0,
    "image_url" "text",
    "track_inventory" boolean DEFAULT true,
    "batch_required" boolean DEFAULT false,
    "expiry_required" boolean DEFAULT false,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "phone" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."purchase_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "purchase_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" numeric NOT NULL,
    "purchase_price" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."purchase_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."purchases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "supplier_id" "uuid" NOT NULL,
    "invoice_number" "text",
    "purchase_date" "date" DEFAULT CURRENT_DATE,
    "total_amount" numeric DEFAULT 0,
    "payment_status" "text" DEFAULT 'Pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."purchases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sales" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" DEFAULT "gen_random_uuid"(),
    "invoice_number" "text" NOT NULL,
    "sale_date" "date" NOT NULL,
    "total_amount" numeric NOT NULL,
    "payment_method" "text" NOT NULL,
    "payment_status" "text" NOT NULL
);


ALTER TABLE "public"."sales" OWNER TO "postgres";


ALTER TABLE "public"."sales" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."sales_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."stock_adjustments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer NOT NULL,
    "adjustment_type" "text" NOT NULL,
    "reason" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."stock_adjustments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stock_entries" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "supplier_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "quantity" numeric NOT NULL,
    "purchase_price" numeric NOT NULL,
    "invoice_number" "text",
    "entry_date" "date" NOT NULL
);


ALTER TABLE "public"."stock_entries" OWNER TO "postgres";


ALTER TABLE "public"."stock_entries" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."stock_entries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."suppliers" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "supplier_name" "text" NOT NULL,
    "mobile" "text",
    "email" "text",
    "address" "text",
    "gst_number" "text",
    "status" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."suppliers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_workspaces" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'owner'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_workspaces" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "mobile" "text",
    "email" "text" NOT NULL,
    "role" "text" NOT NULL,
    "status" "text" NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE "public"."users" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."workspace_modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "module_id" "uuid" NOT NULL,
    "enabled" boolean DEFAULT true NOT NULL,
    "installed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "installed_by" "uuid",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."workspace_modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workspaces" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "industry_id" "uuid"
);


ALTER TABLE "public"."workspaces" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Businesses"
    ADD CONSTRAINT "Businesses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."batch_consumptions"
    ADD CONSTRAINT "batch_consumptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."industries"
    ADD CONSTRAINT "industries_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."industries"
    ADD CONSTRAINT "industries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."industry_modules"
    ADD CONSTRAINT "industry_modules_industry_id_module_id_key" UNIQUE ("industry_id", "module_id");



ALTER TABLE ONLY "public"."industry_modules"
    ADD CONSTRAINT "industry_modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventory_batches"
    ADD CONSTRAINT "inventory_batches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."modules"
    ADD CONSTRAINT "modules_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."modules"
    ADD CONSTRAINT "modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_status"
    ADD CONSTRAINT "payment_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchase_items"
    ADD CONSTRAINT "purchase_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchases"
    ADD CONSTRAINT "purchases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stock_adjustments"
    ADD CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stock_entries"
    ADD CONSTRAINT "stock_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stock_out_entries"
    ADD CONSTRAINT "stock_out_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."suppliers"
    ADD CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_workspaces"
    ADD CONSTRAINT "user_workspaces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_workspaces"
    ADD CONSTRAINT "user_workspaces_workspace_id_user_id_key" UNIQUE ("workspace_id", "user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workspace_modules"
    ADD CONSTRAINT "workspace_modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workspace_modules"
    ADD CONSTRAINT "workspace_modules_workspace_id_module_id_key" UNIQUE ("workspace_id", "module_id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_slug_key" UNIQUE ("slug");



CREATE INDEX "idx_batch_consumptions_batch" ON "public"."batch_consumptions" USING "btree" ("batch_id");



CREATE INDEX "idx_batch_consumptions_stock_out" ON "public"."batch_consumptions" USING "btree" ("stock_out_entry_id");



CREATE INDEX "idx_inventory_batches_business" ON "public"."inventory_batches" USING "btree" ("business_id");



CREATE INDEX "idx_inventory_batches_expiry" ON "public"."inventory_batches" USING "btree" ("expiry_date");



CREATE INDEX "idx_inventory_batches_product" ON "public"."inventory_batches" USING "btree" ("product_id");



CREATE INDEX "idx_inventory_batches_status" ON "public"."inventory_batches" USING "btree" ("status");



CREATE UNIQUE INDEX "idx_inventory_batches_unique" ON "public"."inventory_batches" USING "btree" ("business_id", "product_id", "batch_number");



ALTER TABLE ONLY "public"."batch_consumptions"
    ADD CONSTRAINT "batch_consumptions_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."inventory_batches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."batch_consumptions"
    ADD CONSTRAINT "batch_consumptions_stock_out_entry_id_fkey" FOREIGN KEY ("stock_out_entry_id") REFERENCES "public"."stock_out_entries"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."industry_modules"
    ADD CONSTRAINT "industry_modules_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."industry_modules"
    ADD CONSTRAINT "industry_modules_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inventory_batches"
    ADD CONSTRAINT "inventory_batches_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inventory_batches"
    ADD CONSTRAINT "inventory_batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inventory_batches"
    ADD CONSTRAINT "inventory_batches_stock_entry_id_fkey" FOREIGN KEY ("stock_entry_id") REFERENCES "public"."stock_entries"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stock_entries"
    ADD CONSTRAINT "stock_entries_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stock_out_entries"
    ADD CONSTRAINT "stock_out_entries_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



ALTER TABLE ONLY "public"."user_workspaces"
    ADD CONSTRAINT "user_workspaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_workspaces"
    ADD CONSTRAINT "user_workspaces_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspace_modules"
    ADD CONSTRAINT "workspace_modules_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspace_modules"
    ADD CONSTRAINT "workspace_modules_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspaces_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Allow batch insert" ON "public"."inventory_batches" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow batch select" ON "public"."inventory_batches" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow batch update" ON "public"."inventory_batches" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow delete stock out" ON "public"."stock_out_entries" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Allow insert stock out" ON "public"."stock_out_entries" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow select stock out" ON "public"."stock_out_entries" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow stock adjustment insert" ON "public"."stock_adjustments" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow stock adjustment read" ON "public"."stock_adjustments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow update stock out" ON "public"."stock_out_entries" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can view modules" ON "public"."modules" FOR SELECT USING (true);



ALTER TABLE "public"."Businesses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can create business stock entries" ON "public"."stock_entries" FOR INSERT WITH CHECK (("business_id" IN ( SELECT "o"."id"
   FROM "public"."organizations" "o"
  WHERE ("o"."workspace_id" IN ( SELECT "uw"."workspace_id"
           FROM "public"."user_workspaces" "uw"
          WHERE ("uw"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Users can create purchase items" ON "public"."purchase_items" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Users can create purchases" ON "public"."purchases" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Users can create stock entries" ON "public"."stock_entries" FOR INSERT WITH CHECK (("business_id" IN ( SELECT "user_workspaces"."workspace_id"
   FROM "public"."user_workspaces"
  WHERE ("user_workspaces"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can create their own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can create workspace products" ON "public"."products" FOR INSERT WITH CHECK (("workspace_id" IN ( SELECT "user_workspaces"."workspace_id"
   FROM "public"."user_workspaces"
  WHERE ("user_workspaces"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can delete purchase items" ON "public"."purchase_items" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Users can delete purchases" ON "public"."purchases" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Users can delete workspace products" ON "public"."products" FOR DELETE USING (("workspace_id" IN ( SELECT "user_workspaces"."workspace_id"
   FROM "public"."user_workspaces"
  WHERE ("user_workspaces"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can update purchase items" ON "public"."purchase_items" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Users can update purchases" ON "public"."purchases" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update workspace products" ON "public"."products" FOR UPDATE USING (("workspace_id" IN ( SELECT "user_workspaces"."workspace_id"
   FROM "public"."user_workspaces"
  WHERE ("user_workspaces"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view business suppliers" ON "public"."suppliers" FOR SELECT USING (("business_id" IN ( SELECT "o"."id"
   FROM "public"."organizations" "o"
  WHERE ("o"."workspace_id" IN ( SELECT "uw"."workspace_id"
           FROM "public"."user_workspaces" "uw"
          WHERE ("uw"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Users can view customers" ON "public"."customers" FOR SELECT USING (true);



CREATE POLICY "Users can view organizations" ON "public"."organizations" FOR SELECT TO "authenticated" USING (("workspace_id" IN ( SELECT "user_workspaces"."workspace_id"
   FROM "public"."user_workspaces"
  WHERE ("user_workspaces"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view purchase items" ON "public"."purchase_items" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view purchases" ON "public"."purchases" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view sales" ON "public"."sales" FOR SELECT USING (true);



CREATE POLICY "Users can view stock entries" ON "public"."stock_entries" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their workspace memberships" ON "public"."user_workspaces" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view workspace modules" ON "public"."workspace_modules" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_workspaces" "uw"
  WHERE (("uw"."workspace_id" = "workspace_modules"."workspace_id") AND ("uw"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view workspace products" ON "public"."products" FOR SELECT USING (("workspace_id" IN ( SELECT "user_workspaces"."workspace_id"
   FROM "public"."user_workspaces"
  WHERE ("user_workspaces"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view workspace suppliers" ON "public"."suppliers" FOR SELECT USING (("business_id" IN ( SELECT "user_workspaces"."workspace_id"
   FROM "public"."user_workspaces"
  WHERE ("user_workspaces"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."batch_consumptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."industries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."industry_modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inventory_batches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."purchase_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."purchases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stock_adjustments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stock_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stock_out_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."suppliers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_workspaces" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workspace_modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workspaces" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON TABLE "public"."stock_out_entries" TO "anon";
GRANT ALL ON TABLE "public"."stock_out_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."stock_out_entries" TO "service_role";



GRANT ALL ON FUNCTION "public"."create_stock_out_transaction"("p_business_id" "uuid", "p_product_id" "uuid", "p_quantity" numeric, "p_selling_price" numeric, "p_customer_id" "uuid", "p_invoice_number" "text", "p_entry_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."create_stock_out_transaction"("p_business_id" "uuid", "p_product_id" "uuid", "p_quantity" numeric, "p_selling_price" numeric, "p_customer_id" "uuid", "p_invoice_number" "text", "p_entry_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_stock_out_transaction"("p_business_id" "uuid", "p_product_id" "uuid", "p_quantity" numeric, "p_selling_price" numeric, "p_customer_id" "uuid", "p_invoice_number" "text", "p_entry_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_workspace_onboarding"("p_user_id" "uuid", "p_business_name" "text", "p_country" "text", "p_currency" "text", "p_phone" "text", "p_email" "text", "p_industry_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_workspace_onboarding"("p_user_id" "uuid", "p_business_name" "text", "p_country" "text", "p_currency" "text", "p_phone" "text", "p_email" "text", "p_industry_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_workspace_onboarding"("p_user_id" "uuid", "p_business_name" "text", "p_country" "text", "p_currency" "text", "p_phone" "text", "p_email" "text", "p_industry_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."Businesses" TO "anon";
GRANT ALL ON TABLE "public"."Businesses" TO "authenticated";
GRANT ALL ON TABLE "public"."Businesses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Businesses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Businesses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Businesses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."batch_consumptions" TO "anon";
GRANT ALL ON TABLE "public"."batch_consumptions" TO "authenticated";
GRANT ALL ON TABLE "public"."batch_consumptions" TO "service_role";



GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."customers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."customers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."customers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."industries" TO "anon";
GRANT ALL ON TABLE "public"."industries" TO "authenticated";
GRANT ALL ON TABLE "public"."industries" TO "service_role";



GRANT ALL ON TABLE "public"."industry_modules" TO "anon";
GRANT ALL ON TABLE "public"."industry_modules" TO "authenticated";
GRANT ALL ON TABLE "public"."industry_modules" TO "service_role";



GRANT ALL ON TABLE "public"."inventory_batches" TO "anon";
GRANT ALL ON TABLE "public"."inventory_batches" TO "authenticated";
GRANT ALL ON TABLE "public"."inventory_batches" TO "service_role";



GRANT ALL ON TABLE "public"."modules" TO "anon";
GRANT ALL ON TABLE "public"."modules" TO "authenticated";
GRANT ALL ON TABLE "public"."modules" TO "service_role";



GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";



GRANT ALL ON TABLE "public"."payment_status" TO "anon";
GRANT ALL ON TABLE "public"."payment_status" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."payment_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payment_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payment_status_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."purchase_items" TO "anon";
GRANT ALL ON TABLE "public"."purchase_items" TO "authenticated";
GRANT ALL ON TABLE "public"."purchase_items" TO "service_role";



GRANT ALL ON TABLE "public"."purchases" TO "anon";
GRANT ALL ON TABLE "public"."purchases" TO "authenticated";
GRANT ALL ON TABLE "public"."purchases" TO "service_role";



GRANT ALL ON TABLE "public"."sales" TO "anon";
GRANT ALL ON TABLE "public"."sales" TO "authenticated";
GRANT ALL ON TABLE "public"."sales" TO "service_role";



GRANT ALL ON SEQUENCE "public"."sales_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sales_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sales_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stock_adjustments" TO "anon";
GRANT ALL ON TABLE "public"."stock_adjustments" TO "authenticated";
GRANT ALL ON TABLE "public"."stock_adjustments" TO "service_role";



GRANT ALL ON TABLE "public"."stock_entries" TO "anon";
GRANT ALL ON TABLE "public"."stock_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."stock_entries" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stock_entries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stock_entries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stock_entries_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."suppliers" TO "anon";
GRANT ALL ON TABLE "public"."suppliers" TO "authenticated";
GRANT ALL ON TABLE "public"."suppliers" TO "service_role";



GRANT ALL ON TABLE "public"."user_workspaces" TO "anon";
GRANT ALL ON TABLE "public"."user_workspaces" TO "authenticated";
GRANT ALL ON TABLE "public"."user_workspaces" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."workspace_modules" TO "anon";
GRANT ALL ON TABLE "public"."workspace_modules" TO "authenticated";
GRANT ALL ON TABLE "public"."workspace_modules" TO "service_role";



GRANT ALL ON TABLE "public"."workspaces" TO "anon";
GRANT ALL ON TABLE "public"."workspaces" TO "authenticated";
GRANT ALL ON TABLE "public"."workspaces" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







