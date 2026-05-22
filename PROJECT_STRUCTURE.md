# SmartStore AI — Complete File Structure

## Root
```
smartstore-ai/
├── package.json              # Monorepo scripts
├── README.md                 # Main documentation
├── PROJECT_STRUCTURE.md      # This file
├── LICENSE
├── .gitignore
├── backend/
└── frontend/
```

## Backend (`backend/`)
```
backend/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── server.js
    ├── config/
    │   ├── db.js
    │   ├── env.js
    │   └── cors.js
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   ├── analyticsController.js
    │   └── aiController.js
    ├── middleware/
    │   ├── auth.js
    │   ├── errorHandler.js
    │   └── rateLimiter.js
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── Analytics.js
    ├── routes/
    │   ├── index.js
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── analyticsRoutes.js
    │   └── aiRoutes.js
    ├── services/
    │   ├── openaiService.js
    │   ├── analyticsService.js
    │   └── analyticsSnapshotService.js
    ├── utils/
    │   ├── asyncHandler.js
    │   ├── validators.js
    │   └── aiValidators.js
    └── scripts/
        └── seed.js
```

## Frontend (`frontend/`)
```
frontend/
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── index.js
    │   ├── AIGenerateButton.jsx
    │   ├── AIContentPanel.jsx
    │   ├── Button.jsx
    │   ├── DeleteConfirmModal.jsx
    │   ├── EmptyState.jsx
    │   ├── ErrorBoundary.jsx
    │   ├── ErrorState.jsx
    │   ├── Input.jsx
    │   ├── InventoryOverview.jsx
    │   ├── LoadingSpinner.jsx
    │   ├── LowStockAlert.jsx
    │   ├── LowStockBadge.jsx
    │   ├── Modal.jsx
    │   ├── Navbar.jsx
    │   ├── Pagination.jsx
    │   ├── ProductFilters.jsx
    │   ├── ProductForm.jsx
    │   ├── ProductTable.jsx
    │   ├── Sidebar.jsx
    │   ├── Skeleton.jsx
    │   ├── StatCard.jsx
    │   └── TopProductsList.jsx
    ├── pages/
    │   ├── Login.jsx
    │   ├── Signup.jsx
    │   ├── Dashboard.jsx
    │   ├── Products.jsx
    │   ├── Analytics.jsx
    │   ├── AIInsights.jsx
    │   └── Settings.jsx
    ├── layouts/
    │   ├── AuthLayout.jsx
    │   └── DashboardLayout.jsx
    ├── routes/
    │   ├── index.js
    │   ├── AppRoutes.jsx
    │   └── ProtectedRoute.jsx
    ├── services/
    │   ├── api.js
    │   ├── authService.js
    │   ├── productService.js
    │   ├── analyticsService.js
    │   └── aiService.js
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── ThemeContext.jsx
    │   └── ToastContext.jsx
    ├── hooks/
    │   ├── useDebounce.js
    │   ├── useCopyToClipboard.js
    │   ├── useLocalStorage.js
    │   ├── useAnalytics.js
    │   └── useProducts.js
    ├── charts/
    │   ├── index.js
    │   ├── chartConfig.js
    │   ├── RevenueLineChart.jsx
    │   ├── SalesBarChart.jsx
    │   └── CategoryDoughnutChart.jsx
    └── utils/
        ├── formatters.js
        ├── constants.js
        └── storage.js
```

## API Coverage

| Feature | Status |
|---------|--------|
| Auth (signup/login/me/settings) | ✅ |
| Products CRUD + search/filter/pagination | ✅ |
| Analytics dashboard + export + snapshot + history | ✅ |
| AI description/tags/caption/ad/social/insights | ✅ |
| JWT + bcrypt + helmet + cors + rate limit | ✅ |
| MongoDB users/products/analytics collections | ✅ |

## UI Coverage

| Feature | Status |
|---------|--------|
| Login / Signup | ✅ |
| Dashboard with charts + alerts | ✅ |
| Products table + modals + AI buttons | ✅ |
| Analytics page + export | ✅ |
| AI Insights panel | ✅ |
| Settings (theme, threshold) | ✅ |
| Dark/light mode | ✅ |
| Responsive sidebar | ✅ |
| Toasts, skeletons, empty/error states | ✅ |
