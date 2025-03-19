// Animation script for KaiRA website
document.addEventListener('DOMContentLoaded', function() {
  // Add animation classes to elements when they come into view
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });

  // Add hover animations to cards
  const cards = document.querySelectorAll('.card, .feature-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('bounce');
    });
    card.addEventListener('mouseleave', function() {
      this.classList.remove('bounce');
    });
  });
  
  // Add hover animations to timeline items
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.classList.add('hover');
    });
    item.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
    });
  });
  
  // Gallery filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const featuredProjects = document.querySelectorAll('.featured-project');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filter = this.textContent.trim();
      
      // Filter featured projects
      featuredProjects.forEach(project => {
        const year = project.querySelector('.featured-year').textContent.trim();
        
        if (filter === 'すべて' || filter === year) {
          project.style.display = 'flex';
        } else {
          project.style.display = 'none';
        }
      });
      
      // Filter project cards
      projectCards.forEach(card => {
        const year = card.querySelector('.project-year').textContent.trim();
        
        if (filter === 'すべて' || filter === year) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // Process steps interaction
  const processSteps = document.querySelectorAll('.process-step');
  processSteps.forEach(step => {
    step.addEventListener('click', function() {
      // Remove active class from all steps
      processSteps.forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked step
      this.classList.add('active');
    });
  });
  
  // Accordion functionality for FAQ
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const isCollapsed = this.classList.contains('collapsed');
      const targetId = this.getAttribute('data-target');
      const targetCollapse = document.querySelector(targetId);
      
      // Toggle collapsed class on button
      if (isCollapsed) {
        this.classList.remove('collapsed');
      } else {
        this.classList.add('collapsed');
      }
      
      // Toggle show class on collapse
      if (targetCollapse) {
        if (isCollapsed) {
          targetCollapse.classList.add('show');
        } else {
          targetCollapse.classList.remove('show');
        }
      }
    });
  });
});
