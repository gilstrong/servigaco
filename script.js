// ============================================
// 📋 CONFIGURACIÓN Y CONSTANTES
// ============================================


// 🔗 URL DE TU API DE GOOGLE SHEETS (Pégala aquí abajo)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHk5dI_qZeec9tlrl8mo4ubRre0mNrLrST-4Z-7pyqOhcnbupE201lJhORig4TAgrWbw/exec';
const PRECIOS = {
  carta: {
    bond: { bn: 6, color: 12 },
    hilo: { bn: 8, color: 15 },
    satinado: { precio: 25 }
  },
  tabloide: {
    satinado: { precio: 45 }
  }
};

const TAPA_DURA = {
  beige: 600,
  morado: 500,
  azul_marino: 500,
  azul_cielo: 500,
  rojo: 500,
  verde_botella: 500,
  amarillo_medicina: 500,
  blanco: 600,
};

const VINIL = {
  carta: 1200,
  tabloide: 1500
};

// Constantes de servicios adicionales
const PRECIOS_SERVICIOS = {
  LOMO: 50,
  CD: 200,
  REDONDEO_MULTIPLO: 5
};

const BLOQUE_MENSAJE_PAGINA_SIGUIENTE = `
  <div class="mensaje-pagina-siguiente">
    <span class="flecha">⬇</span>
    <span class="texto">
      Debajo encontrarás las cuentas bancarias y el ejemplar del empastado
    </span>
  </div>
`;


const TIEMPO_ENTREGA = {
  TAPA_DURA: '6 horas',
  VINIL: '24 horas'
};

// ============================================
// 🖼️ IMÁGENES DE EJEMPLARES POR COLOR
// ============================================

const IMAGEN_EJEMPLAR_TAPA = {
  beige: 'beige.png',
  morado: 'morado.png',
  azul_marino: 'azulmarino.jpg',
  azul_cielo: 'azulcielo.png',
  rojo: 'rojo.jpg',
  verde_botella: 'verdebotella.jpg',
  amarillo_medicina: 'amarillomedicina.jpg',
  blanco: 'blanca.png'
};



const BLOQUE_CUENTAS = `
  <div class="cuentas-pago">
    <img src="bhd.jpg" alt="Cuenta BHD" class="img-cuenta">
    <img src="popular.jpg" alt="Cuenta Popular" class="img-cuenta">
    <img src="banreservas.jpg" alt="Cuenta Banreservas" class="img-cuenta">
  </div>


    <!-- AQUÍ va el tiempo de entrega -->
    {{TIEMPO_ENTREGA}}
`;

// ============================================
// 🔧 UTILIDADES
// ============================================

/**
 * Convierte nombre de color con guiones bajos a formato legible
 * @param {string} color - Nombre del color con guiones bajos
 * @returns {string} Nombre formateado
 */
