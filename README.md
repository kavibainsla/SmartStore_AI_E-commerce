# 🛍️ SmartStore AI — Intelligent E-Commerce & Admin Intelligence Dashboard

SmartStore AI is a state-of-the-art, full-stack, AI-powered e-commerce ecosystem and SaaS-style administrator dashboard. It integrates deep AI classification, auto-detection, and target marketing copy generators directly into standard supply-chain workflows. SmartStore AI provides business insights, automated product metadata creation, dynamic Indian Rupee (INR) localized catalog ordering, real-time stock reconciliation, and a highly secure admin customer directory.

---

## 🎨 Brand & Project Visual Showcase

![SmartStore AI Hero Banner](./frontend/public/smartstore_ai_banner.png)
*Figure 1: SmartStore AI - An advanced fusion of Google Gemini Flash, OpenAI, and React-Vite glassmorphic dashboards.*

### 📸 High-Fidelity UI Screenshots

Here is a visual showcase of our newly deployed, premium glassmorphic system interfaces:

#### 1. AI-Driven Product Form & Single-Field Content Panels
![AI Generation Product Form UI](./frontend/public/screenshots/ai_generator_form.png)
*Figure 2: Admin Product Form featuring a structured category dropdown taxonomy, Gemini category auto-detection, and granular single-field AI generation cards with instant form application hooks.*

#### 2. Glassmorphic Customers Registry & Order Shipment Details
![Admin Customers Dashboard](./frontend/public/screenshots/admin_customers_orders.png)
*Figure 3: Sleek Customers Directory showing dynamic initials-based avatars, Spent (LTV) metric cards, and a slide-out order tracking drawer with invoice summaries and tracking numbers.*

#### 3. Transactional Checkout Receipt Mockup
![Checkout Success Mockup](./frontend/public/screenshots/checkout_success_mockup.png)
*Figure 4: A gorgeous dark-mode glassmorphic digital receipt detailing order ID, INR-localized price fields, tax calculations, and warehouse shipping status.*

---

## 🏗️ System Architecture & Workflow

SmartStore AI is engineered on a high-performance **MERN** (MongoDB, Express, React, Node.js) stack integrated with **Google Gemini (Flash)** for category/taxonomy predictions and **OpenAI (GPT-4)** for sales trend forecasting.

### 1. High-Level Data Flow Topology

```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend ["Client Storefront & Admin Portal (React / Vite)"]
        A[Customer Catalog / Storefront] -->|Cart Checkouts / INR Payments| B[Secure Checkout Form]
        C[Admin Analytics & Insights] -->|AI Queries / Stock Alerts| D[Admin Product Manager]
    end

    %% Routing / Middleware Layer
    subgraph Security ["API Routing & Security Gates (Express)"]
        E[Helmet Security Headers] --> F[CORS / Rate Limiters]
        F --> G[JWT Authentication Middleware]
    end

    %% Backend Controllers
    subgraph Controller ["REST Controller Layer (Node.js)"]
        H[authController]
        I[productController]
        J[aiController]
    end

    %% Database Layer
    subgraph DB ["Database Model Layer (Mongoose / MongoDB)"]
        K[(User Collection)]
        L[(Product Collection)]
        M[(Order Collection)]
    end

    %% External AI Services
    subgraph AI ["AI Cloud Networks"]
        N[Google Gemini API]
        O[OpenAI API]
    end

    %% Data Connections
    A & B & C & D -->|Axios REST Requests| E
    G -->|Routes to Auth| H
    G -->|Routes to Products & Checkout| I
    G -->|Routes to AI Generators| J

    H -->|Query / Update| K
    I -->|Query / Inventory Sync| L
    I -->|Insert Transactions| M
    J -->|Detect Categories / SEO| N
    J -->|Synthesize Sales Recommendation| O
```

### 2. AI Auto-Detection & Generation Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Store Administrator
    participant UI as React Form Component
    participant API as Express Router
    participant CTRL as AI Controller Service
    participant Gemini as Google Gemini AI Studio

    Admin->>UI: Input Product Name & Description
    Admin->>UI: Click "🪄 Auto-Detect"
    UI->>API: POST /api/ai/detect-category { name, description }
    API->>CTRL: Validate & Sanitize Input
    CTRL->>Gemini: Request Zero-Shot Classification
    Gemini-->>CTRL: Return Categorized Label (e.g. 'Electronics')
    CTRL-->>API: 200 OK { category: 'Electronics' }
    API-->>UI: Update State & Pre-select Category Field
    UI-->>Admin: Dynamically Select Category Dropdown
