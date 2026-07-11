/**
 * 📄 Modal personalizado estilo RPG
 * Uso mínimo:
 *   <script src="modal-personalizado.js"></script>
 *
 * Ejemplos:
 *   mostrarAlerta('Éxito', 'Datos guardados correctamente.');
 *   mostrarConfirmacion('¿Estás seguro?', 'Esta acción no se puede deshacer.', () => { ... });
 *   mostrarModal({
 *     titulo: 'Mi diálogo',
 *     mensaje: 'Contenido del mensaje',
 *     botones: [
 *       { texto: 'Aceptar', callback: () => { ... } },
 *       { texto: 'Cancelar', callback: () => { ... } }
 *     ]
 *   });
 * 
 * 🔹 Modal con 3 botones (Sí / No / Tal vez)
 * javascript
 * mostrarModal({
 *   titulo: '¿Qué quieres hacer?',
 *   mensaje: 'Elige una opción para continuar.',
 *   botones: [
 *     { texto: '✅ Sí', callback: () => console.log('Sí'), clase: 'primario' },
 *     { texto: '❌ No', callback: () => console.log('No'), clase: 'peligro' },
 *     { texto: '🤔 Tal vez', callback: () => console.log('Tal vez'), clase: '' }
 *   ]
 * });
 * 🔹 Modal con 4 botones (Guardar / Cancelar / Ayuda / Cerrar)
 * javascript
 * mostrarModal({
 *   titulo: 'Guardar documento',
 *   mensaje: 'Elige una acción para tu documento.',
 *   botones: [
 *     { texto: '💾 Guardar', callback: guardarDoc, clase: 'primario' },
 *     { texto: '❌ Cancelar', callback: cancelarDoc, clase: '' },
 *     { texto: '❓ Ayuda', callback: mostrarAyuda, clase: '' },
 *     { texto: '✖ Cerrar', callback: cerrarModal, clase: '' }
 *   ]
 * });
 * 🔹 Modal con botón personalizado (sin clase = estilo neutro)
 * javascript
 * mostrarModal({
 *   titulo: 'Editar perfil',
 *   mensaje: '¿Deseas guardar los cambios?',
 *   botones: [
 *     { texto: 'Guardar y salir', callback: guardarYSalir, clase: 'primario' },
 *     { texto: 'Descartar cambios', callback: descartar, clase: 'peligro' }
 *   ]
 * });
 * 🎨 Clases disponibles para los botones
 * Clase	Estilo
 * primario	Fondo oscuro, texto claro (destacado)
 * peligro	Fondo rojo/naranja, texto claro
 * (vacío)	Fondo claro, texto oscuro (neutro)
 */

