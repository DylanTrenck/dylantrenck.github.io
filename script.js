// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
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
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs.sendForm('trencktech', 'PW', contactForm)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        alert("Your message has been sent!");
        modal.style.display = "none";
        contactForm.reset(); // Optionally reset the form fields
      }, function(error) {
        console.error('FAILED...', error);
        alert("Failed to send your message. Please try again later.");
      });
  });
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
