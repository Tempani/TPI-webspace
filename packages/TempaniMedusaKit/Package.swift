// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "TempaniMedusaKit",
    platforms: [
        .iOS(.v16),
        .macOS(.v13),
    ],
    products: [
        .library(
            name: "TempaniMedusaKit",
            targets: ["TempaniMedusaKit"]
        ),
    ],
    targets: [
        .target(
            name: "TempaniMedusaKit",
            path: "Sources/TempaniMedusaKit"
        ),
        .testTarget(
            name: "TempaniMedusaKitTests",
            dependencies: ["TempaniMedusaKit"],
            path: "Tests/TempaniMedusaKitTests"
        ),
    ]
)
