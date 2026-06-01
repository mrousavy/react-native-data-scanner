import NitroModules
import Foundation

extension margelo.nitro.datascanner.bridge.swift.std__vector_std__string_ {
  func map<T>(_ transform: (std.string) throws -> T) rethrows -> [T] {
    var result: [T] = []
    result.reserveCapacity(Int(size()))

    for index in 0..<Int(size()) {
      result.append(try transform(self[index]))
    }

    return result
  }
}
