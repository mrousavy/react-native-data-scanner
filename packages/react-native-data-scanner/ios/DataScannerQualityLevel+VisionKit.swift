import VisionKit

extension DataScannerQualityLevel {
  @available(iOS 16.0, *)
  var visionKitQualityLevel: DataScannerViewController.QualityLevel {
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
