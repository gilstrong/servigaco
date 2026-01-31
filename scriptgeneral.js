// ============================================
// 📝 COTIZACIÓN - GLOBAL
// ============================================
let cotizacion = [];

console.log('🚀 Script cargando...');

// ============================================
// 💰 TABLAS DE PRECIOS
// ============================================

const preciosBN = [
  { min: 1, max: 50, precio: 2 },
  { min: 51, max: 100, precio: 1.5 },
  { min: 101, max: 200, precio: 1.25 },
  { min: 201, max: Infinity, precio: 1 }
];

const preciosColor = [
  { min: 1, max: 50, precio: 15 },
  { min: 51, max: 100, precio: 12 },
  { min: 101, max: 200, precio: 10 },
  { min: 201, max: Infinity, precio: 8 }
];

const preciosFullColor = [
  { min: 1, max: 50, precio: 20 },
  { min: 51, max: 100, precio: 18 },
  { min: 101, max: 200, precio: 15 },
  { min: 201, max: Infinity, precio: 12 }
];

const preciosEncuadernado = [
  { min: 1, max: 50, precio: 80 },
  { min: 51, max: 100, precio: 120 },
  { min: 101, max: 150, precio: 160 },
  { min: 151, max: 200, precio: 200 },
  { min: 201, max: Infinity, precio: 240 }
];

const preciosEmpastado = {
  'Tapa Dura': { carta: 600, legal: 700, tabloide: 800 },
  'Tapa Blanda': { carta: 400, legal: 450, tabloide: 500 }
};

const preciosPlastificado = {
  sinCorte: { carta: 40, tabloide: 80 },
  conCorte: { carta: 50, tabloide: 90 }
};

// ============================================
// 🧮 FUNCIONES DE CÁLCULO
// ============================================

function calcularPrecioImpresion(cantidad, tipo) {
  let tabla;
  switch (tipo) {
    case 'bn': tabla = preciosBN; break;
    case 'color': tabla = preciosColor; break;
    case 'full_color': tabla = preciosFullColor; break;
    default: return 0;
  }
  const rango = tabla.find(r => cantidad >= r.min && cantidad <= r.max);
  return rango ? cantidad * rango.precio : 0;
}

function calcularPrecioEncuadernado(paginas) {
  const rango = preciosEncuadernado.find(r => paginas >= r.min && paginas <= r.max);
  return rango ? rango.precio : 0;
}

function calcularPrecioEmpastado(tipo, tamano) {
  return preciosEmpastado[tipo]?.[tamano] || 0;
}

function calcularPrecioPloteo(tamano, cantidad, anchoCustom = 0, altoCustom = 0) {
  const tamanosPrecios = {
    '17x22': 200,
    '18x24': 250,
    '24x36': 350,
    '36x48': 500
  };
  if (tamano === 'custom') {
    const pulgadasCuadradas = anchoCustom * altoCustom;
    const piesCuadrados = pulgadasCuadradas / 144;
    return piesCuadrados * 100 * cantidad;
  }
  return (tamanosPrecios[tamano] || 0) * cantidad;
}

function calcularPrecioPlastificado(tamano, llevaCorte, piezas = 1) {
  const precios = llevaCorte ? preciosPlastificado.conCorte : preciosPlastificado.sinCorte;
  return precios[tamano] * piezas;
}

// ============================================
// 📝 FUNCIONES DE COTIZACIÓN
// ============================================

function agregarACotizacion(servicio) {
  cotizacion.push(servicio);
  actualizarCotizacion();
}

function eliminarDeCotizacion(index) {
  cotizacion.splice(index, 1);
  actualizarCotizacion();
}

function limpiarCotizacion() {
  if (cotizacion.length === 0) {
    alert('La cotización ya está vacía');
    return;
  }
  if (confirm('¿Limpiar toda la cotización?')) {
    cotizacion = [];
    actualizarCotizacion();
  }
}

