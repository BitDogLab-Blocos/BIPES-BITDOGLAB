'use strict';

(function(global) {
  function initializeOnboarding() {
    var startBtn = document.getElementById('startAdventureBtn');
    var welcomeMsg = document.getElementById('welcome-message');
    var partnershipNotice = document.getElementById('partnership-notice');
    var closePartnershipBtn = document.getElementById('closePartnershipBtn');
    var tutorialContainer = document.getElementById('tutorial-steps');
    var closeTutorialBtn = document.getElementById('closeTutorialBtn');
    var startCodingBtn = document.getElementById('startCodingBtn');
    var additionalSteps = document.getElementById('additional-steps');

    document.head.insertAdjacentHTML(
      'beforeend',
      '<style>@keyframes bounce{0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-20px)}60%{transform:translateY(-10px)}}</style>'
    );

    if (welcomeMsg) {
      welcomeMsg.style.display = 'flex';
    }

    if (startBtn && welcomeMsg && partnershipNotice) {
      startBtn.addEventListener('click', function() {
        welcomeMsg.style.opacity = '0';
        setTimeout(function() {
          welcomeMsg.style.display = 'none';
          partnershipNotice.style.display = 'flex';
          partnershipNotice.style.opacity = '0';
          void partnershipNotice.offsetWidth;
          setTimeout(function() {
            partnershipNotice.style.opacity = '1';
          }, 50);
        }, 1000);
      });
    }

    if (closePartnershipBtn && partnershipNotice && tutorialContainer) {
      closePartnershipBtn.addEventListener('click', function() {
        partnershipNotice.style.opacity = '0';
        setTimeout(function() {
          partnershipNotice.style.display = 'none';
          tutorialContainer.style.display = 'block';
          localStorage.setItem('bitdoglab_visited', 'true');
        }, 1000);
      });
    }

    if (startCodingBtn && additionalSteps) {
      startCodingBtn.addEventListener('click', function() {
        if (additionalSteps.style.display === 'block') {
          additionalSteps.style.display = 'none';
        } else {
          additionalSteps.style.display = 'block';
          additionalSteps.style.backgroundColor = '#f5f0d5';
          setTimeout(function() {
            additionalSteps.style.backgroundColor = '#fafafa';
          }, 1000);
          additionalSteps.scrollIntoView({behavior: 'smooth'});
          startCodingBtn.style.animation = 'bounce 0.5s';
          setTimeout(function() {
            startCodingBtn.style.animation = '';
          }, 500);
        }
      });
    }

    if (closeTutorialBtn && tutorialContainer) {
      closeTutorialBtn.addEventListener('click', function() {
        tutorialContainer.style.display = 'none';
      });
    }

    if (startCodingBtn && tutorialContainer) {
      startCodingBtn.addEventListener('click', function() {
        tutorialContainer.style.display = 'none';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOnboarding);
  } else {
    initializeOnboarding();
  }

  global.BitDogLabOnboarding = {
    init: initializeOnboarding
  };
})(window);
