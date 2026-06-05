package com.margelo.nitro.datascanner.extensions

import com.google.android.gms.tasks.Task
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

internal suspend fun <T> Task<T>.await(cancellationMessage: String = "Task was canceled."): T {
  return suspendCancellableCoroutine { continuation ->
    addOnSuccessListener { result ->
      if (continuation.isActive) {
        continuation.resume(result)
      }
    }
    addOnFailureListener { error ->
      if (continuation.isActive) {
        continuation.resumeWithException(error)
      }
    }
    addOnCanceledListener {
      if (continuation.isActive) {
        continuation.resumeWithException(RuntimeException(cancellationMessage))
      }
    }
  }
}
