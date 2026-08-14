import Foundation

/// Thread-safe token store for JWT sessions.
public final class TokenStore: @unchecked Sendable {
    private let lock = NSLock()
    private var _accessToken: String?

    public init(accessToken: String? = nil) {
        self._accessToken = accessToken
    }

    public var accessToken: String? {
        get {
            lock.lock()
            defer { lock.unlock() }
            return _accessToken
        }
        set {
            lock.lock()
            _accessToken = newValue
            lock.unlock()
        }
    }

    public func clear() {
        accessToken = nil
    }
}
