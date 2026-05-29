import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { DataScanner } from 'react-native-data-scanner'

export default function App() {
  const [status, setStatus] = useState('Ready')

  const createDataScanner = useCallback(() => {
    try {
      DataScanner.createDataScanner()
      setStatus('createDataScanner() returned')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setStatus(message)
    }
  }, [])

  useEffect(() => {
    createDataScanner()
  }, [createDataScanner])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>react-native-data-scanner</Text>
      <Button title="Create Data Scanner" onPress={createDataScanner} />
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