function injectModalStyles() {
  if (document.getElementById('modal-personalizado-styles')) return;

  const styles = `
  /* ===== MODAL PERSONALIZADO ===== */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(43, 37, 31, 0.6);
    z-index: 20000;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  .modal-overlay.active {
    opacity: 1;
    pointer-events: auto;
  }
  .modal-box {
    background-color: var(--bg-card);
    border: var(--border-width) solid var(--text-dark);
    border-radius: var(--card-radius);
    padding: 24px 28px 28px 28px;
    max-width: 90%;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 var(--shadow-offset) 0 var(--text-dark);
    font-family: 'Space Mono', monospace;
    transform: scale(0.95);
    transition: transform 0.2s ease;
  }
  .modal-overlay.active .modal-box {
    transform: scale(1);
  }
  .modal-titulo {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 12px 0;
    letter-spacing: -0.5px;
  }
  .modal-mensaje {
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.8;
    margin: 0 0 24px 0;
  }
  .modal-botones {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-end;
  }
  .modal-boton {
    background-color: #dfd7c2;
    border: 2.5px solid #2b251f;
    border-radius: 14px;
    padding: 10px 20px;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 3px 0 #2b251f;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    color: #2b251f;
    background-color: var(--bg-card, #fffbf4);
  }
  .modal-boton:active {
    transform: scale(0.95);
    box-shadow: 0 1px 0 #2b251f;
  }
  .modal-boton.primario {
    background-color: #2b251f;
    color: #fffbf4;
  }
  .modal-boton.peligro {
    background-color: #e06d53;
    color: #fffbf4;
    border-color: #2b251f;
  }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = 'modal-personalizado-styles';
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

/**
 * Muestra un modal personalizado.
 * @param {Object} opciones
 * @param {string} [opciones.titulo] - Título del modal.
 * @param {string} [opciones.mensaje] - Mensaje o contenido.
 * @param {Array<{texto: string, callback: Function, clase?: string}>} [opciones.botones] - Botones a mostrar.
 * @param {Function} [opciones.onCerrar] - Callback cuando se cierra el modal (por overlay o ESC).
 * @returns {Object} { cerrar: Function } para cerrar manualmente.
 */
function mostrarModal(opciones) {
  injectModalStyles();

  // Valores por defecto
  const titulo = opciones.titulo || '';
  const mensaje = opciones.mensaje || '';
  const botones = opciones.botones || [{ texto: 'Aceptar', callback: () => {}, clase: 'primario' }];
  const onCerrar = opciones.onCerrar || (() => {});

  // Eliminar modal anterior
  const overlayExistente = document.querySelector('.modal-overlay');
  if (overlayExistente) overlayExistente.remove();

  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  // Crear caja
  const box = document.createElement('div');
  box.className = 'modal-box';

  // Título
  if (titulo) {
    const h2 = document.createElement('h2');
    h2.className = 'modal-titulo';
    h2.textContent = titulo;
    box.appendChild(h2);
  }

  // Mensaje
  if (opciones.contenido) {
    const div = document.createElement('div');
    div.innerHTML = opciones.contenido;
    box.appendChild(div);
  } else if (mensaje) {
    const p = document.createElement('p');
    p.className = 'modal-mensaje';
    p.textContent = mensaje;
    box.appendChild(p);
  }

  // Contenedor de botones
  const contenedorBotones = document.createElement('div');
  contenedorBotones.className = 'modal-botones';

  botones.forEach((btn, index) => {
    const boton = document.createElement('button');
    boton.className = `modal-boton ${btn.clase || ''}`;
    boton.textContent = btn.texto || 'Aceptar';
    boton.addEventListener('click', function(e) {
      e.stopPropagation();
      if (typeof btn.callback === 'function') btn.callback();
      cerrarModal();
    });
    contenedorBotones.appendChild(boton);
  });

  box.appendChild(contenedorBotones);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // ===== BLOQUEAR SCROLL DEL BODY =====
  const bodyStyle = document.body.style;
  const originalOverflow = bodyStyle.overflow;
  bodyStyle.overflow = 'auto';

  // Función para cerrar
  function cerrarModal() {
    overlay.classList.remove('active');
    // Restaurar scroll del body
    bodyStyle.overflow = originalOverflow || '';
    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();
      if (typeof onCerrar === 'function') onCerrar();
    }, 200);
  }

  // Cerrar al hacer clic en overlay (fuera de la caja)
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      cerrarModal();
    }
  });

  // Cerrar con tecla ESC
  function handleEsc(e) {
    if (e.key === 'Escape') {
      cerrarModal();
      document.removeEventListener('keydown', handleEsc);
    }
  }
  document.addEventListener('keydown', handleEsc);

  // Mostrar animación
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // Retornar objeto para control externo
  return {
    cerrar: cerrarModal
  };
}

/**
 * Alerta simple (un botón "Aceptar").
 * @param {string} titulo
 * @param {string} mensaje
 * @param {Function} [callback] - Opcional, se ejecuta al cerrar.
 */
function mostrarAlerta(titulo, mensaje, callback) {
  return mostrarModal({
    titulo,
    mensaje,
    botones: [{ texto: 'Aceptar', callback, clase: 'primario' }]
  });
}

/**
 * Confirmación (dos botones: "Aceptar" y "Cancelar").
 * @param {string} titulo
 * @param {string} mensaje
 * @param {Function} [callbackAceptar] - Se ejecuta al pulsar Aceptar.
 * @param {Function} [callbackCancelar] - Se ejecuta al pulsar Cancelar o cerrar.
 */
function mostrarConfirmacion(titulo, mensaje, callbackAceptar, callbackCancelar) {
  return mostrarModal({
    titulo,
    mensaje,
    botones: [
      { texto: 'Aceptar', callback: callbackAceptar, clase: 'primario' },
      { texto: 'Cancelar', callback: callbackCancelar, clase: '' }
    ]
  });
}