import { useEffect, useState } from 'react';

export default function useHeight() {
  // @ts-ignore-next-line
  const [height, setHeight] = useState(window.innerHeight * (window.visualViewport?.scale || 1));

  useEffect(() => {
    const onResize = () => {
      // @ts-ignore-next-line
      setHeight(window.innerHeight * (window.visualViewport?.scale || 1));
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return height + 'px';
}
