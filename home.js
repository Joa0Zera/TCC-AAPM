document.addEventListener('DOMContentLoaded', function() {
    // Menu hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Anima os spans do hamburger para formar um X
      const spans = this.querySelectorAll('span');
      if (this.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });
    
    // Efeito hover nos cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.card-icon i');
        icon.style.transform = 'scale(1.1)';
      });
      
      card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.card-icon i');
        icon.style.transform = 'scale(1)';
      });
    });
    
    // Adiciona ano atual no footer
    const yearSpan = document.querySelector('footer p');
    if (yearSpan) {
      const currentYear = new Date().getFullYear();
      yearSpan.textContent = yearSpan.textContent.replace('2024', currentYear);
    }
  });