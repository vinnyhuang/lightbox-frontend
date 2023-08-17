import React from 'react';

import flosImg from './images/powered_by_flos.svg';
import lightboxImg from './images/lightbox_logo.svg';
import scrollImg from './images/landing_scroll.svg';
import { Flex } from './Flex';

function Landing({ visible, onScrollClick }) {
  return (
    <Flex
      width="100vw"
      height="100vh"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      style={{
        position: 'absolute',
        top: visible ? '0' : '-100vh',
        transition: 'top 1s ease-in-out',
      }}
    >
      <Flex padding="20px 30px" alignSelf="flex-start">
        <img src={flosImg} alt="Powered by Flos" />
      </Flex>

      <Flex flexDirection="column">
        <img src={lightboxImg} alt="Lightbox Logo" />
        <Flex></Flex>
      </Flex>

      <img
        src={scrollImg}
        alt="Click to Start"
        style={{ marginBottom: '30px', cursor: 'pointer' }}
        onClick={onScrollClick}
      />
    </Flex>
  );
}

export default Landing;
