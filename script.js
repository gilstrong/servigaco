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

const BLOQUE_CUENTAS = `
  <div class="cuentas-pago">
    <img src="bhd.jpg" alt="Cuenta BHD" class="img-cuenta">
    <img src="popular.jpg" alt="Cuenta Popular" class="img-cuenta">
    <img src="banreservas.jpg" alt="Cuenta Banreservas" class="img-cuenta">
  </div>
`;


function nombreColor(color) {
  return color.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ELEMENTOS
const tamanoEl = document.getElementById('tamano');
const papelEl = document.getElementById('papel');
const tipoEmpEl = document.getElementById('tipoEmpastado');
const alerta = document.getElementById('alertaTabloide');

const bnColorSection = document.getElementById('bnColorSection');
const soloPaginas = document.getElementById('soloPaginas');
const colorTapaSection = document.getElementById('colorTapaSection');

const llevaCd = document.getElementById('llevaCd');
const cdSection = document.getElementById('cdSection');

const resultadoEl = document.getElementById('resultado');

const btnCalcular = document.getElementById('btnCalcular');
const btnGenerar = document.getElementById('btnGenerar');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnMostrarTabla = document.getElementById('btnMostrarTabla');
const tablaPrecios = document.getElementById('tablaPrecios');

let ultimaCotizacion = '';

// EVENTOS
[tamanoEl, papelEl, tipoEmpEl].forEach(el =>
  el.addEventListener('change', actualizarVista)
);

llevaCd.addEventListener('change', () => {
  cdSection.style.display = llevaCd.value === 'si' ? 'block' : 'none';
});

btnCalcular.addEventListener('click', calcular);
btnGenerar.addEventListener('click', imprimir);
btnReiniciar.addEventListener('click', reiniciar);

if (btnMostrarTabla) {
  btnMostrarTabla.addEventListener('click', () =>
    tablaPrecios.classList.toggle('mostrar')
  );
}

// VISTA
function actualizarVista() {
  const tamano = tamanoEl.value;

  if (tamano === 'tabloide') {
    alerta.style.display = 'block';

    // Forzar papel
    papelEl.value = 'satinado';
    papelEl.disabled = true;

    // Forzar empastado
    tipoEmpEl.value = 'vinil';
    tipoEmpEl.disabled = true;

  } else {
    alerta.style.display = 'none';

    papelEl.disabled = false;
    tipoEmpEl.disabled = false;
  }

  const esSatinado = papelEl.value === 'satinado';

  bnColorSection.style.display = esSatinado ? 'none' : 'block';
  soloPaginas.style.display = esSatinado ? 'block' : 'none';

  // 🔥 ESTA ES LA CLAVE DEL COLOR
  colorTapaSection.style.display =
    tipoEmpEl.value === 'tapa_dura' && tamano === 'carta'
      ? 'block'
      : 'none';
}


// CALCULAR
function calcular() {
  const tomos = Math.max(1, parseInt(document.getElementById('tomos').value) || 1);
  let impresion = 0;
  let detalleImpresion = '';

  if (papelEl.value === 'satinado') {
    const paginas = parseInt(document.getElementById('paginas').value) || 0;
    if (!paginas) return alert('Debe ingresar la cantidad de páginas');

    const precio = PRECIOS[tamanoEl.value].satinado.precio;
    impresion = paginas * precio;
    detalleImpresion = `${paginas} páginas x RD$${precio}`;
  } else {
    const bn = parseInt(document.getElementById('bn').value) || 0;
    const color = parseInt(document.getElementById('color').value) || 0;
    if (bn + color === 0) return alert('Debe ingresar páginas');

    const precios = PRECIOS[tamanoEl.value][papelEl.value];
    impresion = bn * precios.bn + color * precios.color;
    detalleImpresion = `${bn} B/N + ${color} Color`;
  }

  const tipoEmp = tipoEmpEl.value;
  const colorTapa = tipoEmp === 'tapa_dura'
    ? document.getElementById('colorTapa').value
    : '';

  const empastado = tipoEmp === 'vinil'
    ? VINIL[tamanoEl.value] * tomos
    : TAPA_DURA[colorTapa] * tomos;

  const lomo = document.getElementById('lomo').value === 'si';
  const lomoVal = lomo ? 50 * tomos : 0;

  const cd = llevaCd.value === 'si';
  const cantidadCd = cd ? parseInt(document.getElementById('cantidadCd').value) || 0 : 0;
  const cdVal = cantidadCd * 200;

  const total = impresion * tomos + empastado + lomoVal + cdVal;

  let filaLomo = lomo ? `
    <tr>
      <td>Lomo</td>
      <td>Incluido</td>
      <td>${tomos}</td>
      <td>RD$50</td>
      <td>RD$${lomoVal}</td>
    </tr>` : '';

  let filaCD = cd && cantidadCd ? `
    <tr>
      <td>CD</td>
      <td>${cantidadCd} unidad(es)</td>
      <td>${cantidadCd}</td>
      <td>RD$200</td>
      <td>RD$${cdVal}</td>
    </tr>` : '';

    ultimaCotizacion = `
    <div class="cotizacion">
    
      <!-- ENCABEZADO -->
      <div class="cotizacion-header">
        <img src="logo.png" class="logo">
        <div class="empresa-info">
          <h1>Cotización de Tesis</h1>
          <p>ServiGaco<br>Tel: 809-682-1075</p>
        </div>
      </div>
    
      <!-- TABLA DE CONCEPTOS -->
      <table class="tabla-cotizacion">
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
    
          <tr>
            <td><strong>Impresión</strong></td>
            <td>${detalleImpresion}</td>
            <td class="center">${tomos}</td>
            <td class="right">RD$${impresion}</td>
            <td class="right">RD$${impresion * tomos}</td>
          </tr>
    
          <tr>
            <td><strong>Empastado</strong></td>
            <td>
              ${tipoEmp === 'tapa_dura'
                ? `Tapa dura (${nombreColor(colorTapa)})`
                : 'Vinil'}
            </td>
            <td class="center">${tomos}</td>
            <td class="right">
              RD$${tipoEmp === 'vinil'
                ? VINIL[tamanoEl.value]
                : TAPA_DURA[colorTapa]}
            </td>
            <td class="right">RD$${empastado}</td>
          </tr>
    
          ${filaLomo || ''}
          ${filaCD || ''}
    
        </tbody>
      </table>
    
      <!-- TABLA TOTAL -->
      <table class="tabla-total">
        <tr>
          <td><strong>Total General</strong></td>
          <td class="right"><strong>RD$${total}</strong></td>
          
        </tr>
      </table>

      ${BLOQUE_CUENTAS}
      
          <div class="tiempo-entrega">
        ⏰ Tiempo de entrega: <span id="tiempoEntrega">6 horas para tapa dura, si es después de las 12 se entrega al día siguiente; 24 horas para vinil.</span>
      </div>
    </div>
    `;
    

  resultadoEl.innerHTML = ultimaCotizacion;
}

// IMPRIMIR
function imprimir() {
  if (!ultimaCotizacion) return alert('Calcule primero la cotización');

  // Copiamos TODO el <head> (links + estilos)
  const headHTML = document.head.innerHTML;

  const w = window.open('', '', 'width=1000,height=700');
  w.document.open();
  w.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        ${headHTML}
      </head>
      <body>
        ${ultimaCotizacion}
      </body>
    </html>
  `);
  w.document.close();

  // Espera mínima para que carguen los estilos
  setTimeout(() => {
    w.focus();
    w.print();
  }, 500);
}



tipoEmpEl.value = 'tapa_dura';
actualizarVista();


function reiniciar() {
  // Limpia inputs
  document.querySelector('form')?.reset();

  // Oculta secciones dinámicas
  cdSection.style.display = 'none';
  bnColorSection.style.display = 'block';
  soloPaginas.style.display = 'none';
  colorTapaSection.style.display = 'block';

  // Limpia resultado
  resultadoEl.innerHTML = '';
  ultimaCotizacion = '';

  // Restablece selects
  papelEl.disabled = false;
  tipoEmpEl.disabled = false;

  actualizarVista();
}

