// Constellation interactivity + scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  const stars = document.querySelectorAll('.constellation-container .star');
  const constellationLines = document.querySelectorAll('.constellation-line');
  const constellationGroups = document.querySelectorAll('.constellation-group');
  const skillTooltip = document.getElementById('skill-tooltip');
  const skillTooltipTitle = skillTooltip?.querySelector('.skill-tooltip__title');
  const skillTooltipMeta = skillTooltip?.querySelector('.skill-tooltip__meta');
  const constellationContainer = document.querySelector('.constellation-container');
  
  // Shared hover tooltip (single box beside hovered star)
  stars.forEach(star => {
    star.addEventListener('mouseenter', (event) => {
      if (!skillTooltip || !skillTooltipTitle || !skillTooltipMeta || !constellationContainer) return;

      const target = event.currentTarget;
      const skill = target.getAttribute('data-skill') || '';
      const level = target.getAttribute('data-level') || '';
      const years = target.getAttribute('data-years') || '';
      const projects = target.getAttribute('data-projects') || '';

      skillTooltipTitle.textContent = skill;

      const metaLines = [];
      if (level) metaLines.push(`Level: ${level}%`);
      if (years) metaLines.push(`Experience: ${years} year${years === '1' ? '' : 's'}`);
      if (projects) metaLines.push(`Projects: ${projects}+`);
      skillTooltipMeta.innerHTML = metaLines.map(line => `<span>${line}</span>`).join('');

      const starRect = target.getBoundingClientRect();
      const containerRect = constellationContainer.getBoundingClientRect();

      // Tooltip is positioned relative to the constellation container.
      // CSS sets transform: translateY(-50%), so `top` should be the star center Y.
      const starCenterY = starRect.top + starRect.height / 2;
      const relativeCenterY = starCenterY - containerRect.top;

      const tooltipWidth = skillTooltip.offsetWidth || 240; // sensible fallback
      const tooltipHeight = skillTooltip.offsetHeight || 120; // sensible fallback

      const gapX = 14;
      const margin = 10;

      // Default: place to the right of the star.
      let left = starRect.right - containerRect.left + gapX;
      let placeLeft = false;

      // Smart flip: if it overflows the container on the right, move to the left.
      if (left + tooltipWidth > containerRect.width - margin) {
        placeLeft = true;
        left = starRect.left - containerRect.left - tooltipWidth - gapX;
      }

      // Clamp horizontally to keep it inside the container.
      left = Math.max(margin, Math.min(left, containerRect.width - tooltipWidth - margin));

      // Clamp vertically to avoid cutting off at top/bottom.
      let top = relativeCenterY;
      top = Math.max(margin + tooltipHeight / 2, top);
      top = Math.min(containerRect.height - margin - tooltipHeight / 2, top);

      skillTooltip.classList.toggle('skill-tooltip--left', placeLeft);
      skillTooltip.style.left = `${left}px`;
      skillTooltip.style.top = `${top}px`;
      skillTooltip.classList.add('visible');
    });

    star.addEventListener('mouseleave', () => {
      if (skillTooltip) {
        skillTooltip.classList.remove('visible', 'skill-tooltip--left');
      }
    });
  });

  // Scroll reveal for constellation groups / labels
  if ('IntersectionObserver' in window && constellationGroups.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Fade in corresponding constellation lines
            const constellation = entry.target.getAttribute('data-constellation');
            const delay = constellation === 'languages' ? 0 : 300; // Match staggered animation
            setTimeout(() => {
              constellationLines.forEach(line => {
                if (line.getAttribute('data-constellation') === constellation) {
                  line.style.strokeOpacity = '0.7';
                }
              });
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.3,
      }
    );

    constellationGroups.forEach(group => observer.observe(group));
  } else {
    // Fallback: show all groups if IntersectionObserver is not supported
    constellationGroups.forEach(group => {
      group.classList.add('visible');
      const constellation = group.getAttribute('data-constellation');
      constellationLines.forEach(line => {
        if (line.getAttribute('data-constellation') === constellation) {
          line.style.strokeOpacity = '0.7';
        }
      });
    });
  }
});

// Floating Question Button functionality
const modal = document.getElementById('question-modal');
const questionButton = document.getElementById('question-button');
const closeButton = document.querySelector('.close-button');