function nombreColor(color) {
  return color.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Redondea un número al múltiplo de 5 más cercano
 * @param {number} num - Número a redondear
 * @returns {number} Número redondeado
 */
function redondearA5(num) {
  return Math.round(num / PRECIOS_SERVICIOS.REDONDEO_MULTIPLO) * PRECIOS_SERVICIOS.REDONDEO_MULTIPLO;
}

/**
 * Formatea un número como moneda dominicana
 * @param {number} valor - Valor a formatear
 * @returns {string} Valor formateado
 */
function formatearMoneda(valor) {
  return `RD$${valor.toLocaleString('es-DO')}`;
}

// ============================================
// 🆔 ID Y FECHA DE COTIZACIÓN
// ============================================

function generarIdCotizacion() {
  const fecha = new Date();
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  const h = String(fecha.getHours()).padStart(2, '0');
  const min = String(fecha.getMinutes()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 900 + 100);

  return `CTZ-${y}${m}${d}-${h}${min}-${rand}`;
}

function fechaFormateada() {
  return new Date().toLocaleString('es-DO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function nombreArchivoPDF(id, colorTapa) {
  const color = colorTapa ? colorTapa.replace(/_/g, '-') : 'vinil';
  return `${id}-${color}.pdf`;
}


/**
 * Obtiene valor numérico de un input con valor por defecto
 * @param {string} id - ID del elemento
 * @param {number} valorDefecto - Valor por defecto
 * @returns {number} Valor parseado
 */
function obtenerValorNumerico(id, valorDefecto = 0) {
  return parseInt(document.getElementById(id)?.value) || valorDefecto;
}

// ============================================
// 📱 ELEMENTOS DEL DOM
// ============================================

const elementos = {
  // Selectores principales
  tamano: document.getElementById('tamano'),
  papel: document.getElementById('papel'),
  tipoEmpastado: document.getElementById('tipoEmpastado'),
  
  // Alertas y secciones
  alertaTabloide: document.getElementById('alertaTabloide'),
  bnColorSection: document.getElementById('bnColorSection'),
  soloPaginas: document.getElementById('soloPaginas'),
  colorTapaSection: document.getElementById('colorTapaSection'),
  
  // CD
  llevaCd: document.getElementById('llevaCd'),
  cdSection: document.getElementById('cdSection'),
  
  // Resultado
  resultado: document.getElementById('resultado'),
  
  // Botones
  btnCalcular: document.getElementById('btnCalcular'),
  btnGenerar: document.getElementById('btnGenerar'),
  btnCompartir: document.getElementById('btnCompartir'),
  btnReiniciar: document.getElementById('btnReiniciar'),
  btnMostrarTabla: document.getElementById('btnMostrarTabla'),
  
  // Otros
  tablaPrecios: document.getElementById('tablaPrecios')
};

let ultimaCotizacion = '';
let datosGlobales = {};
let datosParaGuardar = null; // Variable temporal para guardar en Sheets


// ============================================
// 🎨 FUNCIONES DE VISTA
// ============================================

/**
 * Actualiza la visibilidad de secciones según selecciones
 */
function actualizarVista() {
  const tamano = elementos.tamano.value;

  // Primero forzamos el modo según tamaño
  if (tamano === 'tabloide') {
    configurarModoTabloide();
  } else {
    configurarModoCarta();
  }

  // 🔥 AHORA sí leemos los valores reales
  const esSatinado = elementos.papel.value === 'satinado';
  const esTapaDura = elementos.tipoEmpastado.value === 'tapa_dura';

  // Mostrar/ocultar secciones según papel
  elementos.bnColorSection.style.display = esSatinado ? 'none' : 'block';
  elementos.soloPaginas.style.display = esSatinado ? 'block' : 'none';

  // Color de tapa SOLO carta + tapa dura
  elementos.colorTapaSection.style.display =
    (esTapaDura && tamano === 'carta') ? 'block' : 'none';
}


/**
 * Configura vista para modo tabloide
 */
function configurarModoTabloide() {
  elementos.alertaTabloide.style.display = 'block';
  elementos.papel.value = 'satinado';
  elementos.papel.disabled = true;
  elementos.tipoEmpastado.value = 'vinil';
  elementos.tipoEmpastado.disabled = true;
}

/**
 * Configura vista para modo carta
 */
function configurarModoCarta() {
  elementos.alertaTabloide.style.display = 'none';
  elementos.papel.disabled = false;
  elementos.tipoEmpastado.disabled = false;
}

/**
 * Alterna visibilidad de sección CD
 */
function toggleSeccionCD() {
  const mostrar = elementos.llevaCd.value === 'si';
  elementos.cdSection.style.display = mostrar ? 'block' : 'none';
}

/**
 * Alterna visibilidad de tabla de precios
 */
function toggleTablaPrecios() {
  elementos.tablaPrecios?.classList.toggle('mostrar');
}

// ============================================
// 🧮 LÓGICA DE CÁLCULO
// ============================================

/**
 * Calcula el costo de impresión según el tipo de papel
 * @returns {Object} {impresion, detalleImpresion}
 */
function calcularImpresion() {
  const esSatinado = elementos.papel.value === 'satinado';
  
  if (esSatinado) {
    return calcularImpresionSatinado();
  } else {
    return calcularImpresionBondHilo();
  }
}

/**
 * Calcula impresión para papel satinado
 * @returns {Object}
 */
function calcularImpresionSatinado() {
  const paginas = obtenerValorNumerico('paginas');
  
  if (!paginas) {
    throw new Error('Debe ingresar la cantidad de páginas');
  }

  const precio = PRECIOS[elementos.tamano.value].satinado.precio;
  
  return {
    impresion: paginas * precio,
    detalleImpresion: `${paginas} páginas x RD$${precio}`
  };
}

/**
 * Calcula impresión para papel bond/hilo
 * @returns {Object}
 */
function calcularImpresionBondHilo() {
  const bn = obtenerValorNumerico('bn');
  const color = obtenerValorNumerico('color');
  
  if (bn + color === 0) {
    throw new Error('Debe ingresar páginas en blanco y negro o color');
  }

  const precios = PRECIOS[elementos.tamano.value][elementos.papel.value];
  
  return {
    impresion: bn * precios.bn + color * precios.color,
    detalleImpresion: `${bn} B/N + ${color} Color`
  };
}

/**
 * Calcula el costo del empastado
 * @param {number} tomos - Cantidad de tomos
 * @returns {Object} {empastado, tipoEmp, colorTapa}
 */
function calcularEmpastado(tomos) {
  const tipoEmp = elementos.tipoEmpastado.value;
  const colorTapa = tipoEmp === 'tapa_dura' 
    ? document.getElementById('colorTapa').value 
    : '';

  const costoUnitario = tipoEmp === 'vinil'
    ? VINIL[elementos.tamano.value]
    : TAPA_DURA[colorTapa];

  return {
    empastado: costoUnitario * tomos,
    tipoEmp,
    colorTapa,
    costoUnitario
  };
}

/**
 * Genera bloque visual del ejemplar según color de tapa
 * @param {string} tipoEmp
 * @param {string} colorTapa
 * @returns {string}
 */
function generarBloqueEjemplar(tipoEmp, colorTapa) {
  if (tipoEmp !== 'tapa_dura') return '';

  const src = IMAGEN_EJEMPLAR_TAPA[colorTapa];
  if (!src) return '';

  return `
    <div class="bloque-ejemplar">
      <div class="bloque-ejemplar-header">
        📘 Ejemplar – Tapa ${nombreColor(colorTapa)}
      </div>
      <div class="bloque-ejemplar-img">
        <img src="${src}" alt="Ejemplar color ${colorTapa}">
      </div>
    </div>
  `;
}


/**
 * Calcula servicios adicionales
 * @param {number} tomos - Cantidad de tomos
 * @returns {Object} {lomoVal, cdVal, lomo, cd, cantidadCd}
 */
function calcularServiciosAdicionales(tomos) {
  const lomo = document.getElementById('lomo').value === 'si';
  const lomoVal = lomo ? PRECIOS_SERVICIOS.LOMO * tomos : 0;

  const cd = elementos.llevaCd.value === 'si';
  const cantidadCd = cd ? obtenerValorNumerico('cantidadCd') : 0;
  const cdVal = cantidadCd * PRECIOS_SERVICIOS.CD;

  return { lomoVal, cdVal, lomo, cd, cantidadCd };
}

/**
 * Función principal de cálculo de cotización
 */
function calcular() {
  try {

    const idCotizacion = generarIdCotizacion();
    const fecha = fechaFormateada();

    const tomos = Math.max(1, obtenerValorNumerico('tomos', 1));
    
    // Cálculo de impresión
    const { impresion, detalleImpresion } = calcularImpresion();
    
    // Cálculo de empastado
    const { empastado, tipoEmp, colorTapa, costoUnitario } = calcularEmpastado(tomos);
    
    // Servicios adicionales
    const { lomoVal, cdVal, lomo, cd, cantidadCd } = calcularServiciosAdicionales(tomos);
    
    // Total
    const total = impresion * tomos + empastado + lomoVal + cdVal;
    const totalRedondeado = redondearA5(total);
    
    // Generar HTML de cotización
datosGlobales = {
  idCotizacion,
  colorTapa
};

    ultimaCotizacion = generarHTMLCotizacion({
      idCotizacion,
      fecha,
      tomos,
      impresion,
      detalleImpresion,
      empastado,
      tipoEmp,
      colorTapa,
      costoUnitario,
      lomoVal,
      cdVal,
      lomo,
      cd,
      cantidadCd,
      totalRedondeado
    });

    const descripcionTesis = `Tesis: ${tomos} tomos, ${nombreColor(elementos.tamano.value)}, ${nombreColor(elementos.papel.value)}, ${nombreColor(elementos.tipoEmpastado.value)}`;

// Preparar datos para Google Sheets
datosParaGuardar = {
  tipo: 'Tesis',
  total: totalRedondeado.toFixed(2),
  detalle: `📚 ${tomos} tomos - RD$${totalRedondeado.toFixed(2)}\n📄 ${nombreColor(elementos.tamano.value)} / ${nombreColor(elementos.papel.value)}\n📕 ${nombreColor(elementos.tipoEmpastado.value)}`,
  descripcion: descripcionTesis,
  fecha: fecha,
  id: idCotizacion
};


    
    elementos.resultado.innerHTML = ultimaCotizacion;
    mostrarNotificacion('Cotización calculada exitosamente', 'success');
    
  } catch (error) {
    mostrarNotificacion(error.message, 'error');
  }
}

// ============================================
// 🎨 GENERACIÓN DE HTML
// ============================================

/**
 * Genera el HTML completo de la cotización
 * @param {Object} datos - Datos de la cotización
 * @returns {string} HTML generado
 */
function generarHTMLCotizacion(datos) {
return `
  <div class="page-break"></div>

  <div class="cotizacion">
    ${generarEncabezado(datos.idCotizacion, datos.fecha)}
    ${generarTablaDetalle(datos)}
    
      ${generarTablaTotal(datos.totalRedondeado)}
      ${BLOQUE_MENSAJE_PAGINA_SIGUIENTE}
  
    
    ${generarBloqueEjemplar(datos.tipoEmp, datos.colorTapa)}
    ${BLOQUE_CUENTAS.replace(
      '{{TIEMPO_ENTREGA}}',
      generarTiempoEntrega(datos.tipoEmp)
    )}
  </div>
`;

}

function formatearMonto(valor) {
  return Number(valor).toLocaleString('en-US');
}



/**
 * Genera el encabezado de la cotización
 * @returns {string}
 */
function generarEncabezado(idCotizacion, fecha) {
  return `
    <div class="cotizacion-header">
      <img src="logo.png" class="logo" alt="Logo ServiGaco">
      <div class="empresa-info">
        <h1>Cotización de Tesis</h1>
        <p>
          <strong>ID:</strong> ${idCotizacion}<br>
          <strong>Fecha:</strong> ${fecha}<br>
          ServiGaco<br>
          Tel: 809-682-1075
        </p>
      </div>
    </div>
  `;
}


/**
 * Genera la tabla de detalle de servicios
 * @param {Object} datos
 * @returns {string}
 */
function generarTablaDetalle(datos) {
  const filaLomo = datos.lomo ? generarFilaLomo(datos.tomos, datos.lomoVal) : '';
  const filaCD = (datos.cd && datos.cantidadCd) ? generarFilaCD(datos.cantidadCd, datos.cdVal) : '';

  return `
    <div style="overflow-x: auto; width: 100%; margin-bottom: 1rem; border-radius: 0.5rem; border: 1px solid var(--border-light);">
      <table class="tabla-cotizacion" style="min-width: 650px; margin-top: 0;">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Detalle</th>
            <th>Cantidad</th>
            <th>Precio Unit.</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${generarFilaImpresion(datos)}
          ${generarFilaEmpastado(datos)}
          ${filaLomo}
          ${filaCD}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Genera fila de impresión
 * @param {Object} datos
 * @returns {string}
 */
function generarFilaImpresion(datos) {
  return `
    <tr>
      <td><strong>Impresión</strong></td>
      <td>${datos.detalleImpresion}</td>
      <td class="center">${datos.tomos}</td>
      <td class="right">RD$${formatearMonto(datos.impresion)}</td>
      <td class="right">RD$${formatearMonto(datos.impresion * datos.tomos)}</td>

    </tr>
  `;
}

/**
 * Genera fila de empastado
 * @param {Object} datos
 * @returns {string}
 */
function generarFilaEmpastado(datos) {
  const detalle = datos.tipoEmp === 'tapa_dura'
    ? `Tapa dura (${nombreColor(datos.colorTapa)})`
    : 'Vinil';

  return `
    <tr>
      <td><strong>Empastado</strong></td>
      <td>${detalle}</td>
      <td class="center">${datos.tomos}</td>
      <td class="right">RD$${formatearMonto(datos.costoUnitario)}</td>
      <td class="right">RD$${formatearMonto(datos.empastado)}</td>

    </tr>
  `;
}

/**
 * Genera fila de lomo
 * @param {number} tomos
 * @param {number} lomoVal
 * @returns {string}
 */
function generarFilaLomo(tomos, lomoVal) {
  return `
    <tr>
      <td>Lomo</td>
      <td>Incluido</td>
      <td class="center">${tomos}</td>
      <td>RD$${formatearMonto(PRECIOS_SERVICIOS.LOMO)}</td>
      <td>RD$${formatearMonto(lomoVal)}</td>

    </tr>
  `;
}


/**
 * Genera fila de CD
 * @param {number} cantidadCd
 * @param {number} cdVal
 * @returns {string}
 */
function generarFilaCD(cantidadCd, cdVal) {
  return `
    <tr>
      <td>CD</td>
      <td>${cantidadCd} unidad(es)</td>
      <td class="center">${cantidadCd}</td>
      <td>RD$${formatearMonto(PRECIOS_SERVICIOS.CD)}</td>
      <td>RD$${formatearMonto(cdVal)}</td>

    </tr>
  `;
}

/**
 * Genera tabla de total
 * @param {number} total
 * @returns {string}
 */
function generarTablaTotal(total) {
  return `
    <table class="tabla-total">
      <tr>
        <td><strong>Total General</strong></td>
        <td class="right"><strong>RD$${formatearMonto(total)}</strong></td>
      </tr>
    </table>
  `;
}

/**
 * Genera mensaje de tiempo de entrega
 * @param {string} tipoEmp
 * @returns {string}
 */
function generarTiempoEntrega(tipoEmp) {
  const tiempo = tipoEmp === 'tapa_dura' 
    ? TIEMPO_ENTREGA.TAPA_DURA 
    : TIEMPO_ENTREGA.VINIL;
    
  return `
    <div class="tiempo-entrega">
      ⏰ Tiempo de entrega: en tapa dura ${tiempo}, si es apartir de las 12:00 PM se entrega al otro dia / ${TIEMPO_ENTREGA.VINIL} vinil.
    </div>
  `;
}

// ============================================
// 🖨️ FUNCIONES DE IMPRESIÓN Y COMPARTIR
// ============================================

/**
 * Imprime la cotización en una nueva ventana
 */
function imprimir() {
  if (!ultimaCotizacion) {
    return mostrarNotificacion('Calcule primero la cotización', 'warning');
  }

  // Guardar en Google Sheets al imprimir
  if (datosParaGuardar) enviarAGoogleSheets(datosParaGuardar);

  const ventana = window.open('', '', 'width=1000,height=700');
  const headHTML = document.head.innerHTML;

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        ${headHTML}
        <title>Cotización de Tesis - ServiGaco</title>

        <style>
          @page {
            size: A4;
            margin: 12mm;
          }
.print-page {
  width: 190mm;
  max-width: 190mm;
  margin: auto;
}

          body {
            margin: 0;
            zoom: 0.9; /* 🔥 auto-ajuste seguro */
          }

          .cotizacion {
            width: 100%;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        ${ultimaCotizacion}
      </body>
    </html>
  `);

  ventana.document.close();

  setTimeout(() => {
    ventana.print();
  }, 500);
}


/**
 * Comparte o descarga la cotización como PDF
 */
async function compartirPDFMovil() {
  if (!ultimaCotizacion) {
    mostrarNotificacion('Calcule primero la cotización', 'warning');
    return;
  }

  const wrapper = crearWrapperPDF();
  
  try {
    await esperarCargaImagenes(wrapper);
    const pdfBlob = await generarPDFBlob(wrapper);
    await compartirODescargarPDF(pdfBlob);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    mostrarNotificacion('Error al generar la cotización', 'error');
  } finally {
    document.body.removeChild(wrapper);
  }
}

/**
 * Crea el contenedor para generar el PDF
 * @returns {HTMLElement}
 */
function crearWrapperPDF() {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '210mm',
    background: '#ffffff',
    padding: '15mm',
    zIndex: '9999',
    display: 'block'
  });
  
  wrapper.innerHTML = ultimaCotizacion;
  document.body.appendChild(wrapper);
  
  return wrapper;
}

