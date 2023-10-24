'use client'

import Welcome from './welcome/Welcome'
import FlowComponent from './node'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* <Welcome/>  uncomment this to view the original welcome (user registration page)  */}
      <FlowComponent/>
    </main>
  )
}
