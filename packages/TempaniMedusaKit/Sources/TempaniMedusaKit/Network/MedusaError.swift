import Foundation

/// Errors thrown by TempaniMedusaKit when talking to the Medusa Admin API.
public enum MedusaError: Error, LocalizedError, Equatable {
    case invalidConfiguration(String)
    case notAuthenticated
    case httpStatus(Int, message: String?)
    case decoding(String)
    case encoding(String)
    case transport(String)
    case emptyResponse
    case uploadFailed(String)

    public var errorDescription: String? {
        switch self {
        case .invalidConfiguration(let message):
            return "Invalid configuration: \(message)"
        case .notAuthenticated:
            return "Not authenticated. Call login or provide an admin API key."
        case .httpStatus(let code, let message):
            return "HTTP \(code): \(message ?? "Unknown error")"
        case .decoding(let message):
            return "Failed to decode response: \(message)"
        case .encoding(let message):
            return "Failed to encode request: \(message)"
        case .transport(let message):
            return "Network error: \(message)"
        case .emptyResponse:
            return "Empty response from Medusa"
        case .uploadFailed(let message):
            return "Upload failed: \(message)"
        }
    }
}