/**
 * Espera a que todas las imágenes se carguen
 * @param {HTMLElement} contenedor
 */
async function esperarCargaImagenes(contenedor) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const imagenes = contenedor.querySelectorAll('img');
  await Promise.all(
    [...imagenes].map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise(resolve => {
            img.onload = img.onerror = resolve;
          })
    )
  );
}

/**
 * Genera el blob del PDF
 * @param {HTMLElement} elemento
 * @returns {Promise<Blob>}
 */
async function generarPDFBlob(elemento) {
  return await html2pdf()
    .set({
      margin: 15,
      filename: nombreArchivoPDF(
      datosGlobales.idCotizacion,
    datosGlobales.colorTapa
      ),
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,                 // calidad alta
        backgroundColor: '#ffffff',
        useCORS: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',             // estándar
        orientation: 'portrait',
        compress: true
      }
    })
    .from(elemento)
    .outputPdf('blob');
}



/**
 * Comparte o descarga el PDF según capacidades del navegador
 * @param {Blob} pdfBlob
 */
async function compartirODescargarPDF(pdfBlob) {
  const archivo = new File([pdfBlob], 'cotizacion_tesis.pdf', {
    type: 'application/pdf'
  });

  // Intentar compartir si está disponible
  if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
    try {
      await navigator.share({
        title: 'Cotización de Tesis',
        text: 'Adjunto cotización en PDF',
        files: [archivo]
      });
      return;
    } catch (error) {
      // Si el usuario cancela, continuar con descarga
      if (error.name !== 'AbortError') {
        console.error('Error al compartir:', error);
      }
    }
  }

  // Descargar si no se puede compartir
  descargarPDF(pdfBlob);
}

