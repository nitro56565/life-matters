import Routing from './Routing';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
      <>
        <Routing />
        <Analytics />
      </>
  )
}

export default App