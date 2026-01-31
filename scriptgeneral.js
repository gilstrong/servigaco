// ============================================
// 📝 COTIZACIÓN - GLOBAL
// ============================================
let cotizacion = [];

console.log('🚀 Script cargando...');

// ============================================
// 💰 TABLAS DE PRECIOS
// ============================================

// Impresiones B/N (precio por página)
// 1-200: 2.50, 201-300: 2.00, 301+: 1.75
const preciosBN = [
  { min: 1, max: 200, precio: 2.50 },
  { min: 201, max: 300, precio: 2.00 },
  { min: 301, max: Infinity, precio: 1.75 }
];

// Impresiones Color (precio por página)
// 1-50: 15, 51-200: 12, 201-400: 10, 401+: 8
const preciosColor = [
  { min: 1, max: 50, precio: 15 },
  { min: 51, max: 200, precio: 12 },
  { min: 201, max: 400, precio: 10 },
  { min: 401, max: Infinity, precio: 8 }
];

// Impresiones Full Color (precio por página)
// Todas a 20
const preciosFullColor = [
  { min: 1, max: Infinity, precio: 20 }
];

// Encuadernado Espiral (precio por encuadernado según páginas)
// Hasta 100: 60, hasta 160: 70, hasta 200: 80, hasta 300: 100, hasta 400: 120, hasta 500: 150, hasta 1000: 250
const preciosEncuadernado = [
  { min: 1, max: 100, precio: 60 },
  { min: 101, max: 160, precio: 70 },
  { min: 161, max: 200, precio: 80 },
  { min: 201, max: 300, precio: 100 },
  { min: 301, max: 400, precio: 120 },
  { min: 401, max: 500, precio: 150 },
  { min: 501, max: 1000, precio: 250 }
];

// Empastado (precio por unidad)
const preciosEmpastado = {
  'Tapa Dura': { carta: 500, legal: 800, tabloide: 1000 },
  'Tapa Blanda': { carta: 350 }
};

