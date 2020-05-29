/* Simple Swipe ------------------------------------------------------------- */

(() => {
  if (!window.ORL) window.ORL = {};
  // once
  if (typeof window.ORL.simpleSwipe !== 'function') {
    window.ORL.simpleSwipe = () => {
      let xDown = null;
      let yDown = null;
      let xDiff = null;
      let yDiff = null;
      let timeDown = null;
      let startEl = null;

      function handleTouchStart(e) {
        // 'data-noswipe' attribute disable the functionality
        if (e.target.getAttribute('data-noswipe') === 'true') return;
        startEl = e.target;
        timeDown = Date.now();
        xDown = e.touches[0].clientX;
        yDown = e.touches[0].clientY;
        xDiff = 0;
        yDiff = 0;
      }

      function handleTouchMove(e) {
        if (!xDown || !yDown) return;
        const xUp = e.touches[0].clientX;
        const yUp = e.touches[0].clientY;
        xDiff = xDown - xUp;
        yDiff = yDown - yUp;
      }

      function handleTouchEnd(e) {
        // cancel if released on a different target
        if (startEl !== e.target) return;

        const swipeThreshold = parseInt(startEl.getAttribute('data-swipe-threshold') || '20', 10); // have to be around 20px
        const swipeTimeout = parseInt(startEl.getAttribute('data-swipe-timeout') || '500', 10); // have to be around 500ms
        const timeDiff = Date.now() - timeDown;
        let eventType = '';

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
            if (xDiff > 0) {
              eventType = 'swiped-left';
            } else {
              eventType = 'swiped-right';
            }
          }
        } else if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
          if (yDiff > 0) {
            eventType = 'swiped-up';
          } else {
            eventType = 'swiped-down';
          }
        }

        if (eventType !== '') {
          // fire event on the element
          if (typeof window.CustomEvent === 'function') startEl.dispatchEvent(new CustomEvent(eventType, { bubbles: true, cancelable: true }));
          // console.log(`'${eventType}' fired on (${startEl.classList})`);
        }

        xDown = null;
        yDown = null;
        timeDown = null;
      }

      document.addEventListener('touchstart', handleTouchStart, false);
      document.addEventListener('touchmove', handleTouchMove, false);
      document.addEventListener('touchend', handleTouchEnd, false);
    };
    window.ORL.simpleSwipe();
  }
})();