document.getElementById("btnDescargarPdf").addEventListener("click", descargarPDF);

async function descargarPDF() {
  if (!ultimaCotizacion) {
    mostrarNotificacion("Primero genera la cotización", 'warning');
    return;
  }

  // Guardar en Google Sheets al descargar
  if (datosParaGuardar) enviarAGoogleSheets(datosParaGuardar);

  const wrapper = document.createElement("div");
  wrapper.style.width = "210mm";
  wrapper.style.background = "#fff";
  wrapper.innerHTML = ultimaCotizacion;
  document.body.appendChild(wrapper);

  const nombre = nombreArchivoPDF(
    datosGlobales.idCotizacion,
    datosGlobales.colorTapa
  );

  await html2pdf()
    .set({
      margin: 10,
      filename: nombre,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    })
    .from(wrapper)
    .save();

  document.body.removeChild(wrapper);
}


// ============================================
// 🔄 FUNCIÓN DE REINICIO
// ============================================

/**
 * Reinicia el formulario a valores por defecto
 */
function reiniciar() {
  // Limpiar campos numéricos
  const camposLimpiar = ['bn', 'color', 'paginas', 'cantidadCd'];
  camposLimpiar.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) campo.value = '';
  });

  // Restablecer tomos a 1
  const tomos = document.getElementById('tomos');
  if (tomos) tomos.value = 1;

  // Restablecer selectores
  elementos.tamano.value = 'carta';
  elementos.papel.value = 'bond';
  elementos.tipoEmpastado.value = 'tapa_dura';
  
  const colorTapa = document.getElementById('colorTapa');
  if (colorTapa) colorTapa.value = 'beige';
  
  const lomo = document.getElementById('lomo');
  if (lomo) lomo.value = 'no';
  
  elementos.llevaCd.value = 'no';

  // Ocultar secciones
  elementos.cdSection.style.display = 'none';
  elementos.alertaTabloide.style.display = 'none';

  // Limpiar resultado
  elementos.resultado.innerHTML = '';
  ultimaCotizacion = '';

  // Actualizar vista
  actualizarVista();
  
  guardarTesisLocalStorage();
  mostrarNotificacion('Formulario reiniciado', 'success');
}

