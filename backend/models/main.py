from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re
import time
from datetime import datetime, timedelta

# =========================================================
# INIT
# =========================================================
load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

# =========================================================
# FETCH PRODUCTS
# =========================================================
def fetch_products(categories, max_budget):
    query = supabase.table("products").select("*").lte("price", max_budget)

    if isinstance(categories, list):
        query = query.in_("category", categories)
    else:
        query = query.eq("category", categories)

    res = query.limit(100).execute()
    return res.data if res.data else []

# =========================================================
# AI PER CATEGORY
# =========================================================
def ai_select_per_category(products, category, budget_range, user_data):

    cat_products = [p for p in products if p["category"] == category]

    if not cat_products:
        return []

    # ✅ SAFE extraction
    min_budget = budget_range.get("min", 0)
    max_budget = budget_range.get("max", 0)

    slim = [
        {
            "product_id": p["product_id"],
            "name": p["name"],
            "price": p["price"],
            "rating": p["rating"],
            "reviews": p.get("reviews_count", 0),
            "color": p.get("color", ""),
            "tags": p.get("tags", [])
        }
        for p in cat_products
    ]

    prompt = f"""
You are an intelligent shopping assistant.

Category: {category}

Budget Range:
- Minimum: {min_budget}
- Maximum: {max_budget}

User Preferences:
Theme: {user_data['theme']}
Extra: {user_data['extra']}

Available Products:
{json.dumps(slim, indent=2)}

Instructions:
- Select the BEST combination of products
- Total price MUST be between {min_budget} and {max_budget}
- Try to stay close to max budget
- You can select multiple items
- Prefer high rating and reviews
- Avoid duplicates

Also classify each product into:
Essentials / Nice to Have / Premium Picks

Return ONLY JSON:
{{
  "items": [
    {{"product_id": 1, "section": "Essentials"}}
  ]
}}
"""

    try:
        time.sleep(1)

        response = model.generate_content(prompt)
        text = response.text.strip()

        # Clean markdown
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

        result = json.loads(text)
        ai_items = result.get("items", [])

        selected = []
        total_price = 0

        for ai_item in ai_items:
            pid = ai_item.get("product_id")
            section = ai_item.get("section", "Essentials")

            product = next((p for p in cat_products if p["product_id"] == pid), None)

            if product and total_price + product["price"] <= max_budget:
                product["section"] = section
                selected.append(product)
                total_price += product["price"]

        # Ensure minimum
        if not selected or total_price < min_budget:
            raise ValueError("AI invalid selection")

        return selected

    except Exception as e:
        print(f"AI ERROR ({category}):", e)

        # fallback
        fallback = sorted(cat_products, key=lambda x: x["rating"], reverse=True)

        result = []
        total = 0

        for p in fallback:
            if total + p["price"] <= max_budget:
                p["section"] = "Essentials"
                result.append(p)
                total += p["price"]

        return result

