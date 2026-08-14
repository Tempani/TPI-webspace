import Foundation

/// Product catalogue operations against Medusa Admin API.
public struct ProductService: Sendable {
    private let http: HTTPClient
    private let uploads: UploadService

    public init(http: HTTPClient, uploads: UploadService) {
        self.http = http
        self.uploads = uploads
    }

    /// Lists products (`GET /admin/products`).
    public func list(
        limit: Int = 50,
        offset: Int = 0,
        q: String? = nil,
        fields: String? = "*variants,*images,*categories"
    ) async throws -> AdminProductListResponse {
        try await http.request(
            method: "GET",
            path: "/admin/products",
            query: [
                "limit": String(limit),
                "offset": String(offset),
                "q": q,
                "fields": fields,
            ]
        )
    }

    /// Retrieves a single product by ID.
    public func retrieve(
        id: String,
        fields: String? = "*variants,*images,*categories,*collection"
    ) async throws -> AdminProduct {
        let response: AdminProductResponse = try await http.request(
            method: "GET",
            path: "/admin/products/\(id)",
            query: ["fields": fields]
        )
        return response.product
    }

    /// Creates a product (`POST /admin/products`).
    public func create(_ request: CreateProductRequest) async throws -> AdminProduct {
        let response: AdminProductResponse = try await http.request(
            method: "POST",
            path: "/admin/products",
            body: request
        )
        return response.product
    }

    /// Updates a product (`POST /admin/products/{id}`).
    public func update(id: String, _ request: UpdateProductRequest) async throws -> AdminProduct {
        let response: AdminProductResponse = try await http.request(
            method: "POST",
            path: "/admin/products/\(id)",
            body: request
        )
        return response.product
    }

    /// Soft-deletes a product (`DELETE /admin/products/{id}`).
    public func delete(id: String) async throws -> DeleteProductResponse {
        try await http.request(
            method: "DELETE",
            path: "/admin/products/\(id)"
        )
    }

    /// High-level helper: upload images, then create a product with those image URLs.
    public func createProductWithImages(
        title: String,
        description: String? = nil,
        handle: String? = nil,
        status: ProductStatus = .published,
        imageFiles: [UploadFilePart],
        optionTitle: String = "Size",
        optionValues: [String] = ["Default"],
        variantTitle: String = "Default",
        sku: String? = nil,
        priceEUR: Double,
        priceUSD: Double? = nil,
        categoryIds: [String]? = nil,
        shippingProfileId: String? = nil,
        salesChannelId: String? = nil
    ) async throws -> AdminProduct {
        var images: [ProductImageInput] = []
        var thumbnail: String?

        if !imageFiles.isEmpty {
            let uploaded = try await uploads.upload(files: imageFiles)
            images = uploaded.map { ProductImageInput(url: $0.url) }
            thumbnail = uploaded.first?.url
        }

        var prices = [MoneyAmount(amount: priceEUR, currencyCode: "eur")]
        if let priceUSD {
            prices.append(MoneyAmount(amount: priceUSD, currencyCode: "usd"))
        }

        let request = CreateProductRequest(
            title: title,
            description: description,
            handle: handle,
            status: status,
            thumbnail: thumbnail,
            images: images.isEmpty ? nil : images,
            options: [
                ProductOptionInput(title: optionTitle, values: optionValues),
            ],
            variants: [
                ProductVariantInput(
                    title: variantTitle,
                    sku: sku,
                    prices: prices,
                    options: [optionTitle: optionValues.first ?? "Default"],
                    manageInventory: true
                ),
            ],
            categoryIds: categoryIds,
            shippingProfileId: shippingProfileId,
            salesChannels: salesChannelId.map { [SalesChannelLink(id: $0)] }
        )

        return try await create(request)
    }

    /// High-level helper: upload new images and patch an existing product.
    public func updateProductWithImages(
        id: String,
        title: String? = nil,
        description: String? = nil,
        status: ProductStatus? = nil,
        imageFiles: [UploadFilePart] = [],
        replaceImages: Bool = true
    ) async throws -> AdminProduct {
        var images: [ProductImageInput]?
        var thumbnail: String?

        if !imageFiles.isEmpty {
            let uploaded = try await uploads.upload(files: imageFiles)
            images = uploaded.map { ProductImageInput(url: $0.url) }
            thumbnail = uploaded.first?.url
        }

        let request = UpdateProductRequest(
            title: title,
            description: description,
            status: status,
            thumbnail: thumbnail,
            images: replaceImages ? images : nil
        )

        return try await update(id: id, request)
    }
}
