import Foundation

#if canImport(UIKit)
import UIKit
#endif

/// Uploads files to Medusa Admin (`POST /admin/uploads`).
public struct UploadService: Sendable {
    private let http: HTTPClient

    public init(http: HTTPClient) {
        self.http = http
    }

    /// Uploads one or more binary files and returns their public URLs / IDs.
    public func upload(files: [UploadFilePart]) async throws -> [AdminFile] {
        guard !files.isEmpty else {
            throw MedusaError.uploadFailed("No files provided")
        }
        let response: AdminFileListResponse = try await http.multipart(
            path: "/admin/uploads",
            files: files
        )
        return response.files
    }

    /// Uploads a single JPEG/PNG image from raw data.
    public func uploadImage(
        data: Data,
        filename: String = "product.jpg",
        mimeType: String = "image/jpeg"
    ) async throws -> AdminFile {
        let files = try await upload(
            files: [UploadFilePart(filename: filename, mimeType: mimeType, data: data)]
        )
        guard let file = files.first else {
            throw MedusaError.uploadFailed("Upload returned no files")
        }
        return file
    }

    #if canImport(UIKit)
    /// Convenience: upload a `UIImage` as JPEG.
    public func uploadImage(
        _ image: UIImage,
        filename: String = "product.jpg",
        compressionQuality: CGFloat = 0.85
    ) async throws -> AdminFile {
        guard let data = image.jpegData(compressionQuality: compressionQuality) else {
            throw MedusaError.uploadFailed("Could not encode UIImage as JPEG")
        }
        return try await uploadImage(data: data, filename: filename, mimeType: "image/jpeg")
    }
    #endif
}
