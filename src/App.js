import React, { useState } from 'react';

import Chat from './Chat';
import { Flex } from './Flex';
import Landing from './Landing';

function App() {
  const [scrolled, setScrolled] = useState(false);
  console.log('scrolled', scrolled);

  return <Flex height="100vh" width="100vw" position="relative" >
    <Landing visible={!scrolled} onScrollClick={() => setScrolled(true)} />
    <Chat visible={scrolled} />
  </Flex>
}

export default App;
