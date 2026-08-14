import XCTest
@testable import TempaniMedusaKit

final class TempaniMedusaKitTests: XCTestCase {
    func testConfigRejectsInvalidURL() {
        XCTAssertThrowsError(try MedusaConfig(baseURLString: "not a url"))
    }

    func testCreateProductRequestEncoding() throws {
        let request = CreateProductRequest(
            title: "Tempani Estate Cabernet",
            description: "Hillside reserve",
            handle: "estate-cabernet",
            status: .published,
            images: [ProductImageInput(url: "https://cdn.example/bottle.jpg")],
            options: [ProductOptionInput(title: "Size", values: ["750ml"])],
            variants: [
                ProductVariantInput(
                    title: "750ml",
                    sku: "CAB_750",
                    prices: [MoneyAmount(amount: 48, currencyCode: "eur")],
                    options: ["Size": "750ml"]
                ),
            ]
        )

        let data = try JSONEncoder().encode(request)
        let json = try XCTUnwrap(JSONSerialization.jsonObject(with: data) as? [String: Any])
        XCTAssertEqual(json["title"] as? String, "Tempani Estate Cabernet")
        XCTAssertEqual(json["handle"] as? String, "estate-cabernet")
        XCTAssertNotNil(json["variants"])
        XCTAssertNotNil(json["options"])
    }

    func testUpdateProductRequestOmitsNils() throws {
        let request = UpdateProductRequest(title: "Updated", status: .draft)
        let data = try JSONEncoder().encode(request)
        let json = try XCTUnwrap(JSONSerialization.jsonObject(with: data) as? [String: Any])
        XCTAssertEqual(json["title"] as? String, "Updated")
        XCTAssertEqual(json["status"] as? String, "draft")
        XCTAssertNil(json["description"])
    }

    func testTokenStore() {
        let store = TokenStore()
        XCTAssertNil(store.accessToken)
        store.accessToken = "jwt-token"
        XCTAssertEqual(store.accessToken, "jwt-token")
        store.clear()
        XCTAssertNil(store.accessToken)
    }
}
