'use client';

import React, { useState, useEffect } from 'react';

const chars = '!<>-_\\/[]{}—=+*^?#________';

export default function DecryptionText({ text, speed = 100 }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let frame = 0;
    const length = text.length;

    const interval = setInterval(() => {
      let output = '';
      for (let i = 0; i < length; i++) {
        if (i < frame) {
          output += text[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayed(output);

      frame++;
      if (frame > length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}
