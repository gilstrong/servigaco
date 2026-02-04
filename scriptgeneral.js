// ============================================
// 📝 COTIZACIÓN - GLOBAL
// ============================================
let cotizacion = [];

console.log('🚀 Script cargando...');

// ============================================
// 💰 TABLAS DE PRECIOS ACTUALIZADAS
// ============================================

// IMPRESIONES B/N (Blanco y Negro)
const preciosBN = {
  'carta': [
    { min: 1, max: 50, precio: 2.50 },
    { min: 51, max: 200, precio: 2.00 },
    { min: 201, max: Infinity, precio: 1.75 }
  ],
  'legal': [
    { min: 1, max: 50, precio: 10.00 },
    { min: 51, max: 200, precio: 8.00 },
    { min: 201, max: Infinity, precio: 6.00 }
  ],
  'tabloide': [
    { min: 1, max: 50, precio: 20.00 },
    { min: 51, max: 200, precio: 15.00 },
    { min: 201, max: Infinity, precio: 10.00 }
  ]
};

// IMPRESIONES COLOR (papel bond)
const preciosColor = {
  'carta': [
    { min: 1, max: 50, precio: 15.00 },
    { min: 51, max: 200, precio: 10.00 },
    { min: 201, max: Infinity, precio: 8.00 }
  ],
  'legal': [
    { min: 1, max: 50, precio: 30.00 },
    { min: 51, max: 200, precio: 25.00 },
    { min: 201, max: Infinity, precio: 20.00 }
  ],
  'tabloide': [
    { min: 1, max: 50, precio: 40.00 },
    { min: 51, max: 200, precio: 35.00 },
    { min: 201, max: Infinity, precio: 30.00 }
  ]
};

// IMPRESIONES FULL COLOR (papel bond)
const preciosFullColor = {
  'carta': [
    { min: 1, max: 50, precio: 20.00 },
    { min: 51, max: 200, precio: 18.00 },
    { min: 201, max: Infinity, precio: 15.00 }
  ],
  'legal': [
    { min: 1, max: 50, precio: 35.00 },
    { min: 51, max: 200, precio: 30.00 },
    { min: 201, max: Infinity, precio: 25.00 }
  ],
  'tabloide': [
    { min: 1, max: 50, precio: 60.00 },
    { min: 51, max: 200, precio: 50.00 },
    { min: 201, max: Infinity, precio: 40.00 }
  ]
};

// IMPRESIONES EN CARTONITE, SATINADO Y ADHESIVO
const preciosEspeciales = {
  'carta': [
    { min: 1, max: 50, precio: 35.00 },
    { min: 51, max: 200, precio: 30.00 },
    { min: 201, max: Infinity, precio: 25.00 }
  ],
  'legal': [
    { min: 1, max: 50, precio: 45.00 },
    { min: 51, max: 200, precio: 40.00 },
    { min: 201, max: Infinity, precio: 35.00 }
  ],
  'tabloide': [
    { min: 1, max: 50, precio: 70.00 },
    { min: 51, max: 200, precio: 60.00 },
    { min: 201, max: Infinity, precio: 50.00 }
  ]
};

// Encuadernado Espiral (precio por encuadernado según páginas)
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
  cedula: 30,
  carta: 40,
  legal: 50,
  tabloide: 60
};

// ============================================
// 🧮 FUNCIONES DE CÁLCULO
// ============================================

