
'use client';
import FcmNotificationButton from './components/FcmNotificationButton'

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>My App with Push Notifications</h1>
      {/* Add the notification button */}
      <FcmNotificationButton />
      {/* Manual test button */}
      <TestNotificationButton />
    </main>
  )
}

// Simple test button component
function TestNotificationButton() {
  const sendTest = async () => {
    const res = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Notification',
        body: 'This is a test from Firebase!',
        url: '/'
      })
    })
    const data = await res.json()
    alert(JSON.stringify(data, null, 2))
  }

  return (
    <button
      onClick={sendTest}
      style={{ marginTop: 20, padding: '10px 20px' }}
    >
      Send Test Notification
    </button>
  )
}