'use client'

import Welcome from './welcome/Welcome'
import FlowComponent from './node/page'

export default function Home() {
  console.log('flow component');
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/*   <FlowComponent/> uncomment this to view the original welcome (user registration page)  */}
      <Welcome/>
    </main>
  )
}
