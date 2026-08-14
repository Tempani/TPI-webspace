import Foundation

/// Authenticates against Medusa Admin (`/auth/user/emailpass`).
public struct AuthService: Sendable {
    private let http: HTTPClient
    private let tokenStore: TokenStore

    public init(http: HTTPClient, tokenStore: TokenStore) {
        self.http = http
        self.tokenStore = tokenStore
    }

    /// Logs in an admin user and stores the JWT for subsequent Admin API calls.
    @discardableResult
    public func login(email: String, password: String) async throws -> String {
        let response: LoginResponse = try await http.request(
            method: "POST",
            path: "/auth/user/emailpass",
            body: LoginRequest(email: email, password: password),
            authenticated: false
        )
        tokenStore.accessToken = response.token
        return response.token
    }

    public func logout() {
        tokenStore.clear()
    }

    public var isAuthenticated: Bool {
        if let token = tokenStore.accessToken, !token.isEmpty {
            return true
        }
        return false
    }
}
