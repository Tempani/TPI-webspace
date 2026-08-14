import Foundation

/// Configuration for connecting an Xcode / iOS app to the Tempani Medusa backend.
public struct MedusaConfig: Sendable, Equatable {
    /// Base URL of the Medusa server, e.g. `https://api.tempani.com` or `http://localhost:9000`.
    public var baseURL: URL

    /// Optional secret Admin API key (`sk_...`). Prefer this for trusted server-side /
    /// staff apps. Leave `nil` when using email/password JWT login instead.
    public var adminAPIKey: String?

    /// Extra headers applied to every request.
    public var defaultHeaders: [String: String]

    /// Request timeout in seconds.
    public var timeoutInterval: TimeInterval

    public init(
        baseURL: URL,
        adminAPIKey: String? = nil,
        defaultHeaders: [String: String] = [:],
        timeoutInterval: TimeInterval = 60
    ) {
        self.baseURL = baseURL
        self.adminAPIKey = adminAPIKey
        self.defaultHeaders = defaultHeaders
        self.timeoutInterval = timeoutInterval
    }

    /// Convenience initializer from a string URL.
    public init(
        baseURLString: String,
        adminAPIKey: String? = nil
    ) throws {
        guard let url = URL(string: baseURLString) else {
            throw MedusaError.invalidConfiguration("Invalid base URL: \(baseURLString)")
        }
        self.init(baseURL: url, adminAPIKey: adminAPIKey)
    }
}