function calcularPrecioImpresion(cantidad, tipo, tamano) {
  let tablaPrecios;
  
  switch (tipo) {
    case 'bn':
      tablaPrecios = preciosBN[tamano];
      break;
    case 'color':
      tablaPrecios = preciosColor[tamano];
      break;
    case 'full_color':
      tablaPrecios = preciosFullColor[tamano];
      break;
    case 'especial':
      tablaPrecios = preciosEspeciales[tamano];
      break;
    default:
      return 0;
  }
  
  if (!tablaPrecios) return 0;
  
  // Buscar el rango correspondiente
  const rango = tablaPrecios.find(r => cantidad >= r.min && cantidad <= r.max);
  
  if (!rango) return 0;
  
  // Precio total = cantidad × precio unitario del rango
  return cantidad * rango.precio;
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
    // Si lleva corte, se cobra por cada pieza individual
    const totalPiezas = cantidadHojas * piezasPorHoja;
    return precioBase * totalPiezas;
  } else {
    // Sin corte, se cobra por hoja completa
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
  const contador = document.getElementById('cotizacionCount');
  const cuerpoTabla = document.getElementById('cotizacionBody');
  const footerTabla = document.getElementById('cotizacionFooter');
  const subtotalEl = document.getElementById('subtotalAmount');
  const impuestoEl = document.getElementById('impuestoAmount');
  const impuestoRow = document.getElementById('impuestoRow');
  const subtotalRow = document.getElementById('subtotalRow');
  const totalEl = document.getElementById('totalAmount');
  const comprobanteSection = document.getElementById('comprobanteSection');
  const cotizacionAcciones = document.getElementById('cotizacionAcciones');

  if (contador) contador.textContent = cotizacion.length;

  if (cotizacion.length === 0) {
    if (cuerpoTabla) {
      cuerpoTabla.innerHTML = `
        <tr class="cotizacion-vacia">
          <td colspan="6">
            <div class="empty-cotizacion">
              <span class="empty-icon">📭</span>
              <p>No hay servicios en la cotización</p>
              <p class="empty-hint">Selecciona un servicio abajo para empezar</p>
            </div>
          </td>
        </tr>
      `;
    }
    if (footerTabla) footerTabla.style.display = 'none';
    if (comprobanteSection) comprobanteSection.style.display = 'none';
    if (cotizacionAcciones) cotizacionAcciones.style.display = 'none';
    return;
  }

  if (comprobanteSection) comprobanteSection.style.display = 'block';
  if (cotizacionAcciones) cotizacionAcciones.style.display = 'flex';
  if (footerTabla) footerTabla.style.display = 'table-footer-group';

  const subtotal = cotizacion.reduce((sum, item) => sum + item.precio, 0);
  const tipoComp = document.getElementById('tipoComprobante')?.value || 'ninguno';

  let impuesto = 0;
  let nombreImpuesto = '';
  if (tipoComp === 'fiscal') { impuesto = subtotal * 0.18; nombreImpuesto = 'ITBIS (18%)'; }
  else if (tipoComp === 'gubernamental') { impuesto = subtotal * 0.10; nombreImpuesto = 'ISR (10%)'; }

  const total = subtotal + impuesto;

  if (subtotalEl) subtotalEl.textContent = `RD$${subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  if (tipoComp !== 'ninguno') {
    if (subtotalRow) subtotalRow.style.display = 'table-row';
    if (impuestoRow) {
      impuestoRow.style.display = 'table-row';
      const label = impuestoRow.querySelector('.total-label');
      if (label) label.textContent = nombreImpuesto + ':';
      if (impuestoEl) impuestoEl.textContent = `RD$${impuesto.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
  } else {
    if (subtotalRow) subtotalRow.style.display = 'none';
    if (impuestoRow) impuestoRow.style.display = 'none';
  }

  if (totalEl) totalEl.textContent = `RD$${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  if (cuerpoTabla) {
    cuerpoTabla.innerHTML = cotizacion.map((item, i) => `
      <tr>
        <td><strong>${item.nombre}</strong></td>
        <td>${item.descripcion}</td>
        <td style="text-align: center;">${item.cantidad || 1}</td>
        <td style="text-align: center;">RD$${(item.precioUnitario || item.precio).toFixed(2)}</td>
        <td style="text-align: center;"><strong>RD$${item.precio.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</strong></td>
        <td style="text-align: center;">
          <button class="btn-eliminar" onclick="eliminarDeCotizacion(${i})" title="Eliminar">🗑️</button>
        </td>
      </tr>
    `).join('');
  }
}

// ============================================
// ➕ AGREGAR SERVICIOS
// ============================================

function agregarImpresion() {
  const cant = parseInt(document.getElementById('cantidadPaginas')?.value);
  const tipo = document.getElementById('tipoImpresion')?.value;
  const tamano = document.getElementById('tamanoImpresion')?.value;
  const caras = document.getElementById('caras')?.value;
  const manual = parseFloat(document.getElementById('precioPersonalImpresion')?.value || 0);

  if (!cant || cant <= 0) { alert('Cantidad inválida'); return; }
  if (!tipo) { alert('Seleccione el tipo de impresión'); return; }
  if (!tamano) { alert('Seleccione el tamaño'); return; }

  const tipos = { 
    bn: 'B/N', 
    color: 'Color', 
    full_color: 'Full Color',
    especial: 'Cartonite/Satinado/Adhesivo'
  };
  
  const tamanos = {
    carta: '8½ x 11 (Carta)',
    legal: '8½ x 14 (Legal)',
    tabloide: '11 x 17 (Tabloide)'
  };
  
  let precio;
  
  // ✅ CORRECCIÓN: Precio manual es POR PÁGINA
  if (manual) {
    precio = manual * cant; // Precio manual × cantidad de páginas
  } else {
    precio = calcularPrecioImpresion(cant, tipo, tamano);
    
    if (precio === 0) {
      alert('No se pudo calcular el precio. Use precio personalizado.');
      return;
    }
  }

  const carasTexto = caras === 'doble' ? 'Doble Cara' : 'Simple Cara';
  const hojas = caras === 'doble' ? Math.ceil(cant / 2) : cant;
  
  agregarACotizacion({ 
    nombre: `Impresión ${tipos[tipo]}`, 
    descripcion: `${cant} páginas (${hojas} hojas) · ${tamanos[tamano]} · ${carasTexto}`, 
    cantidad: cant,
    precioUnitario: precio / cant,
    precio 
  });
  limpiarFormulario('formImpresion');
}



// ============================================
// 📘 FUNCIÓN MEJORADA: LIBRO COMPLETO
// Permite especificar páginas B/N, Color y Full Color por separado
// ============================================

function agregarLibro() {
  // Obtener valores de los campos
  const paginasBN = parseInt(document.getElementById('libroPaginasBN')?.value || 0);
  const paginasColor = parseInt(document.getElementById('libroPaginasColor')?.value || 0);
  const paginasFullColor = parseInt(document.getElementById('libroPaginasFullColor')?.value || 0);
  const tamano = document.getElementById('libroTamano')?.value || 'carta';
  const tipoTerminacion = document.getElementById('libroTerminacion')?.value || 'ninguna';
  const juegos = parseInt(document.getElementById('libroJuegos')?.value || 1);

  // Validaciones
  const totalPaginas = paginasBN + paginasColor + paginasFullColor;
  
  if (totalPaginas === 0) {
    alert('Debe especificar al menos 1 página (B/N, Color o Full Color)');
    return;
  }

  if (!juegos || juegos <= 0) {
    alert('Número de juegos inválido');
    return;
  }

  // Validar tapa blanda solo para carta
  if (tipoTerminacion === 'tapa_blanda' && tamano !== 'carta') {
    alert('Empastado tapa blanda solo disponible para tamaño carta');
    return;
  }

  // Validar límite de encuadernado espiral
  if (tipoTerminacion === 'espiral' && totalPaginas > 1000) {
    alert('El encuadernado espiral tiene un límite de 1000 páginas totales');
    return;
  }

  // ===============================================
  // CALCULAR COSTOS POR SEPARADO
  // ===============================================
  
  let costoBN = 0;
  let costoColor = 0;
  let costoFullColor = 0;
  let costoTerminacion = 0;

  // 1. Calcular costo de impresión B/N
  if (paginasBN > 0) {
    costoBN = calcularPrecioImpresion(paginasBN, 'bn', tamano);
  }

  // 2. Calcular costo de impresión Color
  if (paginasColor > 0) {
    costoColor = calcularPrecioImpresion(paginasColor, 'color', tamano);
  }

  // 3. Calcular costo de impresión Full Color
  if (paginasFullColor > 0) {
    costoFullColor = calcularPrecioImpresion(paginasFullColor, 'full_color', tamano);
  }

  // 4. Calcular costo de terminación (si aplica)
  if (tipoTerminacion === 'espiral') {
    costoTerminacion = calcularPrecioEncuadernado(totalPaginas);
  } else if (tipoTerminacion === 'tapa_dura') {
    costoTerminacion = calcularPrecioEmpastado('Tapa Dura', tamano);
  } else if (tipoTerminacion === 'tapa_blanda') {
    costoTerminacion = calcularPrecioEmpastado('Tapa Blanda', tamano);
  }

  // 5. Costo total por libro individual
  const costoPorLibro = costoBN + costoColor + costoFullColor + costoTerminacion;

  // 6. Costo total (multiplicado por cantidad de juegos)
  const costoTotal = costoPorLibro * juegos;

  // ===============================================
  // CONSTRUIR DESCRIPCIÓN DETALLADA
  // ===============================================
  
  const tamanos = {
    carta: '8½ x 11',
    legal: '8½ x 14',
    tabloide: '11 x 17'
  };

  const terminacionTexto = {
    'espiral': 'Encuadernado espiral',
    'tapa_dura': 'Empastado tapa dura',
    'tapa_blanda': 'Empastado tapa blanda',
    'ninguna': 'Sin terminación'
  };

  // Construir descripción detallada
  let descripcion = `${juegos} libro(s) · ${totalPaginas} páginas totales · ${tamanos[tamano]}`;
  
  // Desglose de páginas
  let desglosePaginas = [];
  if (paginasBN > 0) desglosePaginas.push(`${paginasBN} B/N`);
  if (paginasColor > 0) desglosePaginas.push(`${paginasColor} Color`);
  if (paginasFullColor > 0) desglosePaginas.push(`${paginasFullColor} Full Color`);
  
  if (desglosePaginas.length > 0) {
    descripcion += `\n(${desglosePaginas.join(' + ')})`;
  }
  
  descripcion += `\n${terminacionTexto[tipoTerminacion]}`;

  // Desglose de costos (opcional, para transparencia)
  let desgloseCostos = [];
  if (costoBN > 0) desgloseCostos.push(`B/N: RD$${costoBN.toFixed(2)}`);
  if (costoColor > 0) desgloseCostos.push(`Color: RD$${costoColor.toFixed(2)}`);
  if (costoFullColor > 0) desgloseCostos.push(`Full Color: RD$${costoFullColor.toFixed(2)}`);
  if (costoTerminacion > 0) desgloseCostos.push(`${terminacionTexto[tipoTerminacion]}: RD$${costoTerminacion.toFixed(2)}`);
  
  if (desgloseCostos.length > 0 && juegos === 1) {
    descripcion += `\n[${desgloseCostos.join(' + ')}]`;
  } else if (desgloseCostos.length > 0 && juegos > 1) {
    descripcion += `\nCosto unitario: RD$${costoPorLibro.toFixed(2)}`;
  }

  // ===============================================
  // AGREGAR A COTIZACIÓN
  // ===============================================
  
  agregarACotizacion({
    nombre: '📘 Libro Completo',
    descripcion: descripcion,
    cantidad: juegos,
    precioUnitario: costoPorLibro,
    precio: costoTotal
  });

  // Limpiar formulario
  limpiarFormulario('formLibro');
  
  // Ocultar resumen
  const resumenDiv = document.getElementById('resumenLibro');
  if (resumenDiv) resumenDiv.style.display = 'none';
}

function agregarEncuadernado() {
  const pag = parseInt(document.getElementById('paginasEncuadernado')?.value);
  const cant = parseInt(document.getElementById('cantidadEncuadernado')?.value || 1);
  const manual = parseFloat(document.getElementById('precioPersonalEncuadernado')?.value || 0);

  if (!pag || pag <= 0) { alert('Páginas inválidas'); return; }
  if (!cant || cant <= 0) { alert('Cantidad inválida'); return; }

  // Validar límite máximo
  if (pag > 1000 && !manual) {
    alert('El encuadernado espiral tiene un límite de 1000 páginas. Use precio personalizado para cantidades mayores.');
    return;
  }

  // ✅ CORRECCIÓN: Precio manual es POR UNIDAD
  let precioUnitario;
  if (manual) {
    precioUnitario = manual; // Precio manual es por encuadernado
  } else {
    precioUnitario = calcularPrecioEncuadernado(pag);
  }
  
  if (precioUnitario === 0 && !manual) {
    alert('No se puede calcular el precio. Use precio personalizado.');
    return;
  }
  
  const precioTotal = precioUnitario * cant; // ✅ SIEMPRE multiplica

  agregarACotizacion({ 
    nombre: 'Encuadernado Espiral', 
    descripcion: `${cant} encuadernado(s) de ${pag} páginas`, 
    cantidad: cant,
    precioUnitario: precioUnitario,
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
  
  // Validar tapa blanda solo para carta
  if (tipoRaw === 'tapa_blanda' && tam !== 'carta') {
    alert('Empastado tapa blanda solo disponible para tamaño carta. Use precio personalizado o seleccione otro tamaño.');
    return;
  }
  
  // ✅ CORRECCIÓN: Precio manual es POR UNIDAD
  let precioUnitario;
  if (manual) {
    precioUnitario = manual; // Precio manual es por empastado
  } else {
    precioUnitario = calcularPrecioEmpastado(tipo, tam);
  }
  
  if (precioUnitario === 0 && !manual) {
    alert('Este tamaño no está disponible para este tipo. Use precio personalizado.');
    return;
  }
  
  const precioTotal = precioUnitario * cant; // ✅ SIEMPRE multiplica
  const tamanoTexto = tam === 'carta' ? '8.5x11' : tam === 'legal' ? '8.5x14' : '11x17';

  agregarACotizacion({ 
    nombre: `Empastado ${tipo}`, 
    descripcion: `${cant} empastado(s) ${tamanoTexto}`, 
    cantidad: cant,
    precioUnitario: precioUnitario,
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
  
  // ✅ CORRECCIÓN: Precio manual es POR UNIDAD
  if (manual) {
    precio = manual * cant; // Precio manual × cantidad (total)
    var precioUnitario = manual;
  } else if (tipoTam === 'personalizado') {
    precio = calcularPrecioPloteo(tipoPloteo, 'custom', cant, ancho, alto);
    var precioUnitario = precio / cant;
  } else {
    precio = calcularPrecioPloteo(tipoPloteo, tam, cant);
    var precioUnitario = precio / cant;
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
    `${cant} ${tipoTexto[tipoPloteo]} · ${tam}`;

  agregarACotizacion({
    nombre: 'Ploteo',
    descripcion: desc,
    cantidad: cant,
    precioUnitario: precioUnitario,
    precio: precio
  });
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

  const tamanoTexto = {
    cedula: 'Cédula',
    carta: 'Carta (8.5x11)',
    legal: 'Legal (8.5x14)',
    tabloide: 'Tabloide (11x17)'
  };
  
  const desc = corte ? 
    `${cant * piezas} piezas plastificadas y cortadas (${cant} hojas ${tamanoTexto[tam]}, ${piezas} piezas/hoja)` :
    `${cant} hoja(s) plastificadas ${tamanoTexto[tam]}`;
  
  // ✅ CORRECCIÓN: Precio manual es POR HOJA/PIEZA
  let precioTotal;
  if (manual) {
    if (corte) {
      const totalPiezas = cant * piezas;
      precioTotal = manual * totalPiezas; // Precio manual × piezas
    } else {
      precioTotal = manual * cant; // Precio manual × hojas
    }
  } else {
    precioTotal = calcularPrecioPlastificado(tam, corte, cant, piezas);
  }

  agregarACotizacion({ nombre: 'Plastificado', descripcion: desc, cantidad: llevaCorte ? cantidadHojas * piezasPorHoja : cantidadHojas, precioUnitario: precioUnitario, precio: precioTotal });
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

  const btnLimp = document.getElementById('btnLimpiarCotizacion');
  if (btnLimp) btnLimp.addEventListener('click', limpiarCotizacion);

  const btnGen = document.getElementById('btnGenerarCotizacion');
  if (btnGen) btnGen.addEventListener('click', generarCotizacion);
  
  // Event listeners para el resumen del libro en tiempo real
  const camposLibro = ['libroPaginasBN', 'libroPaginasColor', 'libroPaginasFullColor', 'libroJuegos', 'libroTerminacion'];
  camposLibro.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener('input', actualizarResumenLibro);
      elemento.addEventListener('change', actualizarResumenLibro);
    }
  });
}

// ============================================
// 📊 RESUMEN AUTOMÁTICO DEL LIBRO
// ============================================

function actualizarResumenLibro() {
  const bn = parseInt(document.getElementById('libroPaginasBN')?.value || 0);
  const color = parseInt(document.getElementById('libroPaginasColor')?.value || 0);
  const fullColor = parseInt(document.getElementById('libroPaginasFullColor')?.value || 0);
  const juegos = parseInt(document.getElementById('libroJuegos')?.value || 1);
  const terminacion = document.getElementById('libroTerminacion')?.value;
  
  const totalPaginas = bn + color + fullColor;
  
  if (totalPaginas > 0) {
    const resumenDiv = document.getElementById('resumenLibro');
    const contentDiv = document.getElementById('resumenContent');
    
    if (resumenDiv && contentDiv) {
      resumenDiv.style.display = 'block';
      
      let html = `<p><strong>Total de páginas:</strong> ${totalPaginas}</p>`;
      if (bn > 0) html += `<p>• ${bn} páginas B/N</p>`;
      if (color > 0) html += `<p>• ${color} páginas Color</p>`;
      if (fullColor > 0) html += `<p>• ${fullColor} páginas Full Color</p>`;
      
      const termTexto = {
        'ninguna': 'Sin terminación',
        'espiral': 'Con encuadernado espiral',
        'tapa_blanda': 'Con empastado tapa blanda',
        'tapa_dura': 'Con empastado tapa dura'
      };
      
      html += `<p><strong>Terminación:</strong> ${termTexto[terminacion] || 'N/A'}</p>`;
      html += `<p><strong>Copias:</strong> ${juegos} libro(s)</p>`;
      
      contentDiv.innerHTML = html;
    }
  } else {
    const resumenDiv = document.getElementById('resumenLibro');
    if (resumenDiv) resumenDiv.style.display = 'none';
  }
}

// ============================================
// � CÁLCULO DE PRECIOS EN TIEMPO REAL
// ============================================

function calcularPrecioImpresionTiempoReal() {
  const cantidad = parseInt(document.getElementById('cantidadPaginas')?.value || 0);
  const tipo = document.getElementById('tipoImpresion')?.value;
  const tamano = document.getElementById('tamanoImpresion')?.value;
  const precioDiv = document.getElementById('precioImpresion');
  const unitarioSpan = document.getElementById('precioUnitarioImpresion');
  const totalSpan = document.getElementById('precioTotalImpresion');

  if (!cantidad || !tipo || !tamano || cantidad <= 0) {
    if (precioDiv) precioDiv.style.display = 'none';
    return;
  }

  const precioUnitario = calcularPrecioImpresion(cantidad, tipo, tamano) / cantidad;
  const precioTotal = precioUnitario * cantidad;

  if (precioUnitario > 0) {
    if (unitarioSpan) unitarioSpan.textContent = `RD$${precioUnitario.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `RD$${precioTotal.toFixed(2)}`;
    if (precioDiv) precioDiv.style.display = 'block';
  } else {
    if (precioDiv) precioDiv.style.display = 'none';
  }
}

function calcularPrecioEncuadernadoTiempoReal() {
  const paginas = parseInt(document.getElementById('paginasEncuadernado')?.value || 0);
  const cantidad = parseInt(document.getElementById('cantidadEncuadernado')?.value || 1);
  const precioDiv = document.getElementById('precioEncuadernado');
  const unitarioSpan = document.getElementById('precioUnitarioEncuadernado');
  const totalSpan = document.getElementById('precioTotalEncuadernado');

  if (!paginas || paginas <= 0) {
    if (precioDiv) precioDiv.style.display = 'none';
    return;
  }

  const precioUnitario = calcularPrecioEncuadernado(paginas);
  const precioTotal = precioUnitario * cantidad;

  if (precioUnitario > 0) {
    if (unitarioSpan) unitarioSpan.textContent = `RD$${precioUnitario.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `RD$${precioTotal.toFixed(2)}`;
    if (precioDiv) precioDiv.style.display = 'block';
  } else {
    if (precioDiv) precioDiv.style.display = 'none';
  }
}

function calcularPrecioEmpastadoTiempoReal() {
  const tipoRaw = document.getElementById('tipoEmpastadoGeneral')?.value;
  const tamano = document.getElementById('tamanoEmpastado')?.value;
  const cantidad = parseInt(document.getElementById('cantidadEmpastado')?.value || 1);
  const precioDiv = document.getElementById('precioEmpastado');
  const unitarioSpan = document.getElementById('precioUnitarioEmpastado');
  const totalSpan = document.getElementById('precioTotalEmpastado');

  if (!tipoRaw || !tamano) {
    if (precioDiv) precioDiv.style.display = 'none';
    return;
  }

  const tipoMap = { tapa_dura: 'Tapa Dura', tapa_blanda: 'Tapa Blanda' };
  const tipo = tipoMap[tipoRaw];
  const precioUnitario = calcularPrecioEmpastado(tipo, tamano);
  const precioTotal = precioUnitario * cantidad;

  if (precioUnitario > 0) {
    if (unitarioSpan) unitarioSpan.textContent = `RD$${precioUnitario.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `RD$${precioTotal.toFixed(2)}`;
    if (precioDiv) precioDiv.style.display = 'block';
  } else {
    if (precioDiv) precioDiv.style.display = 'none';
  }
}

function calcularPrecioPloteoTiempoReal() {
  const tipo = document.getElementById('tipoPloteo')?.value;
  const opcionTamano = document.getElementById('opcionTamanoPloteo')?.value;
  const tamano = document.getElementById('tamanoPloteo')?.value;
  const cantidad = parseInt(document.getElementById('cantidadPloteo')?.value || 1);
  const ancho = parseFloat(document.getElementById('anchoPloteo')?.value || 0);
  const alto = parseFloat(document.getElementById('altoPloteo')?.value || 0);
  const precioDiv = document.getElementById('precioPloteo');
  const unitarioSpan = document.getElementById('precioUnitarioPloteo');
  const totalSpan = document.getElementById('precioTotalPloteo');

  if (!tipo || !opcionTamano || cantidad <= 0) {
    if (precioDiv) precioDiv.style.display = 'none';
    return;
  }

  let precioUnitario = 0;
  if (opcionTamano === 'personalizado' && ancho > 0 && alto > 0) {
    precioUnitario = calcularPrecioPloteo(tipo, 'custom', 1, ancho, alto);
  } else if (tamano) {
    precioUnitario = calcularPrecioPloteo(tipo, tamano, 1);
  }

  const precioTotal = precioUnitario * cantidad;

  if (precioUnitario > 0) {
    if (unitarioSpan) unitarioSpan.textContent = `RD$${precioUnitario.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `RD$${precioTotal.toFixed(2)}`;
    if (precioDiv) precioDiv.style.display = 'block';
  } else {
    if (precioDiv) precioDiv.style.display = 'none';
  }
}

function calcularPrecioPlastificadoTiempoReal() {
  const tamano = document.getElementById('tamanoPlastificado')?.value;
  const llevaCorte = document.getElementById('llevaCorte')?.value === 'si';
  const cantidadHojas = parseInt(document.getElementById('cantidadPlastificado')?.value || 1);
  const piezasPorHoja = llevaCorte ? parseInt(document.getElementById('cantidadPiezas')?.value || 1) : 1;
  const precioDiv = document.getElementById('precioPlastificado');
  const unitarioSpan = document.getElementById('precioUnitarioPlastificado');
  const totalSpan = document.getElementById('precioTotalPlastificado');

  if (!tamano || cantidadHojas <= 0) {
    if (precioDiv) precioDiv.style.display = 'none';
    return;
  }

  const precioTotal = calcularPrecioPlastificado(tamano, llevaCorte, cantidadHojas, piezasPorHoja);
  const precioUnitario = llevaCorte ? precioTotal / (cantidadHojas * piezasPorHoja) : precioTotal / cantidadHojas;

  if (precioUnitario > 0) {
    if (unitarioSpan) unitarioSpan.textContent = `RD$${precioUnitario.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `RD$${precioTotal.toFixed(2)}`;
    if (precioDiv) precioDiv.style.display = 'block';
  } else {
    if (precioDiv) precioDiv.style.display = 'none';
  }
}

// ============================================
// 🎯 EVENT LISTENERS PARA PRECIOS EN TIEMPO REAL
// ============================================

function inicializarPrecioTiempoReal() {
  // Impresión
  const camposImpresion = ['cantidadPaginas', 'tipoImpresion', 'tamanoImpresion'];
  camposImpresion.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener('input', calcularPrecioImpresionTiempoReal);
      elemento.addEventListener('change', calcularPrecioImpresionTiempoReal);
    }
  });

  // Encuadernado
  const camposEncuadernado = ['paginasEncuadernado', 'cantidadEncuadernado'];
  camposEncuadernado.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener('input', calcularPrecioEncuadernadoTiempoReal);
      elemento.addEventListener('change', calcularPrecioEncuadernadoTiempoReal);
    }
  });

  // Empastado
  const camposEmpastado = ['tipoEmpastadoGeneral', 'tamanoEmpastado', 'cantidadEmpastado'];
  camposEmpastado.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener('input', calcularPrecioEmpastadoTiempoReal);
      elemento.addEventListener('change', calcularPrecioEmpastadoTiempoReal);
    }
  });

  // Ploteo
  const camposPloteo = ['tipoPloteo', 'opcionTamanoPloteo', 'tamanoPloteo', 'cantidadPloteo', 'anchoPloteo', 'altoPloteo'];
  camposPloteo.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener('input', calcularPrecioPloteoTiempoReal);
      elemento.addEventListener('change', calcularPrecioPloteoTiempoReal);
    }
  });

  // Plastificado
  const camposPlastificado = ['tamanoPlastificado', 'llevaCorte', 'cantidadPlastificado', 'cantidadPiezas'];
  camposPlastificado.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener('input', calcularPrecioPlastificadoTiempoReal);
      elemento.addEventListener('change', calcularPrecioPlastificadoTiempoReal);
    }
  });
}