// ============================================
// 🎬 INICIALIZACIÓN Y EVENTOS
// ============================================

/**
 * Inicializa la aplicación
 */
function inicializar() {
  // Establecer valor por defecto
  elementos.tipoEmpastado.value = 'tapa_dura';
  
  // Cargar datos guardados (si existen)
  cargarTesisLocalStorage();
  
  // Configurar eventos principales
  [elementos.tamano, elementos.papel, elementos.tipoEmpastado].forEach(el => {
    el.addEventListener('change', actualizarVista);
  });

  // Evento para CD
  elementos.llevaCd.addEventListener('change', toggleSeccionCD);

  // Eventos de botones
  elementos.btnCalcular.addEventListener('click', calcular);
  elementos.btnGenerar.addEventListener('click', imprimir);
  elementos.btnCompartir.addEventListener('click', compartirPDFMovil);
  elementos.btnReiniciar.addEventListener('click', reiniciar);

  // Evento tabla de precios (opcional)
  if (elementos.btnMostrarTabla) {
    elementos.btnMostrarTabla.addEventListener('click', toggleTablaPrecios);
  }

  // Listeners para persistencia en todos los inputs
  const inputs = document.querySelectorAll('input, select');
  inputs.forEach(el => {
    el.addEventListener('change', guardarTesisLocalStorage);
    el.addEventListener('input', guardarTesisLocalStorage);
  });

  // Actualizar vista inicial
  actualizarVista();
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}

