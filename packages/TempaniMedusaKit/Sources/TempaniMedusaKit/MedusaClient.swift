import Foundation

/// Primary entry point for Xcode / iOS apps that manage Tempani products
/// through the Medusa Admin API.
///
/// ```swift
/// let client = try MedusaClient(baseURLString: "https://api.tempani.com")
/// try await client.auth.login(email: "admin@tempani.com", password: "secret")
///
/// let product = try await client.products.createProductWithImages(
///     title: "Estate Cabernet",
///     description: "Hillside reserve",
///     imageFiles: [UploadFilePart(filename: "bottle.jpg", mimeType: "image/jpeg", data: jpegData)],
///     priceEUR: 48.00
/// )
/// ```
public final class MedusaClient: @unchecked Sendable {
    public let config: MedusaConfig
    public let tokenStore: TokenStore
    public let auth: AuthService
    public let uploads: UploadService
    public let products: ProductService

    private let http: HTTPClient

    public init(config: MedusaConfig, session: URLSession? = nil) {
        self.config = config
        let store = TokenStore()
        self.tokenStore = store
        let http = HTTPClient(config: config, tokenStore: store, session: session)
        self.http = http
        self.auth = AuthService(http: http, tokenStore: store)
        self.uploads = UploadService(http: http)
        self.products = ProductService(http: http, uploads: self.uploads)
    }

    public convenience init(baseURLString: String, adminAPIKey: String? = nil) throws {
        let config = try MedusaConfig(baseURLString: baseURLString, adminAPIKey: adminAPIKey)
        self.init(config: config)
    }

    public convenience init(baseURL: URL, adminAPIKey: String? = nil) {
        self.init(config: MedusaConfig(baseURL: baseURL, adminAPIKey: adminAPIKey))
    }
}
