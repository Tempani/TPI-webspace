import Foundation
import TempaniMedusaKit
#if canImport(UIKit)
import UIKit
#endif

/// Example usage for an Xcode staff / inventory app.
/// Copy patterns into your SwiftUI or UIKit screens.
@MainActor
enum ProductSyncExample {
    static func makeClient() throws -> MedusaClient {
        // Prefer Info.plist / xcconfig for production values.
        try MedusaClient(
            baseURLString: ProcessInfo.processInfo.environment["MEDUSA_URL"]
                ?? "http://localhost:9000"
        )
    }

    static func loginAndList() async throws {
        let client = try makeClient()
        try await client.auth.login(
            email: ProcessInfo.processInfo.environment["MEDUSA_ADMIN_EMAIL"] ?? "admin@tempani.com",
            password: ProcessInfo.processInfo.environment["MEDUSA_ADMIN_PASSWORD"] ?? "supersecret"
        )

        let page = try await client.products.list(limit: 20, q: "Tempani")
        for product in page.products {
            print("• \(product.title) [\(product.id)]")
        }
    }

    static func createProduct(imageData: Data) async throws -> AdminProduct {
        let client = try makeClient()
        try await client.auth.login(
            email: ProcessInfo.processInfo.environment["MEDUSA_ADMIN_EMAIL"] ?? "admin@tempani.com",
            password: ProcessInfo.processInfo.environment["MEDUSA_ADMIN_PASSWORD"] ?? "supersecret"
        )

        return try await client.products.createProductWithImages(
            title: "Mobile Upload Sample",
            description: "Created from the Tempani iOS SDK",
            handle: "mobile-upload-\(Int(Date().timeIntervalSince1970))",
            status: .published,
            imageFiles: [
                UploadFilePart(
                    filename: "product.jpg",
                    mimeType: "image/jpeg",
                    data: imageData
                ),
            ],
            optionTitle: "Size",
            optionValues: ["750ml"],
            variantTitle: "750ml",
            sku: "MOBILE_\(Int(Date().timeIntervalSince1970))",
            priceEUR: 39.00,
            priceUSD: 42.00
        )
    }

    static func updateProduct(id: String, newTitle: String, imageData: Data?) async throws -> AdminProduct {
        let client = try makeClient()
        try await client.auth.login(
            email: ProcessInfo.processInfo.environment["MEDUSA_ADMIN_EMAIL"] ?? "admin@tempani.com",
            password: ProcessInfo.processInfo.environment["MEDUSA_ADMIN_PASSWORD"] ?? "supersecret"
        )

        var files: [UploadFilePart] = []
        if let imageData {
            files.append(
                UploadFilePart(filename: "update.jpg", mimeType: "image/jpeg", data: imageData)
            )
        }

        return try await client.products.updateProductWithImages(
            id: id,
            title: newTitle,
            description: "Updated from iOS",
            status: .published,
            imageFiles: files,
            replaceImages: !files.isEmpty
        )
    }
}
