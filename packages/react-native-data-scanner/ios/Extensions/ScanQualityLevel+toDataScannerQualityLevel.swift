import VisionKit

@available(iOS 16.0, visionOS 1.0, *)
extension ScanQualityLevel {
  func toDataScannerQualityLevel() -> DataScannerViewController.QualityLevel {
    switch self {
    case .fast:
      return .fast
    case .balanced:
      return .balanced
    case .accurate:
      return .accurate
    }
  }
}