// ============================================
// 💾 PERSISTENCIA (LOCALSTORAGE)
// ============================================

// Obtener objeto con todos los datos actuales del formulario
function obtenerDatosFormulario() {
  return {
    tamano: document.getElementById('tamano')?.value,
    papel: document.getElementById('papel')?.value,
    bn: document.getElementById('bn')?.value,
    color: document.getElementById('color')?.value,
    paginas: document.getElementById('paginas')?.value,
    tomos: document.getElementById('tomos')?.value,
    tipoEmpastado: document.getElementById('tipoEmpastado')?.value,
    colorTapa: document.getElementById('colorTapa')?.value,
    lomo: document.getElementById('lomo')?.value,
    llevaCd: document.getElementById('llevaCd')?.value,
    cantidadCd: document.getElementById('cantidadCd')?.value
  };
}

// Guardar estado actual (auto-save)
function guardarTesisLocalStorage() {
  const datos = obtenerDatosFormulario();
  localStorage.setItem('cotizacion_tesis_datos', JSON.stringify(datos));
}

// Cargar estado actual (auto-load)
function cargarTesisLocalStorage() {
  const guardado = localStorage.getItem('cotizacion_tesis_datos');
  if (guardado) {
    try {
      const datos = JSON.parse(guardado);
      aplicarDatosAlFormulario(datos);
    } catch (e) {
      console.error('Error cargando datos de tesis', e);
    }
  }
}

