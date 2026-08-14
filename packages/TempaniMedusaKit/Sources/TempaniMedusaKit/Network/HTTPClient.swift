import Foundation

/// Low-level HTTP client for Medusa Admin routes.
public final class HTTPClient: @unchecked Sendable {
    private let config: MedusaConfig
    private let session: URLSession
    let tokenStore: TokenStore
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    public init(
        config: MedusaConfig,
        tokenStore: TokenStore,
        session: URLSession? = nil
    ) {
        self.config = config
        self.tokenStore = tokenStore
        self.session = session ?? .shared

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        self.decoder = decoder

        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        self.encoder = encoder
    }

    public func request<T: Decodable>(
        method: String,
        path: String,
        query: [String: String?] = [:],
        body: (any Encodable)? = nil,
        authenticated: Bool = true,
        headers: [String: String] = [:]
    ) async throws -> T {
        let encodedBody: Data?
        if let body {
            do {
                encodedBody = try encoder.encode(AnyEncodable(body))
            } catch {
                throw MedusaError.encoding(String(describing: error))
            }
        } else {
            encodedBody = nil
        }

        let data = try await perform(
            method: method,
            path: path,
            query: query,
            httpBody: encodedBody,
            authenticated: authenticated,
            headers: headers,
            contentType: "application/json"
        )

        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw MedusaError.decoding(String(describing: error))
        }
    }

    public func requestEmpty(
        method: String,
        path: String,
        query: [String: String?] = [:],
        body: (any Encodable)? = nil,
        authenticated: Bool = true
    ) async throws {
        let encodedBody: Data?
        if let body {
            do {
                encodedBody = try encoder.encode(AnyEncodable(body))
            } catch {
                throw MedusaError.encoding(String(describing: error))
            }
        } else {
            encodedBody = nil
        }

        _ = try await perform(
            method: method,
            path: path,
            query: query,
            httpBody: encodedBody,
            authenticated: authenticated,
            headers: [:],
            contentType: "application/json"
        )
    }

    public func multipart<T: Decodable>(
        path: String,
        files: [UploadFilePart],
        fieldName: String = "files",
        authenticated: Bool = true
    ) async throws -> T {
        let boundary = "Boundary-\(UUID().uuidString)"
        var body = Data()

        for file in files {
            body.append("--\(boundary)\r\n")
            body.append(
                "Content-Disposition: form-data; name=\"\(fieldName)\"; filename=\"\(file.filename)\"\r\n"
            )
            body.append("Content-Type: \(file.mimeType)\r\n\r\n")
            body.append(file.data)
            body.append("\r\n")
        }
        body.append("--\(boundary)--\r\n")

        let data = try await perform(
            method: "POST",
            path: path,
            query: [:],
            httpBody: body,
            authenticated: authenticated,
            headers: [:],
            contentType: "multipart/form-data; boundary=\(boundary)"
        )

        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw MedusaError.decoding(String(describing: error))
        }
    }

    private func perform(
        method: String,
        path: String,
        query: [String: String?],
        httpBody: Data?,
        authenticated: Bool,
        headers: [String: String],
        contentType: String?
    ) async throws -> Data {
        let url = try buildURL(path: path, query: query)
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.timeoutInterval = config.timeoutInterval
        request.httpBody = httpBody

        for (key, value) in config.defaultHeaders {
            request.setValue(value, forHTTPHeaderField: key)
        }
        for (key, value) in headers {
            request.setValue(value, forHTTPHeaderField: key)
        }
        if let contentType {
            request.setValue(contentType, forHTTPHeaderField: keyContentType)
        }
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        if authenticated {
            try applyAuth(to: &request)
        }

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            throw MedusaError.transport(error.localizedDescription)
        }

        guard let http = response as? HTTPURLResponse else {
            throw MedusaError.transport("Invalid HTTP response")
        }

        guard (200..<300).contains(http.statusCode) else {
            throw MedusaError.httpStatus(http.statusCode, message: Self.extractErrorMessage(from: data))
        }

        return data
    }

    private let keyContentType = "Content-Type"

    private func applyAuth(to request: inout URLRequest) throws {
        if let apiKey = config.adminAPIKey, !apiKey.isEmpty {
            request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
            return
        }
        guard let token = tokenStore.accessToken, !token.isEmpty else {
            throw MedusaError.notAuthenticated
        }
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }

    private func buildURL(path: String, query: [String: String?]) throws -> URL {
        let trimmedBase = config.baseURL.absoluteString.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let trimmedPath = path.hasPrefix("/") ? path : "/\(path)"
        guard var components = URLComponents(string: trimmedBase + trimmedPath) else {
            throw MedusaError.invalidConfiguration("Could not build URL for \(path)")
        }
        let items = query.compactMap { key, value -> URLQueryItem? in
            guard let value else { return nil }
            return URLQueryItem(name: key, value: value)
        }
        if !items.isEmpty {
            components.queryItems = items
        }
        guard let url = components.url else {
            throw MedusaError.invalidConfiguration("Could not resolve URL for \(path)")
        }
        return url
    }

    private static func extractErrorMessage(from data: Data) -> String? {
        if let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            if let message = obj["message"] as? String { return message }
            if let type = obj["type"] as? String { return type }
        }
        return String(data: data, encoding: .utf8)
    }
}

private struct AnyEncodable: Encodable {
    private let encodeFunc: (Encoder) throws -> Void

    init(_ value: any Encodable) {
        encodeFunc = { encoder in try value.encode(to: encoder) }
    }

    func encode(to encoder: Encoder) throws {
        try encodeFunc(encoder)
    }
}

private extension Data {
    mutating func append(_ string: String) {
        if let data = string.data(using: .utf8) {
            append(data)
        }
    }
}

/// A binary file part for multipart uploads to `/admin/uploads`.
public struct UploadFilePart: Sendable {
    public var filename: String
    public var mimeType: String
    public var data: Data

    public init(filename: String, mimeType: String, data: Data) {
        self.filename = filename
        self.mimeType = mimeType
        self.data = data
    }
}
