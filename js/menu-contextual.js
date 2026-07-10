/**
 * 📄 Uso mínimo en cualquier HTML
 * Ahora solo necesitas importar el script:
 * <script src="menu-contextual.js"></script>
 * Y usarlo en cualquier elemento:
 * <button id="miBoton">Abrir menú</button>
 * <script>
 *   document.getElementById('miBoton').addEventListener('click', function(e) {
 *     mostrarMenuContextual([
 *       { label: '📤 Exportar', callback: () => alert('Exportando') },
 *       { label: '📥 Importar', callback: () => alert('Importando') }
 *     ], e);
 *   });
 * </script>
 * Los estilos se cargan automáticamente la primera vez que se llama a mostrarMenuContextual().
 * No necesitas incluir nada en el <head> ni copiar reglas CSS.
 */
function injectMenuStyles() {
  if (document.getElementById('menu-contextual-styles')) return;

  const styles = `
  /* ===== MENÚ CONTEXTUAL ===== */
  .dropdown-menu {
    position: absolute;
    width: auto !important;
    max-width: 90vw;
    height: auto;
    background-color: #fffbf4;
    border: 2.5px solid #2b251f;
    border-radius: 16px;
    padding: 6px 0;
    box-shadow: 0 4px 0 #2b251f;
    z-index: 10000;
    display: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    pointer-events: none;
    font-family: 'Space Mono', monospace;
  }
  .dropdown-menu.visible {
    display: block;
    opacity: 1;
    pointer-events: auto;
  }
  .dropdown-item {
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid rgba(43, 37, 31, 0.1);
    transition: background 0.1s;
    color: #2b251f;
    white-space: nowrap; /* Evita que el texto se divida en varias líneas */
  }
  .dropdown-item:last-child {
    border-bottom: none;
  }
  .dropdown-item:hover {
    color: #dda40d;
  }
  .dropdown-item span {
    opacity: 0.7;
  }

  /* Overlay para capturar clics fuera */
  .context-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: transparent;
    display: none;
  }
  .context-overlay.active {
    display: block;
  }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = 'menu-contextual-styles';
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

/**
 * Muestra un menú contextual con estilo RPG en la posición del evento o relativo a un elemento.
 * @param {Array} opciones - Array de objetos { label: string, callback: function }
 * @param {MouseEvent|HTMLElement} evento - Evento de ratón o elemento DOM al que anclar el menú.
 */
function mostrarMenuContextual(opciones, evento) {
  injectMenuStyles();

  // Eliminar menús anteriores
  const menuExistente = document.querySelector('.dropdown-menu-global');
  const overlayExistente = document.querySelector('.context-overlay');
  if (menuExistente) menuExistente.remove();
  if (overlayExistente) overlayExistente.remove();

  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'context-overlay';
  document.body.appendChild(overlay);

  // Crear menú
  const menu = document.createElement('div');
  menu.className = 'dropdown-menu dropdown-menu-global';

  opciones.forEach(op => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.textContent = op.label;
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      if (typeof op.callback === 'function') op.callback();
      cerrarMenu();
    });
    menu.appendChild(item);
  });

  document.body.appendChild(menu);

  // ------ MEDICIÓN REAL DEL MENÚ ------
  // Forzar que sea visible (pero invisible al usuario) para medir dimensiones
  menu.style.display = 'block';
  menu.style.visibility = 'hidden';
  menu.style.opacity = '0';
  menu.style.pointerEvents = 'none';

  // Obtener dimensiones reales
  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;

  // Restaurar a estado inicial (oculto)
  menu.style.display = 'none';
  menu.style.visibility = 'visible';
  menu.style.opacity = '0';
  menu.style.pointerEvents = 'none';
  // ------------------------------------

  // Posicionar
  let left, top;
  if (evento instanceof MouseEvent) {
    left = evento.clientX;
    top = evento.clientY;
  } else if (evento && typeof evento.getBoundingClientRect === 'function') {
    const rect = evento.getBoundingClientRect();
    left = rect.left + 10;
    top = rect.bottom + 6;
  } else {
    left = window.innerWidth / 2 - 100;
    top = window.innerHeight / 2 - 50;
  }

  // Ajustar para que no se salga de la pantalla
  if (left + menuWidth > window.innerWidth) {
    left = window.innerWidth - menuWidth - 18;
  }
  if (top + menuHeight > window.innerHeight) {
    top = window.innerHeight - menuHeight - 10;
  }
  if (left < 18) left = 18;
  if (top < 10) top = 10;

  menu.style.left = left + 'px';
  menu.style.top = top + 'px';

  // Mostrar con animación
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    menu.style.display = 'block';
    menu.style.opacity = '1';
    menu.style.pointerEvents = 'auto';
    menu.classList.add('visible');
  });

  // Función para cerrar
  function cerrarMenu() {
    menu.classList.remove('visible');
    overlay.classList.remove('active');
    setTimeout(() => {
      if (menu.parentNode) menu.remove();
      if (overlay.parentNode) overlay.remove();
    }, 200);
  }

  // Cerrar al hacer clic en el overlay
  overlay.addEventListener('click', cerrarMenu);

  // Almacenar referencias para cerrar desde otros sitios
  menu.cerrar = cerrarMenu;
  overlay.cerrar = cerrarMenu;
}