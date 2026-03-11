window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  
  // Pridáme triedu, ktorá ho plynule skryje
  preloader.classList.add('loader-hidden');

  // Po skončení animácie ho úplne odstránime z webu
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});