import Foundation

// MARK: - Auth

public struct LoginRequest: Encodable, Sendable {
    public var email: String
    public var password: String

    public init(email: String, password: String) {
        self.email = email
        self.password = password
    }
}

public struct LoginResponse: Decodable, Sendable {
    public var token: String
}

// MARK: - Uploads

public struct AdminFile: Codable, Sendable, Identifiable, Equatable {
    public var id: String
    public var url: String
}

public struct AdminFileListResponse: Decodable, Sendable {
    public var files: [AdminFile]
}

// MARK: - Products

public enum ProductStatus: String, Codable, Sendable {
    case draft
    case proposed
    case published
    case rejected
}

public struct MoneyAmount: Codable, Sendable, Equatable {
    public var amount: Double
    public var currencyCode: String

    public init(amount: Double, currencyCode: String) {
        self.amount = amount
        self.currencyCode = currencyCode
    }

    enum CodingKeys: String, CodingKey {
        case amount
        case currencyCode = "currency_code"
    }
}

public struct ProductImageInput: Codable, Sendable, Equatable {
    public var url: String

    public init(url: String) {
        self.url = url
    }
}

public struct ProductOptionInput: Codable, Sendable, Equatable {
    public var title: String
    public var values: [String]

    public init(title: String, values: [String]) {
        self.title = title
        self.values = values
    }
}

public struct ProductVariantInput: Codable, Sendable, Equatable {
    public var title: String
    public var sku: String?
    public var prices: [MoneyAmount]?
    public var options: [String: String]?
    public var manageInventory: Bool?

    public init(
        title: String,
        sku: String? = nil,
        prices: [MoneyAmount]? = nil,
        options: [String: String]? = nil,
        manageInventory: Bool? = true
    ) {
        self.title = title
        self.sku = sku
        self.prices = prices
        self.options = options
        self.manageInventory = manageInventory
    }

    enum CodingKeys: String, CodingKey {
        case title, sku, prices, options
        case manageInventory = "manage_inventory"
    }
}

/// Payload for `POST /admin/products` (create).
public struct CreateProductRequest: Codable, Sendable {
    public var title: String
    public var subtitle: String?
    public var description: String?
    public var handle: String?
    public var status: ProductStatus?
    public var thumbnail: String?
    public var images: [ProductImageInput]?
    public var options: [ProductOptionInput]?
    public var variants: [ProductVariantInput]?
    public var categoryIds: [String]?
    public var collectionId: String?
    public var shippingProfileId: String?
    public var salesChannels: [SalesChannelLink]?
    public var weight: Double?
    public var metadata: [String: String]?

    public init(
        title: String,
        subtitle: String? = nil,
        description: String? = nil,
        handle: String? = nil,
        status: ProductStatus? = .published,
        thumbnail: String? = nil,
        images: [ProductImageInput]? = nil,
        options: [ProductOptionInput]? = nil,
        variants: [ProductVariantInput]? = nil,
        categoryIds: [String]? = nil,
        collectionId: String? = nil,
        shippingProfileId: String? = nil,
        salesChannels: [SalesChannelLink]? = nil,
        weight: Double? = nil,
        metadata: [String: String]? = nil
    ) {
        self.title = title
        self.subtitle = subtitle
        self.description = description
        self.handle = handle
        self.status = status
        self.thumbnail = thumbnail
        self.images = images
        self.options = options
        self.variants = variants
        self.categoryIds = categoryIds
        self.collectionId = collectionId
        self.shippingProfileId = shippingProfileId
        self.salesChannels = salesChannels
        self.weight = weight
        self.metadata = metadata
    }

    enum CodingKeys: String, CodingKey {
        case title, subtitle, description, handle, status, thumbnail, images, options, variants, weight, metadata
        case categoryIds = "category_ids"
        case collectionId = "collection_id"
        case shippingProfileId = "shipping_profile_id"
        case salesChannels = "sales_channels"
    }
}

public struct SalesChannelLink: Codable, Sendable, Equatable {
    public var id: String
    public init(id: String) { self.id = id }
}

/// Payload for `POST /admin/products/{id}` (update). All fields optional.
public struct UpdateProductRequest: Codable, Sendable {
    public var title: String?
    public var subtitle: String?
    public var description: String?
    public var handle: String?
    public var status: ProductStatus?
    public var thumbnail: String?
    public var images: [ProductImageInput]?
    public var categoryIds: [String]?
    public var collectionId: String?
    public var metadata: [String: String]?

    public init(
        title: String? = nil,
        subtitle: String? = nil,
        description: String? = nil,
        handle: String? = nil,
        status: ProductStatus? = nil,
        thumbnail: String? = nil,
        images: [ProductImageInput]? = nil,
        categoryIds: [String]? = nil,
        collectionId: String? = nil,
        metadata: [String: String]? = nil
    ) {
        self.title = title
        self.subtitle = subtitle
        self.description = description
        self.handle = handle
        self.status = status
        self.thumbnail = thumbnail
        self.images = images
        self.categoryIds = categoryIds
        self.collectionId = collectionId
        self.metadata = metadata
    }

    enum CodingKeys: String, CodingKey {
        case title, subtitle, description, handle, status, thumbnail, images, metadata
        case categoryIds = "category_ids"
        case collectionId = "collection_id"
    }
}

public struct AdminProductImage: Codable, Sendable, Identifiable, Equatable {
    public var id: String?
    public var url: String
    public var rank: Int?
}

public struct AdminProductVariant: Codable, Sendable, Identifiable, Equatable {
    public var id: String
    public var title: String?
    public var sku: String?
}

public struct AdminProduct: Codable, Sendable, Identifiable, Equatable {
    public var id: String
    public var title: String
    public var subtitle: String?
    public var description: String?
    public var handle: String?
    public var status: ProductStatus?
    public var thumbnail: String?
    public var images: [AdminProductImage]?
    public var variants: [AdminProductVariant]?
    public var createdAt: String?
    public var updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id, title, subtitle, description, handle, status, thumbnail, images, variants
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

public struct AdminProductResponse: Decodable, Sendable {
    public var product: AdminProduct
}

public struct AdminProductListResponse: Decodable, Sendable {
    public var products: [AdminProduct]
    public var count: Int?
    public var offset: Int?
    public var limit: Int?
}

public struct DeleteProductResponse: Decodable, Sendable {
    public var id: String?
    public var deleted: Bool?
    public var object: String?
}
