# TempaniMedusaKit

Swift Package Manager SDK for **Xcode / iOS** apps that manage Tempani products through the **Medusa Admin API**.

> This is a native **Swift** networking kit for Xcode (not Microsoft .NET). Xcode apps use Swift/SwiftUI; this package is the correct iOS integration surface for Medusa.

## Features

- Admin login (JWT) or secret Admin API key
- List / retrieve / create / update / delete products
- Multipart image upload (`POST /admin/uploads`)
- Convenience helpers to **upload images + create/update product** in one call
- Async/await, iOS 16+, macOS 13+

## Add to Xcode

### Option A — Local package (this monorepo)

1. Open your iOS app in Xcode  
2. **File → Add Package Dependencies…**  
3. Click **Add Local…** and select:

```text
packages/TempaniMedusaKit
```

4. Add `TempaniMedusaKit` to your app target

### Option B — Git URL (after push)

```text
https://github.com/Tempani/TPI-webspace.git
```

Xcode → Add Package → use path `packages/TempaniMedusaKit` if using a monorepo package layout, or point at a dedicated tag.

In `Package.swift` of another package:

```swift
.package(path: "../TempaniMedusaKit")
// or
.package(url: "https://github.com/Tempani/TPI-webspace.git", from: "1.0.0")
```

## Quick start

```swift
import TempaniMedusaKit

let client = try MedusaClient(baseURLString: "https://your-medusa-host")

// 1) Authenticate as Medusa admin user
try await client.auth.login(email: "admin@tempani.com", password: "••••••••")

// 2) Upload images + create product
let product = try await client.products.createProductWithImages(
    title: "Estate Cabernet",
    description: "Hillside reserve bottling",
    handle: "estate-cabernet",
    imageFiles: [
        UploadFilePart(
            filename: "bottle.jpg",
            mimeType: "image/jpeg",
            data: jpegData
        )
    ],
    priceEUR: 48.00,
    priceUSD: 52.00
)

print(product.id, product.title)

// 3) Update product
let updated = try await client.products.update(
    id: product.id,
    UpdateProductRequest(
        title: "Estate Cabernet Reserve",
        status: .published
    )
)
```

### Secret API key (optional)

For staff apps that should not store passwords:

```swift
let client = try MedusaClient(
    baseURLString: "https://your-medusa-host",
    adminAPIKey: "sk_..."
)
// Skip login — Authorization: Bearer sk_... is sent automatically
```

Create a secret key in **Medusa Admin → Settings → Secret API Keys**.

## API map

| Kit method | Medusa route |
| --- | --- |
| `auth.login` | `POST /auth/user/emailpass` |
| `uploads.upload` | `POST /admin/uploads` |
| `products.list` | `GET /admin/products` |
| `products.retrieve` | `GET /admin/products/{id}` |
| `products.create` | `POST /admin/products` |
| `products.update` | `POST /admin/products/{id}` |
| `products.delete` | `DELETE /admin/products/{id}` |
| `products.createProductWithImages` | upload + create |
| `products.updateProductWithImages` | upload + update |

## SwiftUI sketch

```swift
import SwiftUI
import TempaniMedusaKit
import PhotosUI

struct ProductUploaderView: View {
    @State private var client = try? MedusaClient(baseURLString: "http://localhost:9000")
    @State private var title = ""
    @State private var status = ""
    @State private var photoItem: PhotosPickerItem?

    var body: some View {
        Form {
            TextField("Title", text: $title)
            PhotosPicker("Choose photo", selection: $photoItem, matching: .images)
            Button("Upload to Medusa") { Task { await upload() } }
            Text(status).font(.footnote)
        }
    }

    func upload() async {
        guard let client, let photoItem else { return }
        do {
            try await client.auth.login(email: "admin@tempani.com", password: "supersecret")
            guard let data = try await photoItem.loadTransferable(type: Data.self) else { return }
            let product = try await client.products.createProductWithImages(
                title: title.isEmpty ? "Untitled" : title,
                imageFiles: [
                    UploadFilePart(filename: "photo.jpg", mimeType: "image/jpeg", data: data)
                ],
                priceEUR: 29
            )
            status = "Created \(product.id)"
        } catch {
            status = error.localizedDescription
        }
    }
}
```

## Backend requirements

1. Medusa backend reachable from the device (use your LAN IP or a tunnel for physical devices; `localhost` only works in Simulator).  
2. Admin user exists (`npx medusa user -e admin@tempani.com -p ...`).  
3. File module configured so `/admin/uploads` returns public URLs (default local provider is fine for dev).  
4. For App Transport Security with `http://` in development, allow arbitrary loads in Info.plist **only for local debugging**.

### Info.plist (local HTTP debug only)

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsLocalNetworking</key>
  <true/>
</dict>
```

## Tests

```bash
cd packages/TempaniMedusaKit
swift test
```

## Example

See `Examples/ProductSyncExample.swift`.

## License

MIT — same as the Tempani monorepo.