// ============================================
// � GENERAR PDF DE COTIZACIÓN
// ============================================

function generarPDF() {
  const header = `
    <div style="text-align: center; margin-bottom: 20px; font-family: Arial, sans-serif;">
      <img src="logo.png" alt="Logo ServiGaco" style="width: 100px; height: auto; margin-bottom: 10px;">
      <h2 style="margin: 0; color: #333;">ServiGaco</h2>
      <p style="margin: 5px 0; font-size: 14px;">Teléfono: (809) 123-4567</p>
      <p style="margin: 5px 0; font-size: 14px;">Dirección: Santo Domingo, República Dominicana</p>
      <h3 style="margin-top: 20px; color: #555;">Cotización de Servicios</h3>
    </div>
  `;

  // Clonar tabla y limpiar elementos interactivos (botones, inputs)
  const originalTable = document.getElementById('cotizacionTabla');
  if (!originalTable) { alert('No se encontró la tabla de cotización'); return; }

  const tableClone = originalTable.cloneNode(true);
  // Eliminar columna de acciones (última columna) y botones
  tableClone.querySelectorAll('tr').forEach(row => {
    // eliminar botones dentro de la fila
    row.querySelectorAll('button, input, select').forEach(n => n.remove());
    // si la fila tiene más de 0 celdas, remover la última (acciones)
    const cells = row.querySelectorAll('th, td');
    if (cells.length > 0) cells[cells.length - 1].remove();
  });

  // Crear contenedor temporal y aplicarle estilo (invisible pero renderizable)
  const tempDiv = document.createElement('div');
  // Colocar fuera de la vista pero renderizable (no usar opacity:0 que algunos motores ignoran)
  tempDiv.style.position = 'fixed';
  tempDiv.style.left = '-10000px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '600px';
  tempDiv.style.background = '#ffffff';
  tempDiv.style.visibility = 'visible';
  tempDiv.style.pointerEvents = 'none';
  tempDiv.style.zIndex = '9999';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.innerHTML = header;
  // Añadir estilos mínimos para que la tabla se vea bien en el PDF
  const style = document.createElement('style');
  style.textContent = `
    body { font-size: 10px; }
    table { border-collapse: collapse; width: 100%; font-size: 9px; }
    table th, table td { border: 1px solid #ddd; padding: 4px 6px; font-size: 9px; }
    table th { background: #f4f4f4; text-align: left; }
    h2 { font-size: 16px; margin: 0 0 6px 0; }
    h3 { font-size: 14px; margin: 4px 0; }
    p { font-size: 10px; margin: 0; }
    img { max-width: 80px; height: auto; display: block; margin: 0 auto 6px; }
  `;
  tempDiv.appendChild(style);
  tempDiv.appendChild(tableClone);
  document.body.appendChild(tempDiv);

  const timestamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
  const opt = {
    margin: 0.5,
    filename: `cotizacion-${timestamp}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: false, allowTaint: true, logging: false, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  // Esperar a que las imágenes dentro del contenedor temporal carguen antes de renderizar
  const imgs = tempDiv.querySelectorAll('img');
  const imgPromises = Array.from(imgs).map(img => new Promise(resolve => {
    if (img.complete) return resolve();
    img.onload = img.onerror = () => resolve();
    // intentar forzar recarga si está vacío
    if (!img.src) resolve();
  }));

  // Logs de diagnóstico
  console.log('generarPDF: filas en tabla clonada =', tableClone.querySelectorAll('tr').length);
  console.log('generarPDF: texto del contenedor (primeros 200 chars):', tempDiv.innerText.slice(0,200));

  const runRender = () => {
    html2pdf().set(opt).from(tempDiv).save().then(() => {
      if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv);
    }).catch(err => {
      console.error('Error generando PDF:', err);
      if (document.body.contains(tempDiv)) document.body.removeChild(tempDiv);
      alert('Ocurrió un error al generar el PDF. Revisa la consola.');
    });
  };

  Promise.all(imgPromises).then(runRender).catch(runRender);
}

// ============================================
// 🖨️ IMPRIMIR COTIZACIÓN (vista para imprimir)
// ============================================

function imprimirCotizacion() {
  if (cotizacion.length === 0) { alert('Cotización vacía'); return; }

  const originalTable = document.getElementById('cotizacionTabla');
  if (!originalTable) { alert('No se encontró la tabla de cotización'); return; }

  const tableClone = originalTable.cloneNode(true);
  tableClone.querySelectorAll('tr').forEach(row => {
    row.querySelectorAll('button, input, select').forEach(n => n.remove());
    const cells = row.querySelectorAll('th, td');
    if (cells.length > 0) cells[cells.length - 1].remove();
  });

  const fecha = new Date().toLocaleString();
  const tipoComp = document.getElementById('tipoComprobante')?.value || 'ninguno';
  const subtotal = cotizacion.reduce((s, i) => s + i.precio, 0);
  
  let impuesto = 0;
  let nombreImpuesto = '';
  if (tipoComp === 'fiscal') { impuesto = subtotal * 0.18; nombreImpuesto = 'ITBIS (18%)'; }
  else if (tipoComp === 'gubernamental') { impuesto = subtotal * 0.10; nombreImpuesto = 'ISR (10%)'; }
  const total = subtotal + impuesto;

  const resumenHTML = tipoComp !== 'ninguno' ? `
    <tr style="background-color: #f0f9ff;">
      <td colspan="4" style="text-align: right; font-weight: bold; color: #475569; padding: 12px 16px;">Subtotal:</td>
      <td style="text-align: right; font-weight: bold; color: #2563eb; padding: 12px 16px; font-size: 16px;">RD$${subtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
    </tr>
    <tr>
      <td colspan="4" style="text-align: right; font-weight: bold; color: #475569; padding: 12px 16px;">Impuesto (${nombreImpuesto}):</td>
      <td style="text-align: right; font-weight: bold; color: #ea580c; padding: 12px 16px; font-size: 16px;">RD$${impuesto.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
    </tr>
    <tr style="background: linear-gradient(to right, #2563eb, #1e40af);">
      <td colspan="4" style="text-align: right; font-weight: bold; color: white; padding: 16px; font-size: 14px;">TOTAL A PAGAR:</td>
      <td style="text-align: right; font-weight: 900; color: white; padding: 16px; font-size: 18px; background: linear-gradient(to right, #ea580c, #c2410c);">RD$${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
    </tr>
  ` : `
    <tr style="background: linear-gradient(to right, #2563eb, #1e40af);">
      <td colspan="4" style="text-align: right; font-weight: bold; color: white; padding: 16px; font-size: 14px;">TOTAL:</td>
      <td style="text-align: right; font-weight: 900; color: white; padding: 16px; font-size: 18px; background: linear-gradient(to right, #ea580c, #c2410c);">RD$${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
    </tr>
  `;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cotización - ServiGaco</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: white; }
        .container { max-width: 900px; margin: 0 auto; background: white; overflow: hidden; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%); color: white; padding: 40px 30px; position: relative; overflow: hidden; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .header::before { content: ''; position: absolute; top: -50%; right: -50%; width: 400px; height: 400px; background: rgba(234, 88, 12, 0.15); border-radius: 50%; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .header::after { content: ''; position: absolute; bottom: -30%; left: -30%; width: 300px; height: 300px; background: rgba(234, 88, 12, 0.1); border-radius: 50%; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .header-content { position: relative; z-index: 1; text-align: center; }
        .logo { width: 140px; height: auto; margin: 0 auto 15px; display: block; }
        .header h1 { font-size: 28px; font-weight: 900; margin-bottom: 5px; letter-spacing: -0.5px; }
        .header-divider { width: 50px; height: 4px; background: linear-gradient(to right, #f97316, #ea580c); margin: 10px auto 15px; border-radius: 10px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .header p { font-size: 12px; color: #bfdbfe; font-weight: 600; letter-spacing: 1px; margin-bottom: 15px; }
        .header-badge { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 12px 20px; font-size: 12px; font-weight: 600; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .content { padding: 30px; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: linear-gradient(to right, #2563eb, #1e40af); color: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        thead th { padding: 14px 16px; text-align: left; font-weight: 700; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        tbody tr { border-bottom: 1px solid #e0e7ff; }
        tbody tr:nth-child(odd) { background: #f0f9ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        tbody tr:nth-child(even) { background: white; }
        tbody td { padding: 14px 16px; font-size: 13px; }
        tbody td:first-child { font-weight: 700; color: #1e3a8a; }
        tbody td:nth-child(3) { text-align: center; font-weight: 600; }
        tbody td:nth-child(4), tbody td:nth-child(5) { text-align: right; }
        tbody td:nth-child(4) { color: #2563eb; font-weight: 600; }
        tbody td:nth-child(5) { color: #ea580c; font-weight: 700; }
        .footer { background: linear-gradient(to right, #1f2937, #111827); border-top: 4px solid #ea580c; padding: 25px 30px; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .footer-brand { color: #f97316; font-weight: 900; font-size: 16px; letter-spacing: 1px; margin-bottom: 5px; }
        .footer-subtitle { color: #cbd5e1; font-size: 11px; font-weight: 600; margin-bottom: 12px; }
        .footer-text { color: #94a3b8; font-size: 11px; line-height: 1.6; border-top: 1px solid #374151; padding-top: 12px; margin-top: 12px; }
        @page { size: 8.5in 11in; margin: 0.3in; }
        @media print {
          html, body { width: 8.5in; height: 11in; margin: 0; padding: 0; overflow: hidden; }
          body { background: white; }
          .container { box-shadow: none; border-radius: 0; max-height: 100%; overflow: hidden; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .header { padding: 25px 20px; }
          .header h1 { font-size: 24px; }
          .header p { font-size: 10px; }
          .content { padding: 15px; }
          table { font-size: 11px; }
          thead th { padding: 10px 12px; font-size: 10px; }
          tbody td { padding: 8px 12px; font-size: 10px; }
          .footer { padding: 15px 20px; font-size: 9px; }
          .footer-brand { font-size: 13px; }
          .footer-subtitle { font-size: 9px; }
          .footer-text { font-size: 9px; }
          .logo { width: 100px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- HEADER -->
        <div class="header">
          <div class="header-content">
            <img src="logo.png" alt="Servigaco Logo" class="logo" />
            <div class="header-divider"></div>
            <p>COTIZACIÓN DE SERVICIOS PROFESIONALES</p>
            <div class="header-badge">
              📅 ${fecha} | ✓ Presupuesto Válido
            </div>
          </div>
        </div>

        <!-- CONTENIDO -->
        <div class="content">
          <table>
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Descripción</th>
                <th style="width: 80px; text-align: center;">Cantidad</th>
                <th style="width: 110px; text-align: right;">Precio Unit.</th>
                <th style="width: 110px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from(tableClone.querySelectorAll('tbody tr')).map((row, idx) => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 5) {
                  return '<tr>' +
                    '<td>' + cells[0].textContent.trim() + '</td>' +
                    '<td>' + cells[1].textContent.trim() + '</td>' +
                    '<td style="text-align: center;">' + cells[2].textContent.trim() + '</td>' +
                    '<td style="text-align: right;">' + cells[3].textContent.trim() + '</td>' +
                    '<td style="text-align: right;">' + cells[4].textContent.trim() + '</td>' +
                  '</tr>';
                }
                return '';
              }).join('')}
            </tbody>
            <tfoot>
              ${resumenHTML}
            </tfoot>
          </table>
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <div class="footer-brand">ServiGaco®</div>
          <div class="footer-subtitle">SERVICIOS DE IMPRESIÓN PROFESIONALES</div>
          <div class="footer-text">
            Cotización generada automáticamente. Válida por 30 días.<br>
            Para confirmar el pedido, contacta con nuestro equipo de ventas.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const ventana = window.open('', 'cotizacion', 'width=1200,height=800');
  ventana.document.write(html);
  ventana.document.close();

  setTimeout(() => {
    ventana.print();
  }, 500);
}

// ============================================
// �🚀 INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  actualizarCotizacion();
  marcarPaginaActiva();
  configurarMenuMovil();
  inicializarEventListeners();
  inicializarPrecioTiempoReal(); // ← Agregado
  const btnGenPDF = document.getElementById('generarPDF');
  if (btnGenPDF) btnGenPDF.addEventListener('click', imprimirCotizacion);
  console.log('✅ Script inicializado');
});