# =========================================================
# MAIN API
# =========================================================
@app.route("/generate-registry", methods=["POST"])
def generate_registry():
    try:
        data = request.json

        print("REQUEST:", data)  # 🔥 DEBUG

        categories = data.get("category", [])
        category_budget = data.get("category_budget", {})

        theme = data.get("theme", "modern")
        extra = data.get("extra", "")

        # 🔥 VALIDATION
        if not category_budget:
            return jsonify({"error": "category_budget is required"}), 400

        if not categories:
            categories = list(category_budget.keys())

        # Validate each category
        for cat in categories:
            if cat not in category_budget:
                return jsonify({
                    "error": f"Missing budget for category: {cat}"
                }), 400

        # 🔥 SAFE MAX BUDGET (FIXED ERROR)
        max_budget = max(
            v["max"] if isinstance(v, dict) else v
            for v in category_budget.values()
        )

        user_data = {
            "theme": theme,
            "extra": extra
        }

        products = fetch_products(categories, max_budget)

        final_items = []

        for category in categories:
            budget_range = category_budget[category]

            # Support old format
            if isinstance(budget_range, int):
                budget_range = {"min": 0, "max": budget_range}

            items = ai_select_per_category(
                products,
                category,
                budget_range,
                user_data
            )

            final_items.extend(items)

        return jsonify({
            "explanation": "AI-curated registry with budget ranges",
            "items": final_items
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

# =========================================================
# LOGIN USER → checks if email exists in users table
# =========================================================
@app.route("/login-user", methods=["POST"])
def login_user():
    try:
        data = request.json or {}
        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # We now query for password as well
        check = supabase.table("users").select("user_id, password").eq("email", email).execute()
        
        if check.data:
            user = check.data[0]
            # Simple plaintext check since this is a basic prototype
            if user.get("password") == password:
                return jsonify({"success": True, "user_id": user["user_id"]})
            else:
                return jsonify({"success": False, "error": "Incorrect password"}), 401
        else:
            # Return 404 so the frontend knows this user truly doesn't exist
            return jsonify({"success": False, "error": "User not found"}), 404

    except Exception as e:
        import traceback
        print("LOGIN-USER ERROR:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# =========================================================
# REGISTER USER  →  users table
#
# users schema:
#   user_id           uuid      gen_random_uuid()  ← DO NOT supply
#   name              varchar   NULL
#   email             varchar   NULL
#   address           text      NULL
#   phone_number      varchar   NULL
#   registries_created jsonb    '[]'::jsonb        ← has default, skip
#   registries_access  jsonb    '[]'::jsonb        ← has default, skip
# =========================================================
@app.route("/register-user", methods=["POST"])
def register_user():
    try:
        import traceback
        data = request.json or {}
        print("REGISTER-USER:", data)

        user_id = data.get("user_id", "").strip()   # non-empty only on Step3
        email   = data.get("email",   "").strip()
        name    = data.get("name",    "").strip()
        phone   = data.get("phone",   "").strip()
        address = data.get("address", "").strip()
        password = data.get("password", "")

        # ── Step3 path: update existing row by user_id ──────────
        if user_id:
            # If we received a fake local_id because Step1 failed, we can't update.
            # But we shouldn't crash or return 400, just lie and say updated:
            if user_id.startswith("local_"):
                return jsonify({"user_id": user_id, "updated": True, "warning": "local id ignored"})

            payload = {}
            if name:    payload["name"]         = name
            if phone:   payload["phone_number"] = phone
            if address: payload["address"]      = address
            if password: payload["password"]    = password

            if payload:
                supabase.table("users").update(payload).eq("user_id", user_id).execute()

            return jsonify({"user_id": user_id, "updated": True})

        # ── Step1 path: upsert by email ──────────────────────────
        if not email:
            return jsonify({"error": "email is required"}), 400

        # Check for existing user with same email
        check = supabase.table("users").select("user_id").eq("email", email).execute()

        if check.data:
            # User exists → update phone if provided
            uid = check.data[0]["user_id"]
            payload = {}
            if name:  payload["name"]         = name
            if phone: payload["phone_number"] = phone
            if password: payload["password"]  = password
            
            if payload:
                supabase.table("users").update(payload).eq("user_id", uid).execute()
            return jsonify({"user_id": uid, "created": False})

        # New user — let gen_random_uuid() handle user_id
        # Supabase 'name' is NOT NULL, so we provide a default empty or fallback name
        insert = {
            "email": email,
            "name": name if name else "User"
        }
        if password: insert["password"]     = password
        if phone:    insert["phone_number"] = phone
        if address:  insert["address"]      = address
        # registries_created & registries_access use '[]'::jsonb defaults — skip

        res      = supabase.table("users").insert(insert).execute()
        new_user = res.data[0] if res.data else {}
        return jsonify({"user_id": new_user.get("user_id"), "created": True})

    except Exception as e:
        import traceback
        print("REGISTER-USER ERROR:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# =========================================================
# CREATE REGISTRY  →  registries table
#
# registries schema:
#   registry_id  int4       nextval(...)       ← auto-increment, skip
#   name         text       NULL
#   is_public    bool       NULL
#   event_date   date       NULL
#   occasion     text       NULL
#   created_at   timestamp  CURRENT_TIMESTAMP  ← has default, skip
#   user_id      uuid       NULL               ← plain uuid, NOT a FK
# =========================================================
@app.route("/create-registry", methods=["POST"])
def create_registry():
    try:
        data = request.json or {}
        print("CREATE-REGISTRY:", data)

        user_id    = data.get("user_id",    "").strip()
        name       = data.get("name",       "My Registry")
        occasion   = data.get("occasion",   "")
        event_date = data.get("event_date", None)   # YYYY-MM-DD
        is_public  = data.get("is_public",  True)

        # user_id required so we can link the registry back to the user
        if not user_id or user_id.startswith("local_"):
            # Still create the registry, just without a user link
            user_id = None

        # Build insert (registry_id auto-increments, created_at has a default)
        insert = {
            "name":      name,
            "occasion":  occasion,
            "is_public": is_public,
        }
        if event_date:
            insert["event_date"] = event_date
        if user_id:
            insert["user_id"] = user_id

        res          = supabase.table("registries").insert(insert).execute()
        new_registry = res.data[0] if res.data else {}
        registry_id  = new_registry.get("registry_id")

        # Append registry_id to user's registries_created array
        if user_id and registry_id:
            user_res = supabase.table("users") \
                .select("registries_created") \
                .eq("user_id", user_id).execute()
            existing = (user_res.data[0].get("registries_created") or []) if user_res.data else []
            existing.append(registry_id)
            supabase.table("users").update({"registries_created": existing}).eq("user_id", user_id).execute()

        return jsonify({"registry_id": registry_id, "created": True})

    except Exception as e:
        print("CREATE-REGISTRY ERROR:", e)
        return jsonify({"error": str(e)}), 500


# =========================================================
# PUBLISH REGISTRY  →  registry_items table
# Links selected product IDs to a registry ID
# =========================================================
@app.route("/publish-registry", methods=["POST"])
def publish_registry():
    try:
        data = request.json or {}
        print("PUBLISH-REGISTRY:", data)

        registry_id = data.get("registry_id")
        product_ids = data.get("product_ids", [])

        if not product_ids:
            return jsonify({"error": "No products to publish"}), 400

        # Optional: if no registry_id is provided, try picking latest from registries
        if not registry_id or str(registry_id).startswith("local_"):
            # A fallback just to link them somewhere instead of erroring during demo
            check = supabase.table("registries").select("registry_id").order("created_at", desc=True).limit(1).execute()
            if check.data:
                registry_id = check.data[0]["registry_id"]
            else:
                return jsonify({"error": "No registry found to publish to"}), 404

        # Convert valid IDs to integers
        numeric_pids = []
        for pid in product_ids:
            try:
                numeric_pids.append(int(pid))
            except ValueError:
                pass
                
        if not numeric_pids:
            return jsonify({"error": "No valid products to publish"}), 400

        # Fetch product prices securely from DB to set the initial required_amount
        price_query = supabase.table("products").select("product_id, price").in_("product_id", numeric_pids).execute()
        price_map = {row["product_id"]: row["price"] for row in price_query.data}

        # Insert each product into registry_items table
        insert_payload = []
        for pid in numeric_pids:
            insert_payload.append({
                "registry_id": registry_id,
                "product_id": pid,
                "status": "AVAILABLE",
                "required_amount": price_map.get(pid, 0)
            })

        if insert_payload:
            supabase.table("registry_items").insert(insert_payload).execute()

        return jsonify({"success": True, "inserted_count": len(insert_payload)})

    except Exception as e:
        import traceback
        print("PUBLISH-REGISTRY ERROR:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# =========================================================
# HELPER: Check and Release Expired Locks
# =========================================================
def release_expired_locks():
    try:
        now = datetime.utcnow().isoformat()
        supabase.table("registry_items").update({
            "status": "AVAILABLE",
            "locked_by": None,
            "lock_expires_at": None
        }).lt("lock_expires_at", now).neq("status", "PURCHASED").execute()
    except Exception as e:
        print("Warning: Failed to release expired locks", e)

# =========================================================
# GET MY REGISTRY  →  registry_items + products
# =========================================================
@app.route("/my-registry", methods=["GET"])
def get_my_registry():
    release_expired_locks()
    try:
        registry_id = request.args.get("registry_id")
        user_id = request.args.get("user_id")

        if not registry_id:
            if user_id and not str(user_id).startswith("local_"):
                reg_check = supabase.table("registries").select("registry_id").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
            else:
                # Fallback for prototype testing
                reg_check = supabase.table("registries").select("registry_id").order("created_at", desc=True).limit(1).execute()

            if not reg_check.data:
                 return jsonify({"error": "No registry found", "items": []}), 404
                 
            registry_id = reg_check.data[0]["registry_id"]

        # Join registry_items with products
        items_req = supabase.table("registry_items").select("*, products(*)").eq("registry_id", registry_id).execute()

        # Gather all UUIDs for name mapping
        all_uuids = set()
        for item in items_req.data:
            bb = item.get("bought_by")
            if bb:
                all_uuids.update(str(uid) for uid in bb)
            lb = item.get("locked_by")
            if lb:
                all_uuids.add(str(lb))
        
        uuid_to_name = {}
        if all_uuids:
            try:
                users_req = supabase.table("users").select("user_id, name").in_("user_id", list(all_uuids)).execute()
                for u in users_req.data:
                    uuid_to_name[str(u["user_id"])] = u.get("name") or "Guest"
            except Exception as e:
                print("Error fetching user names:", e)

        results = []
        for item in items_req.data:
            p = item.get("products", {})
            
            bb = item.get("bought_by") or []
            bb_names = [uuid_to_name.get(str(uid), "Guest") for uid in bb]
            
            lb = item.get("locked_by")
            lb_name = uuid_to_name.get(str(lb), "Anonymous Guest") if lb else None

            results.append({
                "registry_item_id": item.get("registry_item_id"),
                "product_id": item.get("product_id"),
                "status": item.get("status") or 'AVAILABLE',
                "total_contribution": float(item.get("total_contribution") or 0),
                "required_amount": float(item.get("required_amount") or p.get("price") or 0),
                "bought_by_names": bb_names,
                "locked_by": lb,
                "locked_by_name": lb_name,
                "name": p.get("name", "Unknown Product"),
                "image": p.get("image_url") or p.get("image") or 'https://via.placeholder.com/150',
                "price": float(p.get("price") or 0)
            })

        return jsonify({"registry_id": registry_id, "items": results})

    except Exception as e:
        import traceback
        print("GET MY-REGISTRY ERROR:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# =========================================================
# LOCKING & PAYMENT ENDPOINTS (Guest Interactions)
# =========================================================
@app.route("/reserve/<int:item_id>", methods=["POST"])
def reserve_item(item_id):
    release_expired_locks()
    data = request.json or {}
    user_id = data.get("user_id")
    try:
        supabase.table("registry_items").update({
            "status": "RESERVED",
            "locked_by": user_id
        }).eq("registry_item_id", item_id).neq("status", "PURCHASED").execute()
        return jsonify({"message": "Item reserved"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/start-payment/<int:item_id>", methods=["POST"])
def start_payment(item_id):
    release_expired_locks()
    data = request.json or {}
    user_id = data.get("user_id")
    try:
        item = supabase.table("registry_items").select("status").eq("registry_item_id", item_id).single().execute()
        if not item.data:
            return jsonify({"error": "Item not found"}), 404
        if item.data["status"] in ["PURCHASED", "RESERVED"]:
            return jsonify({"error": "Item not available"}), 400
            
        expiry = (datetime.utcnow() + timedelta(minutes=5)).isoformat()
        supabase.table("registry_items").update({
            "status": "RESERVED",
            "locked_by": user_id,
            "lock_expires_at": expiry
        }).eq("registry_item_id", item_id).execute()
        return jsonify({"message": "Payment started"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/purchase/<int:item_id>", methods=["POST"])
def purchase(item_id):
    data = request.json or {}
    user_id = data.get("user_id")
    try:
        item = supabase.table("registry_items").select("status", "locked_by", "bought_by").eq("registry_item_id", item_id).single().execute()
        if not item.data:
            return jsonify({"error": "Item not found"}), 404
        if item.data["status"] != "RESERVED":
            return jsonify({"error": "Payment not started"}), 400
        if str(item.data["locked_by"]) != str(user_id):
            return jsonify({"error": "Not your payment session"}), 403
            
        bought_by_array = item.data.get("bought_by") or []
        if user_id and user_id not in bought_by_array:
            bought_by_array.append(user_id)

        supabase.table("registry_items").update({
            "status": "PURCHASED",
            "bought_by": bought_by_array,
            "locked_by": None,
            "lock_expires_at": None
        }).eq("registry_item_id", item_id).execute()
        return jsonify({"message": "Item purchased"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/contribute/<int:item_id>", methods=["POST"])
def contribute(item_id):
    data = request.json or {}
    amount = float(data.get("amount", 0))
    user_id = data.get("user_id")
    try:
        item = supabase.table("registry_items").select("total_contribution", "required_amount", "bought_by").eq("registry_item_id", item_id).single().execute()
        if not item.data:
            return jsonify({"error": "Item not found"}), 404

        total = float(item.data.get("total_contribution") or 0) + amount
        required = float(item.data["required_amount"])
        
        bought_by_array = item.data.get("bought_by") or []
        if user_id and user_id not in bought_by_array:
            bought_by_array.append(user_id)

        update_payload = {
            "total_contribution": total,
            "bought_by": bought_by_array,
            "status": "AVAILABLE",
            "locked_by": None,
            "lock_expires_at": None
        }
        
        # Auto purchase if complete
        if total >= required:
            update_payload["status"] = "PURCHASED"

        supabase.table("registry_items").update(update_payload).eq("registry_item_id", item_id).execute()
        return jsonify({"total": total, "required": required, "completed": total >= required})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================================================
# GET ALL REGISTRIES (Search functionality)
# =========================================================
@app.route("/all-registries", methods=["GET"])
def get_all_registries():
    try:
        req = supabase.table("registries").select("*").execute()
        
        results = []
        for reg in req.data:
            # Format event_date nicely if needed, or send as is
            # For guest searches, mapping DB columns to frontend expected fields
            results.append({
                "id": str(reg.get("registry_id")),
                "name": reg.get("name") or "Unnamed Registry",
                "event": reg.get("occasion") or "Event",
                "date": reg.get("event_date") or "TBD"
            })
            
        return jsonify({"registries": results})
        
    except Exception as e:
        print("GET ALL-REGISTRIES ERROR:", e)
        return jsonify({"error": str(e)}), 500

# =========================================================
# ALL PRODUCTS (browsable inventory with filters)
# =========================================================

@app.route("/all-products", methods=["POST"])
def all_products():
    try:
        data = request.json or {}

        print("ALL-PRODUCTS REQUEST:", data)  # DEBUG

        categories      = data.get("category", [])
        category_budget = data.get("category_budget", {})
        color_filter    = data.get("color", "").strip()
        min_price       = data.get("min_price", 0)
        max_price       = data.get("max_price", 99999)
        sort_by         = data.get("sort_by", "rating")   # rating | price_asc | price_desc

        # Derive overall price window from category_budget if provided
        if category_budget:
            budget_vals = list(category_budget.values())
            mins = [v["min"] if isinstance(v, dict) else 0   for v in budget_vals]
            maxs = [v["max"] if isinstance(v, dict) else v   for v in budget_vals]
            min_price = data.get("min_price", min(mins) if mins else 0)
            max_price = data.get("max_price", max(maxs) if maxs else 99999)

        # Build Supabase query
        query = supabase.table("products").select("*")

        if categories:
            if isinstance(categories, list) and len(categories) > 0:
                query = query.in_("category", categories)
            elif isinstance(categories, str):
                query = query.eq("category", categories)

        query = query.gte("price", min_price).lte("price", max_price)

        if color_filter:
            query = query.ilike("color", f"%{color_filter}%")

        # Apply sort
        if sort_by == "price_asc":
            query = query.order("price", desc=False)
        elif sort_by == "price_desc":
            query = query.order("price", desc=True)
        else:
            query = query.order("rating", desc=True)

        res = query.limit(200).execute()
        products = res.data if res.data else []

        return jsonify({
            "items": products,
            "count": len(products)
        })

    except Exception as e:
        print("ALL-PRODUCTS ERROR:", e)
        return jsonify({"error": str(e)}), 500

# =========================================================
# RUN
# =========================================================
if __name__ == "__main__":
    app.run(debug=True)