// Plastificado (precio base por tamaño)
const preciosPlastificado = {
  carta: 40,
  tabloide: 80
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

function calcularPrecioPloteo(tipo, tamano, cantidad, anchoCustom = 0, altoCustom = 0) {
  // Precios Bond Full Color (precio completo)
  const preciosBondFullColor = {
    '17x22': 150,
    '18x24': 150,
    '24x36': 360
  };
  
  // Precios Bond Color Normal (mitad del full color)
  const preciosBondColor = {
    '17x22': 75,
    '18x24': 75,
    '24x36': 180
  };
  
  // Precios Bond B/N
  const preciosBondBN = {
    '17x22': 50,
    '18x24': 50,
    '24x36': 90
  };
  
  // Precios por pie cuadrado
  const preciosPorPie = {
    'cartonite': 80,
    'fotografico': 160,
    'lona': 100,
    'cintra': 250,
    'canvas': 300
  };
  
  // Si es tamaño personalizado
  if (tamano === 'custom') {
    const pulgadasCuadradas = anchoCustom * altoCustom;
    const piesCuadrados = pulgadasCuadradas / 144;
    const precioPorPie = preciosPorPie[tipo] || 100;
    return piesCuadrados * precioPorPie * cantidad;
  }
  
  // Si es Bond B/N
  if (tipo === 'bond_bn') {
    const precioUnitario = preciosBondBN[tamano] || 0;
    return precioUnitario * cantidad;
  }
  
  // Si es Bond Color
  if (tipo === 'bond_color') {
    const precioUnitario = preciosBondColor[tamano] || 0;
    return precioUnitario * cantidad;
  }
  
  // Si es Bond Full Color
  if (tipo === 'bond_full_color') {
    const precioUnitario = preciosBondFullColor[tamano] || 0;
    return precioUnitario * cantidad;
  }
  
  // Si es material por pie cuadrado (cartonite, fotográfico, etc.)
  const [ancho, alto] = tamano.split('x').map(Number);
  const pulgadasCuadradas = ancho * alto;
  const piesCuadrados = pulgadasCuadradas / 144;
  const precioPorPie = preciosPorPie[tipo] || 100;
  
  return piesCuadrados * precioPorPie * cantidad;
}

function calcularPrecioPlastificado(tamano, llevaCorte, cantidadHojas, piezasPorHoja = 1) {
  const precioBase = preciosPlastificado[tamano] || 0;
  
  if (llevaCorte) {
    // Si lleva corte, el precio total es precio base × cantidad de hojas
    return precioBase * cantidadHojas;
  } else {
    return precioBase * cantidadHojas;
  }
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
  const subtotalRow = document.getElementById('subtotalRow');
  const totalEl = document.getElementById('totalAmount');
  const comprobanteSection = document.getElementById('comprobanteSection');
  const carritoTotal = document.getElementById('carritoTotal');
  const carritoAcciones = document.getElementById('carritoAcciones');

  if (contador) contador.textContent = cotizacion.length;

  if (cotizacion.length === 0) {
    if (container) container.innerHTML = `<div class="carrito-vacio"><span class="empty-icon">📭</span><p>No hay servicios agregados</p><p class="empty-hint">Selecciona un servicio abajo para empezar</p></div>`;
    if (subtotalEl) subtotalEl.textContent = 'RD$0.00';
    if (totalEl) totalEl.textContent = 'RD$0.00';
    if (subtotalRow) subtotalRow.style.display = 'none';
    if (impuestoRow) impuestoRow.style.display = 'none';
    if (comprobanteSection) comprobanteSection.style.display = 'none';
    if (carritoTotal) carritoTotal.style.display = 'none';
    if (carritoAcciones) carritoAcciones.style.display = 'none';
    return;
  }

  if (comprobanteSection) comprobanteSection.style.display = 'block';
  if (carritoTotal) carritoTotal.style.display = 'block';
  if (carritoAcciones) carritoAcciones.style.display = 'flex';

  const subtotal = cotizacion.reduce((sum, item) => sum + item.precio, 0);
  const tipoComp = document.getElementById('tipoComprobante')?.value || 'ninguno';

  let impuesto = 0;
  let nombreImpuesto = '';
  if (tipoComp === 'fiscal') { impuesto = subtotal * 0.18; nombreImpuesto = 'ITBIS (18%)'; }
  else if (tipoComp === 'gubernamental') { impuesto = subtotal * 0.10; nombreImpuesto = 'ISR (10%)'; }

  const total = subtotal + impuesto;

  if (subtotalEl) subtotalEl.textContent = `RD$${subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  
  if (tipoComp !== 'ninguno') {
    if (subtotalRow) subtotalRow.style.display = 'flex';
    if (impuestoRow) {
      impuestoRow.style.display = 'flex';
      const label = impuestoRow.querySelector('.impuesto-label');
      if (label) label.textContent = nombreImpuesto + ':';
      if (impuestoEl) impuestoEl.textContent = `RD$${impuesto.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
  } else {
    if (subtotalRow) subtotalRow.style.display = 'none';
    if (impuestoRow) impuestoRow.style.display = 'none';
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
  const caras = document.getElementById('caras')?.value;
  const manual = parseFloat(document.getElementById('precioPersonalImpresion')?.value || 0);

  if (!cant || cant <= 0) { alert('Cantidad inválida'); return; }

  const tipos = { bn: 'B/N', color: 'Color', full_color: 'Full Color' };
  let precio;
  
  if (manual) {
    precio = manual;
  } else {
    // Calcular precio base (por páginas)
    precio = calcularPrecioImpresion(cant, tipo);
    
    // Si es doble cara, dividir entre 2 porque cada hoja tiene 2 páginas
    // El precio es por página, pero se cobra por hoja
    if (caras === 'doble') {
      precio = precio / 2;
    }
  }

  const carasTexto = caras === 'doble' ? 'Doble Cara' : 'Simple Cara';
  const hojas = caras === 'doble' ? Math.ceil(cant / 2) : cant;
  
  agregarACotizacion({ 
    nombre: `Impresión ${tipos[tipo]}`, 
    descripcion: `${cant} páginas (${hojas} hojas) ${carasTexto}`, 
    precio 
  });
  limpiarFormulario('formImpresion');
}

function agregarEncuadernado() {
  const pag = parseInt(document.getElementById('paginasEncuadernado')?.value);
  const cant = parseInt(document.getElementById('cantidadEncuadernado')?.value || 1);
  const manual = parseFloat(document.getElementById('precioPersonalEncuadernado')?.value || 0);

  if (!pag || pag <= 0) { alert('Páginas inválidas'); return; }
  if (!cant || cant <= 0) { alert('Cantidad inválida'); return; }

  const precioUnitario = manual || calcularPrecioEncuadernado(pag);
  const precioTotal = precioUnitario * cant;

  agregarACotizacion({ 
    nombre: 'Encuadernado Espiral', 
    descripcion: `${cant} encuadernado(s) de ${pag} páginas`, 
    precio: precioTotal 
  });
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
  
  if (precioUnitario === 0 && !manual) {
    alert('Este tamaño no está disponible para tapa blanda. Use precio personalizado.');
    return;
  }
  
  const precioTotal = precioUnitario * cant;
  const tamanoTexto = tam === 'carta' ? '8.5x11' : tam === 'legal' ? '8.5x14' : '11x17';

  agregarACotizacion({ 
    nombre: `Empastado ${tipo}`, 
    descripcion: `${cant} empastado(s) ${tamanoTexto}`, 
    precio: precioTotal 
  });
  limpiarFormulario('formEmpastado');
}

function agregarPloteo() {
  const tipoPloteo = document.getElementById('tipoPloteo')?.value;
  const tipoTam = document.getElementById('opcionTamanoPloteo')?.value;
  const tam = document.getElementById('tamanoPloteo')?.value;
  const cant = parseInt(document.getElementById('cantidadPloteo')?.value);
  const ancho = parseFloat(document.getElementById('anchoPloteo')?.value || 0);
  const alto = parseFloat(document.getElementById('altoPloteo')?.value || 0);
  const manual = parseFloat(document.getElementById('precioPersonalPloteo')?.value || 0);

  if (!cant || cant <= 0) { alert('Cantidad inválida'); return; }
  if (tipoTam === 'personalizado' && (!ancho || !alto)) { alert('Ingrese ancho y alto'); return; }

  let precio;
  let desc;
  
  if (manual) {
    precio = manual;
  } else if (tipoTam === 'personalizado') {
    precio = calcularPrecioPloteo(tipoPloteo, 'custom', cant, ancho, alto);
  } else {
    precio = calcularPrecioPloteo(tipoPloteo, tam, cant);
  }
  
  const tipoTexto = {
    'bond_bn': 'Bond B/N',
    'bond_color': 'Bond Color',
    'bond_full_color': 'Bond Full Color',
    'cartonite': 'Cartonite',
    'fotografico': 'Fotográfico',
    'canvas': 'Canvas',
    'lona': 'Lona',
    'cintra': 'Cintra'
  };
  
  desc = tipoTam === 'personalizado' ? 
    `${cant} ${tipoTexto[tipoPloteo]} · ${ancho}" x ${alto}"` : 
    `${cant} ${tipoTexto[tipoPloteo]} · ${tam}"`;

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

  const tamanoTexto = tam === 'carta' ? 'Carta (8.5x11)' : 'Tabloide (11x17)';
  const desc = corte ? 
    `${cant * piezas} piezas plastificadas y cortadas (${cant} hojas ${tamanoTexto}, ${piezas} piezas/hoja)` :
    `${cant} hoja(s) plastificadas ${tamanoTexto}`;
  
  const precioTotal = manual || calcularPrecioPlastificado(tam, corte, cant, piezas);

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
    const tp = document.getElementById('tamanosPredefinidos');
    if (tp) tp.style.display = 'block';
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
    txt += `${i + 1}. ${item.nombre}\n   ${item.descripcion}\n   RD$${item.precio.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n\n`;
  });

  const subtotal = cotizacion.reduce((s, i) => s + i.precio, 0);
  const tipoC = document.getElementById('tipoComprobante')?.value || 'ninguno';
  let imp = 0;

  if (tipoC === 'fiscal') { 
    imp = subtotal * 0.18; 
    txt += `Subtotal: RD$${subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\nITBIS (18%): RD$${imp.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`; 
  } else if (tipoC === 'gubernamental') { 
    imp = subtotal * 0.10; 
    txt += `Subtotal: RD$${subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\nISR (10%): RD$${imp.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}\n`; 
  }

  txt += `\nTOTAL: RD$${(subtotal + imp).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
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
      const tp = document.getElementById('tamanosPredefinidos');
      if (e.target.value === 'personalizado') {
        if (cf) cf.style.display = 'block';
        if (tp) tp.style.display = 'none';
      } else {
        if (cf) cf.style.display = 'none';
        if (tp) tp.style.display = 'block';
      }
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