questionButton.addEventListener('click', function() {
  modal.style.display = 'block';
});

closeButton.addEventListener('click', function() {
  modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});


//Background stars
document.addEventListener("DOMContentLoaded", function () {
  const starContainer = document.querySelector(".background-stars");
  const numStars = 150; // Adjust this to fill your backdrop

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Random size between 1px and 3px to simulate distant stars
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Random position across the entire viewport
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;

    // Optionally randomize opacity (0.5 to 1)
    star.style.opacity = Math.random() * 0.5 + 0.5;

    starContainer.appendChild(star);
  }
});





// Rocket scroll effect
window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;
  const rocket = document.querySelector('.rocket');

  // Movement factors: adjust these multipliers to fine-tune the effect
  const horizontalMovement = scrollY * 0.6; // moves leftwards from the right edge
  const verticalMovement = scrollY * 0.33;   // moves downward

  // Scale factor: starts at 1 and grows as you scroll
  const scaleFactor = 1 + scrollY * 0.003;

  // Apply the combined transformation:
  rocket.style.transform = `translate(-${horizontalMovement}px, ${verticalMovement}px) scale(${scaleFactor})`;
});


//Planet scroll effect
window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;
  const planets = document.querySelectorAll('.planet');
  
  planets.forEach(planet => {
    // Get the speed value from the data attribute (or default to 0.1)
    const speed = parseFloat(planet.getAttribute('data-speed')) || 0.01;
    // Adjust the translateY based on scroll position and speed.
    planet.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// Shooting star position effect:
document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll(".shooting-star");
  stars.forEach((star) => {
    // Randomize duration between 4 and 6 seconds
    const duration = (Math.random() * 2 + 4).toFixed(2);
    star.style.animationDuration = `${duration}s`;
    star.style.setProperty("--duration", `${duration}s`);

    // Randomize starting vertical position along the left edge (0 to viewport height)
    star.style.top = `${Math.random() * (window.innerHeight * 0.3)}px`;

    // Base endpoint: from left edge to roughly the bottom right of the viewport
    const baseX = window.innerWidth;
    const baseY = window.innerHeight;
    // Positive variation only so that they always go down/right:
    const variationX = Math.floor(Math.random() * 50); // 0-50px extra
    const variationY = Math.floor(Math.random() * 50); // 0-50px extra

    star.style.setProperty("--x-translate", `${baseX + variationX}px`);
    star.style.setProperty("--y-translate", `${baseY + variationY}px`);
  });
});


window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;
  const stars = document.querySelectorAll('.shooting-star');
  
  stars.forEach((star, index) => {
    // Get speed from data attribute
    const speed = parseFloat(star.getAttribute('data-speed')) || 0.5;
    
    // Calculate translation: move upward and to the left.
    // Adjust the multipliers to control the movement distance.
    const translateX = -scrollY * speed * (index + 1);
    const translateY = -scrollY * speed * (index + 1);
    
    // Calculate scale: stars shrink as you scroll (fizzle effect)
    const scale = Math.max(0, 1 - scrollY / 500);
    
    // Calculate opacity: stars fade out as they move
    const opacity = Math.max(0.5, 1 - scrollY / 300);
    
    // Apply the transformation
    star.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    star.style.opacity = opacity;
  });
});

//EmailJS and Modal
document.addEventListener("DOMContentLoaded", function () {
  const questionButton = document.getElementById("question-button");
  const modal = document.getElementById("question-modal");
  const closeButton = modal.querySelector(".close-button");
  const contactForm = document.getElementById("contact-form");

  // Open the modal when the question button is clicked
  questionButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Close the modal when the close button is clicked
  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close the modal if the user clicks outside the modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle form submission using EmailJS
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs.sendForm('trencktech', 'PW1', contactForm)
      .then(function() {
        alert("Your message has been sent!");
        modal.style.display = "none";
        contactForm.reset();
      }, function(error) {
        alert("Failed to send the message. Please try again.");
        console.error('EmailJS error:', error);
      });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const linkedinButton = document.getElementById("linkedin-button");
  linkedinButton.addEventListener("click", function () {
    window.open("https://www.linkedin.com/in/dylan-trenck", "_blank");
  });
});