function aplicarDatosAlFormulario(datos) {
  if (datos.tamano) document.getElementById('tamano').value = datos.tamano;
  if (datos.papel) document.getElementById('papel').value = datos.papel;
  if (datos.bn) document.getElementById('bn').value = datos.bn;
  if (datos.color) document.getElementById('color').value = datos.color;
  if (datos.paginas) document.getElementById('paginas').value = datos.paginas;
  if (datos.tomos) document.getElementById('tomos').value = datos.tomos;
  if (datos.tipoEmpastado) document.getElementById('tipoEmpastado').value = datos.tipoEmpastado;
  if (datos.colorTapa) document.getElementById('colorTapa').value = datos.colorTapa;
  if (datos.lomo) document.getElementById('lomo').value = datos.lomo;
  if (datos.llevaCd) document.getElementById('llevaCd').value = datos.llevaCd;
  if (datos.cantidadCd) document.getElementById('cantidadCd').value = datos.cantidadCd;

  actualizarVista();
  toggleSeccionCD();
}

// ============================================
// 🔔 NOTIFICACIONES TOAST
// ============================================

function mostrarNotificacion(mensaje, tipo = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const iconos = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `
    <span class="toast-icon">${iconos[tipo]}</span>
    <span class="toast-message">${mensaje}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastFadeOut 0.4s forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ============================================
// ☁️ GOOGLE SHEETS API
// ============================================

function enviarAGoogleSheets(datos) {
  if (GOOGLE_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbxHk5dI_qZeec9tlrl8mo4ubRre0mNrLrST-4Z-7pyqOhcnbupE201lJhORig4TAgrWbw/exec_AQUI' || !GOOGLE_SCRIPT_URL) {
    console.warn('⚠️ Falta configurar la URL de Google Sheets en el script.');
    return;
  }

  // Aseguramos que la acción sea 'guardar'
  const payload = { action: 'guardar', ...datos };

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(payload)
  }).then(() => console.log('✅ Pedido guardado en Sheets'))
    .catch(err => console.error('❌ Error guardando en Sheets:', err));
}
