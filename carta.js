document.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem('task')) || [];

  const entrada = document.getElementById('lista-entrada');
  const principal = document.getElementById('lista-principal');
  const extra = document.getElementById('lista-extra');

  function addPlaceholderIfEmpty(listEl) {
    if (!listEl.children.length) {
      const li = document.createElement('li');
      li.textContent = '—';
      li.classList.add('empty');
      listEl.appendChild(li);
    }
  }

  // populate
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.taskInputValue;
    if (t.plato === 'entrada') entrada.appendChild(li);
    else if (t.plato === 'principal') principal.appendChild(li);
    else if (t.plato === 'extra') extra.appendChild(li);
  });

  // If some lists are empty, add placeholder
  addPlaceholderIfEmpty(entrada);
  addPlaceholderIfEmpty(principal);
  addPlaceholderIfEmpty(extra);


});
