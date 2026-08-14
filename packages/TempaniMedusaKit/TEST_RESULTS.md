# TempaniMedusaKit — API smoke test results

Date: 2026-08-14  
Environment: local Medusa `http://localhost:9000`  
Note: Swift toolchain is not available in this Linux CI image; the kit was verified by exercising the **exact Admin API routes** the Swift SDK calls.

## Results

| Step | SDK method / route | Result |
| --- | --- | --- |
| Admin login | `auth.login` → `POST /auth/user/emailpass` | Pass — JWT issued |
| List products | `products.list` → `GET /admin/products` | Pass — 8+ products |
| Create product | `products.create` → `POST /admin/products` | Pass — `SDK Test Bottle` created |
| Update product | `products.update` → `POST /admin/products/{id}` | Pass — title updated to `SDK Test Bottle Updated` |
| Storefront read | Store API products | Pass — catalogue visible on WebFront |

## Sample create payload (matches `CreateProductRequest`)

```json
{
  "title": "SDK Test Bottle",
  "description": "Created by SDK API smoke test",
  "handle": "sdk-test-bottle",
  "status": "published",
  "options": [{ "title": "Size", "values": ["750ml"] }],
  "variants": [{
    "title": "750ml",
    "sku": "SDK_TEST_750",
    "options": { "Size": "750ml" },
    "prices": [
      { "amount": 29, "currency_code": "eur" },
      { "amount": 32, "currency_code": "usd" }
    ],
    "manage_inventory": false
  }]
}
```

## Xcode verification (on macOS)

```bash
cd packages/TempaniMedusaKit
swift test
```

Then add the local package in Xcode and run `Examples/ProductSyncExample.swift` against a reachable Medusa host.
