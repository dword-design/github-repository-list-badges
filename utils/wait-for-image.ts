export default (img: HTMLImageElement) =>
  img.complete
    ? undefined
    : new Promise<void>(resolve => {
        const handleComplete = () => {
          img.removeEventListener('load', handleComplete);
          img.removeEventListener('error', handleComplete);
          resolve();
        };

        img.addEventListener('load', handleComplete);
        img.addEventListener('error', handleComplete);
      });