function actualizarCotizacion() {
  const container = document.getElementById('carritoItems');
  const contador = document.getElementById('carritoCount');
  const subtotalEl = document.getElementById('subtotalAmount');
  const impuestoEl = document.getElementById('impuestoAmount');
  const impuestoRow = document.getElementById('impuestoRow');
  const totalEl = document.getElementById('totalAmount');
  const comprobanteSection = document.getElementById('comprobanteSection');

  if (contador) contador.textContent = cotizacion.length;

  if (cotizacion.length === 0) {
    if (container) container.innerHTML = `<div class="carrito-vacio"><span class="empty-icon">📭</span><p>No hay servicios agregados</p><p class="empty-hint">Selecciona un servicio abajo para empezar</p></div>`;
    if (subtotalEl) subtotalEl.textContent = 'RD$0.00';
    if (totalEl) totalEl.textContent = 'RD$0.00';
    if (impuestoRow) impuestoRow.style.display = 'none';
    if (comprobanteSection) comprobanteSection.style.display = 'none';
    return;
  }

  if (comprobanteSection) comprobanteSection.style.display = 'block';

  const subtotal = cotizacion.reduce((sum, item) => sum + item.precio, 0);
  const tipoComp = document.getElementById('tipoComprobante')?.value || 'ninguno';

  let impuesto = 0;
  let nombreImpuesto = '';
  if (tipoComp === 'fiscal') { impuesto = subtotal * 0.18; nombreImpuesto = 'ITBIS (18%)'; }
  else if (tipoComp === 'gubernamental') { impuesto = subtotal * 0.10; nombreImpuesto = 'ISR (10%)'; }

  const total = subtotal + impuesto;

  if (subtotalEl) subtotalEl.textContent = `RD$${subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  if (impuestoRow) {
    if (tipoComp !== 'ninguno') {
      impuestoRow.style.display = 'flex';
      const label = impuestoRow.querySelector('span:first-child');
      if (label) label.textContent = nombreImpuesto + ':';
      if (impuestoEl) impuestoEl.textContent = `RD$${impuesto.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    } else impuestoRow.style.display = 'none';
  }
  if (totalEl) totalEl.textContent = `RD$${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  if (container) {
    container.innerHTML = cotizacion.map((item, i) => `
      <div class="carrito-item">
        <div class="item-info">
          <h4>${item.nombre}</h4>
          <p>${item.descripcion}</p>
        </div>
        <div class="item-precio">
          <span>RD$${item.precio.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
          <button class="btn-eliminar" onclick="eliminarDeCotizacion(${i})">🗑️</button>
        </div>
      </div>
    `).join('');
  }
}

// ============================================
// ➕ AGREGAR SERVICIOS
// ============================================

function agregarImpresion() {
  const cant = parseInt(document.getElementById('cantidadPaginas')?.value);
  const tipo = document.getElementById('tipoImpresion')?.value;
  const manual = parseFloat(document.getElementById('precioPersonalImpresion')?.value || 0);

  if (!cant || cant <= 0) { alert('Cantidad inválida'); return; }

  const tipos = { bn: 'B/N', color: 'Color', full_color: 'Full Color' };
  const precio = manual || calcularPrecioImpresion(cant, tipo);

  agregarACotizacion({ nombre: `Impresión ${tipos[tipo]}`, descripcion: `${cant} páginas`, precio });
  limpiarFormulario('formImpresion');
}

function agregarEncuadernado() {
  const pag = parseInt(document.getElementById('paginasEncuadernado')?.value);
  const manual = parseFloat(document.getElementById('precioPersonalEncuadernado')?.value || 0);

  if (!pag || pag <= 0) { alert('Páginas inválidas'); return; }

  agregarACotizacion({ nombre: 'Encuadernado', descripcion: `${pag} páginas`, precio: manual || calcularPrecioEncuadernado(pag) });
  limpiarFormulario('formEncuadernado');
}

function agregarEmpastado() {
  const tipoRaw = document.getElementById('tipoEmpastadoGeneral')?.value;
  const tam = document.getElementById('tamanoEmpastado')?.value;
  const cant = parseInt(document.getElementById('cantidadEmpastado')?.value);
  const manual = parseFloat(document.getElementById('precioPersonalEmpastado')?.value || 0);

  if (!cant || cant <= 0) { alert('Cantidad inválida'); return; }

  const tipoMap = { tapa_dura: 'Tapa Dura', tapa_blanda: 'Tapa Blanda' };
  const tipo = tipoMap[tipoRaw];
  const precioUnitario = manual || calcularPrecioEmpastado(tipo, tam);
  const precioTotal = precioUnitario * cant;

  agregarACotizacion({ nombre: `Empastado ${tipo}`, descripcion: `Tamaño: ${tam} · Cantidad: ${cant}`, precio: precioTotal });
  limpiarFormulario('formEmpastado');
}

function agregarPloteo() {
  const tipoTam = document.getElementById('opcionTamanoPloteo')?.value;
  const tam = document.getElementById('tamanoPloteo')?.value;
  const cant = parseInt(document.getElementById('cantidadPloteo')?.value);
  const ancho = parseFloat(document.getElementById('anchoPloteo')?.value || 0);
  const alto = parseFloat(document.getElementById('altoPloteo')?.value || 0);
  const manual = parseFloat(document.getElementById('precioPersonalPloteo')?.value || 0);

  if (!cant || cant <= 0) { alert('Cantidad inválida'); return; }
  if (tipoTam === 'personalizado' && (!ancho || !alto)) { alert('Ingrese ancho y alto'); return; }

  const precio = manual || (tipoTam === 'personalizado' ? calcularPrecioPloteo('custom', cant, ancho, alto) : calcularPrecioPloteo(tam, cant));
  const desc = tipoTam === 'personalizado' ? `${cant} unidad(es) · ${ancho}" x ${alto}"` : `${cant} unidad(es) · ${tam}`;

  agregarACotizacion({ nombre: 'Ploteo', descripcion: desc, precio });
  limpiarFormulario('formPloteo');
}

function agregarPlastificado() {
  const tam = document.getElementById('tamanoPlastificado')?.value;
  const corte = document.getElementById('llevaCorte')?.value === 'si';
  const piezas = corte ? parseInt(document.getElementById('cantidadPiezas')?.value || 1) : 1;
  const cant = parseInt(document.getElementById('cantidadPlastificado')?.value);
  const manual = parseFloat(document.getElementById('precioPersonalPlastificado')?.value || 0);

  if (!cant || cant <= 0) { alert('Cantidad inválida'); return; }
  if (corte && (!piezas || piezas <= 0)) { alert('Cantidad de piezas inválida'); return; }

  const desc = `Tamaño: ${tam}` + (corte ? ` · Con corte (${piezas} piezas)` : ' · Sin corte');
  const precioUnitario = manual || calcularPrecioPlastificado(tam, corte, piezas);
  const precioTotal = precioUnitario * cant;

  agregarACotizacion({ nombre: 'Plastificado', descripcion: desc, precio: precioTotal });
  limpiarFormulario('formPlastificado');
}

// ============================================
// 🧹 LIMPIAR FORMULARIOS
// ============================================

function limpiarFormulario(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.querySelectorAll('input[type="number"], input[type="text"]').forEach(i => i.value = '');
  form.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);

  if (formId === 'formPloteo') {
    const cf = document.getElementById('tamanoPersonalizado');
    if (cf) cf.style.display = 'none';
  }
  if (formId === 'formPlastificado') {
    const cc = document.getElementById('seccionPiezas');
    if (cc) cc.style.display = 'none';
  }
}

// ============================================
// 📄 GENERAR COTIZACIÓN
// ============================================

function generarCotizacion() {
  if (cotizacion.length === 0) { alert('Cotización vacía'); return; }

  let txt = '=== COTIZACIÓN ===\n\n';
  cotizacion.forEach((item, i) => {
    txt += `${i + 1}. ${item.nombre}\n   ${item.descripcion}\n   RD$${item.precio.toFixed(2)}\n\n`;
  });

  const subtotal = cotizacion.reduce((s, i) => s + i.precio, 0);
  const tipoC = document.getElementById('tipoComprobante')?.value || 'ninguno';
  let imp = 0;

  if (tipoC === 'fiscal') { imp = subtotal * 0.18; txt += `Subtotal: RD$${subtotal.toFixed(2)}\nITBIS (18%): RD$${imp.toFixed(2)}\n`; }
  else if (tipoC === 'gubernamental') { imp = subtotal * 0.10; txt += `Subtotal: RD$${subtotal.toFixed(2)}\nISR (10%): RD$${imp.toFixed(2)}\n`; }

  txt += `\nTOTAL: RD$${(subtotal + imp).toFixed(2)}`;
  alert(txt);
}

// ============================================
// 🧭 NAVEGACIÓN
// ============================================

function marcarPaginaActiva() {
  const pag = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (pag === 'index.html' || pag === '') document.getElementById('navTesis')?.classList.add('active');
  else if (pag === 'calculadora_general.html') document.getElementById('navGeneral')?.classList.add('active');
}

function configurarMenuMovil() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const exp = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !exp);
    links.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('active');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.main-nav')) {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('active');
    }
  });
}

// ============================================
// 🎯 EVENT LISTENERS
// ============================================

function inicializarEventListeners() {
  const tipoSrv = document.getElementById('tipoServicio');
  if (tipoSrv) {
    tipoSrv.addEventListener('change', e => {
      const val = e.target.value;
      document.querySelectorAll('.form-servicio').forEach(f => f.style.display = 'none');
      if (val) {
        const formId = `form${val.charAt(0).toUpperCase() + val.slice(1)}`;
        const form = document.getElementById(formId);
        if (form) form.style.display = 'block';
      }
    });
  }

  const tamPlot = document.getElementById('opcionTamanoPloteo');
  if (tamPlot) {
    tamPlot.addEventListener('change', e => {
      const cf = document.getElementById('tamanoPersonalizado');
      if (cf) cf.style.display = e.target.value === 'personalizado' ? 'block' : 'none';
    });
  }

  const corte = document.getElementById('llevaCorte');
  if (corte) {
    corte.addEventListener('change', e => {
      const cc = document.getElementById('seccionPiezas');
      if (cc) cc.style.display = e.target.value === 'si' ? 'block' : 'none';
    });
  }

  const tipoComp = document.getElementById('tipoComprobante');
  if (tipoComp) tipoComp.addEventListener('change', actualizarCotizacion);

  const btnLimp = document.getElementById('btnLimpiarCarrito');
  if (btnLimp) btnLimp.addEventListener('click', limpiarCotizacion);

  const btnGen = document.getElementById('btnGenerarCotizacion');
  if (btnGen) btnGen.addEventListener('click', generarCotizacion);
}

// ============================================
// 🚀 INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  actualizarCotizacion();
  marcarPaginaActiva();
  configurarMenuMovil();
  inicializarEventListeners();
  console.log('✅ Script inicializado');
});
