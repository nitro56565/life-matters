import Routing from './Routing';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

function App() {
  return (
      <>
        <Routing />
        <Analytics />
        <SpeedInsights />
      </>
  )
}

export default App