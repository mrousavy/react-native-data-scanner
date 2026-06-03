import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { DataScanner, type DataScannerCapabilities } from 'react-native-data-scanner'

export default function App() {
  const [status, setStatus] = useState('Ready')
  const [capabilities, setCapabilities] =
    useState<DataScannerCapabilities | null>(null)

  const loadCapabilities = useCallback(async () => {
    try {
      const nextCapabilities = await DataScanner.getCapabilities()
      setCapabilities(nextCapabilities)
      setStatus(
        nextCapabilities.isCodeScannerAvailable
          ? 'Code scanner is available'
          : 'Code scanner is not available'
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setStatus(message)
    }
  }, [])

  const scanCode = useCallback(async () => {
    try {
      setStatus('Scanning...')
      const code = await DataScanner.scanCode({
        barcodeFormats: ['qr', 'ean-13', 'code-128'],
        enableAutoZoom: true,
        allowManualInput: true,
      })
      setStatus(`${code.format}: ${code.rawValue}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setStatus(message)
    }
  }, [])

  useEffect(() => {
    loadCapabilities()
  }, [loadCapabilities])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>react-native-data-scanner</Text>
      <Button title="Refresh Capabilities" onPress={loadCapabilities} />
      <View style={styles.buttonSpacer} />
      <Button title="Scan Code" onPress={scanCode} />
      {capabilities != null && (
        <Text style={styles.capabilities}>
          {capabilities.supportedBarcodeFormats.join(', ')}
        </Text>
      )}
      <Text style={styles.status}>{status}</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  status: {
    marginTop: 16,
    textAlign: 'center',
  },
  buttonSpacer: {
    height: 12,
  },
  capabilities: {
    marginTop: 16,
    textAlign: 'center',
    color: '#555',
  },
})
