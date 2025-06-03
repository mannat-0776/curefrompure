document.addEventListener('DOMContentLoaded', () => {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.blog-slider .slide');

  function showSlide(n) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === n);
    });
  }

  function changeSlide(dir) {
    currentSlide += dir;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    showSlide(currentSlide);
  }

  document.querySelector('.slider-btn.prev').addEventListener('click', () => changeSlide(-1));
  document.querySelector('.slider-btn.next').addEventListener('click', () => changeSlide(1));

  showSlide(currentSlide);
});