```

---

## 💾 Mongoose Database Schema & Relationships

Our database leverages three closely coupled, indexed, and validated **Mongoose schemas** representing **Users**, **Products**, and **Orders** collections.

```mermaid
erDiagram
    USER ||--o{ PRODUCT : "creates / uploads"
    USER ||--o{ ORDER : "places / buys"
    PRODUCT ||--o{ ORDER : "belongs to line items"
    
    USER {
        ObjectId _id PK
        String name "Required, Trimmed"
        String email "Required, Unique, Lowercase"
        String password "Required, Hashed (Bcrypt)"
        String role "Enum: admin, manager, customer"
        String avatar "Default: Initials Avatar"
        Object settings "theme: dark/light, lowStockThreshold"
        Date createdAt "Timestamp"
    }

    PRODUCT {
        ObjectId _id PK
        String name "Required, Text-Indexed, Unique"
        String description "Text-Indexed"
        String category "Required, Indexed"
        String image "URL Placeholder"
        Number price "Required, Min: 0 (INR ₹)"
        Number stock "Required, Min: 0"
        StringArray tags "Text-Indexed"
        Number sales "Default: 0"
        Number revenue "Default: 0"
        String status "Enum: active, inactive"
        ObjectId createdBy FK "Ref User"
        Object aiContent "seoKeywords, adCopy, targetAudience, etc."
    }

    ORDER {
        ObjectId _id PK
        ObjectId customer FK "Ref User"
        String orderId "Required, Unique"
        Array items "Line Items: { product, name, price, quantity }"
        Number subtotal "Required"
        Number shipping "Calculated Fee"
        Number tax "8% GST"
        Number total "Gross Sum"
        String address "Shipping Destination"
        String status "Enum: AI Processing, In Transit, Delivered"
        String trackingNumber "Unique Shipment Code"
        Date createdAt "Timestamp"
    }
```

### 1. User Schema Specs (`User.js`)
* Stores authentication credentials, dashboard settings, and roles.
* Enforces automatic **Bcrypt hashing (12 salt rounds)** prior to document saving.

| Field | Type | Options / Validators | Description |
| :--- | :--- | :--- | :--- |
| `name` | `String` | Required, trimmed | Full name of the user |
| `email` | `String` | Required, unique, lowercase, trimmed | Email address used for authentication |
| `password` | `String` | Required, minlength: 6, `select: false` | Bcrypt secure password hash |
| `role` | `String` | Enum: `['admin', 'manager', 'customer']`, default: `'customer'` | Action authorization gate controller |
| `settings.theme` | `String` | Enum: `['light', 'dark']`, default: `'dark'` | User-defined UI layout theme preference |
| `settings.lowStockThreshold` | `Number` | Default: `10` | Product count before triggers low stock warning |

### 2. Product Schema Specs (`Product.js`)
* Manages standard details, sales volume, and structured AI marketing copy.
* Uses **compounded text indexes** on `name`, `description`, and `tags` to support ultra-fast fuzzy catalog search.

| Field | Type | Options / Validators | Description |
| :--- | :--- | :--- | :--- |
| `name` | `String` | Required, unique, trimmed, text-indexed | Marketing product listing name |
| `category` | `String` | Required, trimmed, indexed | Product categorization |
| `price` | `Number` | Required, min: `0` | Price in localized Indian Rupees (`₹`) |
| `stock` | `Number` | Required, min: `0`, default: `0` | Real-time warehouse product volume |
| `sales` | `Number` | Default: `0`, min: `0` | Cumulative units purchased |
| `revenue` | `Number` | Default: `0`, min: `0` | Cumulative lifetime revenue generated by item |
| `aiContent` | `Object` | Optional nested sub-document | Stores SEO keywords, target audience, pricing suggestions |

### 3. Order Schema Specs (`Order.js`)
* Logs customer transactions, linking checkouts directly to live warehouse stock reconciliation.

| Field | Type | Options / Validators | Description |
| :--- | :--- | :--- | :--- |
| `customer` | `ObjectId` | Ref: `'User'`, Required | Buyer's user account ID reference |
| `orderId` | `String` | Required, unique | Human-readable receipt id (e.g., `ORD-930218`) |
| `items` | `Array` | Object Array with `product (ref)`, `name`, `price`, `quantity` | Direct snapshot of catalog pricing at checkout |
| `shipping` | `Number` | Required, default: `₹150` (Free for orders > `₹1,500`) | Dynamic delivery surcharge |
| `tax` | `Number` | Required, 8% of subtotal | Sales tax or GST compilation |
| `total` | `Number` | Required | Net payable checkout amount |
| `trackingNumber` | `String` | Required, unique | Unique code (e.g. `TRK83902183`) |

---

## 🪄 Deep Tech Walkthrough: Our Custom Engineering Upgrades

During our latest iterative sprint, we introduced five highly advanced features that elevated this codebase from a basic proof-of-concept into a production-grade application:

### 1. Unified Category Dropdowns & Gemini Auto-Detection
* **The Problem**: Manual text inputs in the product category field caused inconsistent catalog filters (e.g. "Electronic", "electronics", "Electonics").
* **The Solution**: We integrated a standard dropdown matching standard e-commerce taxonomies (`Electronics`, `Apparel`, `Accessories`, `Home & Kitchen`, `Sports & Outdoors`, `Beauty`, `Books`, `Other`).
* **AI Synergy**: Added a dynamic gradient **"🪄 Auto-Detect"** button. Clicking it grabs the active form name and description and queries Google Gemini. The returned zero-shot classification is instantly used to select the correct index, or populate a custom category text input if `'Other'` is determined.
* **Granular Controls**: Created single-field generator cards with independent **"Generate"** and **"✓ Apply"** handles so admins can refine AI-suggested fields one by one before saving.

### 2. Centered Catalog Visuals & Hover Zoom Frames
* **The Problem**: Cropped storefront cards and aspect-ratio mismatch cut off products, lowering user trust.
* **The Solution**: Created a beautiful centered image container utilizing padding grids, custom background shadows, and CSS `object-contain`.
* **Micro-Animations**: Wired up a CSS transition framework scaling the product image by `110%` (`scale-110`) on cursor hover, alongside custom CSS blur filters for stunning visual micro-interactions.

### 3. Global Indian Rupees (₹) localization
* **The Problem**: E-commerce projects default to USD (`$`), which feels impersonal to localized users.
* **The Solution**: Completely localized the application currency into Indian Rupees (`₹` / `INR`).
* **Seeder Refactor**: Converted mock product catalog prices to realistic, premium Indian consumer values (e.g. `₹19,999` for wireless headphones and `₹4,799` for smartwatches) with pricing formatted using `en-IN` locales.

### 4. Real Backend Checkout Stock & Stats Sync
* **The Problem**: Storefront checkouts were superficial, failing to update inventory or database variables.
* **The Solution**: Developed a transactional checkout process (`POST /api/products/checkout`).
* **Inventory Deduction**: Purchasing products deducts real-time stock balances from the database.
* **Revenue Aggregation**: Automatically increases sales tallies, raises net profit revenues in the product records, and updates admin dashboard charts in real-time.

### 5. Glassmorphic Customers Panel & Dynamic Tracking Drawer
* **The Problem**: Administrators lacked direct visibility into which customers were placing orders.
* **The Solution**: Created a stunning directory table at `/customers` displaying full contact listings.
* **Spent (LTV) Metrics**: Dynamically queries customer checkouts, compiles active orders, and displays a Lifetime Value Spent metric.
* **Sliding Invoice Drawer**: Clicking "View Orders" slides out a full screen drawer detailing product list snapshots, GST, shipping rates, shipping destinations, and a clipboard tracking code copy-button.

---

## 📡 API Integration Map

### 🔒 Authentic Authorization & Users
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register standard customer or admin profiles |
| `POST` | `/api/auth/login` | Public | Login credentials token retrieval |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in identity profile |
| `GET` | `/api/auth/customers` | Admin/Manager | Query complete directory of user accounts and LTV spends |

### 🛍️ Storefront & Products CRUD
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Customer/Admin | List, sort, search, and paginate catalog items |
| `GET` | `/api/products/:id` | Customer/Admin | Fetch individual product specifications |
| `POST` | `/api/products` | Admin/Manager | Upload a new product and register stock |
| `PUT` | `/api/products/:id` | Admin/Manager | Edit product pricing, stock, details, and marketing copies |
| `DELETE` | `/api/products/:id` | Admin/Manager | Remove product from database catalog |
| `POST` | `/api/products/checkout` | Customer/Admin | Deducts product stock, records invoice transaction and sales metrics |

### 🤖 Gemini & OpenAI Artificial Intelligence
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/detect-category` | Admin/Manager | Query Gemini to auto-detect e-commerce taxonomy |
| `POST` | `/api/ai/generate-description` | Admin/Manager | Generate rich SEO product description |
| `POST` | `/api/ai/generate-tags` | Admin/Manager | Generate optimized search tags |
| `POST` | `/api/ai/generate-full-info` | Admin/Manager | Generate complete target marketing/competitor copywriting |
| `POST` | `/api/ai/sales-insights` | Admin/Manager | Request OpenAI sales optimizations based on database snapshots |

---

## 🛠️ Complete Local Installation & Execution

### Prerequisites
* **Node.js**: Version 18.0.0 or above
* **MongoDB**: A running local MongoDB database instance (`mongodb://127.0.0.1:27017`)
* **Gemini API Key**: Recommended for AI classification (Get one free at [Google AI Studio](https://aistudio.google.com/apikey))

### Step 1: Clone & Dependency Installation
Open your terminal inside the root directory and install node modules for both components:
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

**Create `backend/.env` file**:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/smartstore_ai
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
GEMINI_API_KEY=AIzaSyBFbmgsJNjl4OE-Io0XzM4gRVbt81HIHsM  # Your Google Gemini Key
GEMINI_MODEL=gemini-flash-latest
CLIENT_URL=http://localhost:5173
LOW_STOCK_THRESHOLD=10
```

**Create `frontend/.env` file**:
```env
VITE_API_URL=http://localhost:5001/api
```

### Step 3: Run Database Seed Script
Populate your MongoDB database with pre-configured INR-localized product catalog data, customer accounts, and an administrator credentials set:
```bash
cd backend
npm run seed
```
> [!IMPORTANT]
> The seeder automatically registers the default administrator credentials:
> * **Username**: `admin@smartstore.ai`
> * **Password**: `admin123`
> * **Role**: `admin`

### Step 4: Launch Development Servers

**Launch Backend (Terminal 1)**:
```bash
cd backend
npm run dev
```

**Launch Frontend (Terminal 2)**:
```bash
cd frontend
npm run dev
```

Now, navigate your browser to **`http://localhost:5173`** to access the storefront and management console!

---

## 📹 Academic Presentation & Demonstration Blueprint

This blueprint outlines a dynamic presentation script you can use to walk your teacher through the SmartStore AI application:

### Slide/Walkthrough Flow

```mermaid
graph LR
    P1[1. Introduction & Architecture] --> P2[2. Storefront Catalog Checkout]
    P2 --> P3[3. Admin Dashboard & Analytics]
    P3 --> P4[4. AI Integration & Auto-Detect]
    P4 --> P5[5. Code Quality & Git History]
```

#### 🎤 Phase 1: Storefront Showcase & Checkout Flow (INR Localized)
1. **Action**: Open the landing page at `http://localhost:5173`. Make sure you are signed in as a standard Customer account.
2. **Talking Points**:
   > *"Good morning, Professor! This is SmartStore AI. As you can see, the catalog displays localized Indian Rupees (₹) pricing. The items are neatly padded inside non-cropped glassmorphic containers. Notice the subtle micro-interactions: hovering scales the products smoothly and adds blur backdrops."*
3. **Action**: Add 2 items to the Cart (e.g. smart watch and headphones). Open the Cart drawer on the right.
4. **Talking Points**:
   > *"The storefront cart utilizes dynamic state hooks to calculate the items, subtotal, 8% tax (GST), and dynamic shipping (free for orders above ₹1,500). Let's complete the checkout by inserting our delivery address."*
5. **Action**: Click Checkout. The storefront displays an elegant success modal with a mock order tracking receipt (Order ID `ORD-XXXXXX`).

#### 🎤 Phase 2: Administrator Dashboards, Customer Registry, & Invoices
1. **Action**: Log out of the customer account, then log in using the administrator seed credentials (`admin@smartstore.ai` / `admin123`).
2. **Talking Points**:
   > *"Logging in as an Admin opens the SaaS-style KPI metrics dashboard. We have interactive charts showing revenue distribution and product categories, alongside inventory thresholds."*
3. **Action**: Navigate to the **"Customers"** section in the sidebar.
4. **Talking Points**:
   > *"In this custom customer directory, we list all users who registered accounts. We display gradient circular avatars, role-based tags, and live calculated Lifetime Value (LTV) spent. Clicking 'View Orders' on our customer slides out their invoice drawer showing line-item details, shipment tracking codes, and shipping addresses."*

#### 🎤 Phase 3: Gemini Zero-Shot AI Category Auto-Detection
1. **Action**: Navigate to the **"Products"** section and click **"Add Product"**.
2. **Talking Points**:
   > *"Let's show the Gemini Flash integration. I will enter a brand new product name and description, leaving the category unselected. I will click the '🪄 Auto-Detect' button next to the field."*
3. **Action**: Enter `"Ultra-Light Carbon Hiking Pole"` in the name, `"A heavy-duty telescopic pole for mountain climbers."` in the description, and click the auto-detect button. The dropdown will automatically select `Sports & Outdoors`!
4. **Talking Points**:
   > *"Gemini analysed the title and description, classified it, and auto-selected 'Sports & Outdoors' in our strict commerce taxonomy dropdown! Furthermore, we have granular controls: click 'Generate' on target ad copy or captions, inspect the generated AI text, and click 'Apply' to inject it selectively into our form."*

#### 🎤 Phase 4: Database Model Design & Git Quality
1. **Talking Points**:
   > *"Under the hood, MongoDB handles complex relationships using ref-based ObjectId referencing. Buying a product fires transactional stock controllers that check stock thresholds, decrement available items, record new orders, and aggregate dashboard sales stats atomically in a single network pass."*
2. **Action**: Show the clean, 4-commit logical Git history on GitHub to conclude the presentation.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
