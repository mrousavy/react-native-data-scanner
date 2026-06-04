import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { DataScanner } from 'react-native-data-scanner'

export default function App() {
  const [status, setStatus] = useState('Ready')

  const scan = useCallback(async () => {
    try {
      setStatus('Scanning...')
      const code = await DataScanner.scan({
        formats: 'all',
        qualityLevel: 'balanced',
        enableAutoZoom: true,
      })
      setStatus(`${code.format}: ${code.rawValue}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setStatus(message)
    }
  }, [])

  useEffect(() => {
    scan()
  }, [scan])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>react-native-data-scanner</Text>
      <Button title="Scan Code" onPress={scan} />
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
})
