const PRECIOS = {
  carta: { bond: { bn: 6, color: 12 }, hilo: { bn: 8, color: 15 }, satinado: { precio: 25 } },
  tabloide: { satinado: { precio: 45 } }
};

const TAPA_DURA = { beige:600, morado:550, azul_marino:500, azul_cielo:500, rojo:500, verde_botella:500, amarillo_medicina:500 };
const VINIL = { carta:1200, tabloide:1500 };

// Función para mostrar colores bonitos sin "_"
function nombreColor(color) {
  return color.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

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

[tamanoEl, papelEl, tipoEmpEl].forEach(e => e.addEventListener('change', actualizarVista));
llevaCd.addEventListener('change', () => cdSection.style.display = llevaCd.value==='si'?'block':'none');
btnMostrarTabla.addEventListener('click', () => tablaPrecios.classList.toggle('mostrar'));
btnCalcular.addEventListener('click', calcular);
btnGenerar.addEventListener('click', imprimir);
btnReiniciar.addEventListener('click', reiniciar);

function actualizarVista() {
  const tamano = tamanoEl.value;

  if (tamano === 'tabloide') {
    alerta.style.display = 'block';
    papelEl.value = 'satinado';
    papelEl.disabled = true;

    tipoEmpEl.innerHTML = '<option value="vinil">Vinil</option>';
    tipoEmpEl.value = 'vinil';
    tipoEmpEl.disabled = true;
  } else {
    alerta.style.display = 'none';
    papelEl.disabled = false;
    tipoEmpEl.disabled = false;

    if (!tipoEmpEl.querySelector('option[value="tapa_dura"]')) {
      tipoEmpEl.innerHTML = '<option value="tapa_dura">Tapa dura</option><option value="vinil">Vinil</option>';
      tipoEmpEl.value = 'tapa_dura';
    }
  }

  const esSatinado = papelEl.value === 'satinado';
  bnColorSection.style.display = esSatinado ? 'none' : 'block';
  soloPaginas.style.display = esSatinado ? 'block' : 'none';
  colorTapaSection.style.display = (tipoEmpEl.value === 'tapa_dura' && tamano === 'carta') ? 'block' : 'none';
}

function calcular() {
  const tomos = Math.max(1, parseInt(document.getElementById('tomos').value)||1);
  let impresion = 0;
  let detalleImpresion = '';

  if(papelEl.value==='satinado'){
    const pags = parseInt(document.getElementById('paginas').value);
    if(!pags){ alert('Debe ingresar la cantidad de páginas'); return; }
    impresion = pags * PRECIOS[tamanoEl.value][papelEl.value].precio;
    detalleImpresion = `${pags} páginas x RD$${PRECIOS[tamanoEl.value][papelEl.value].precio}`;
  } else {
    const bn = Math.max(0, parseInt(document.getElementById('bn').value)||0);
    const col = Math.max(0, parseInt(document.getElementById('color').value)||0);
    if(bn+col===0){ alert('Debe ingresar páginas'); return; }
    const precioBn = bn*PRECIOS[tamanoEl.value][papelEl.value].bn;
    const precioCol = col*PRECIOS[tamanoEl.value][papelEl.value].color;
    impresion = precioBn + precioCol;
    detalleImpresion = `${bn} B/N x RD$${PRECIOS[tamanoEl.value][papelEl.value].bn} + ${col} Color x RD$${PRECIOS[tamanoEl.value][papelEl.value].color}`;
  }

  const tipoEmp = tipoEmpEl.value;
  const colorTapaRaw = tipoEmp==='tapa_dura' ? document.getElementById('colorTapa').value : '-';
  const colorTapa = nombreColor(colorTapaRaw);
  let emp = tipoEmp==='vinil' ? VINIL[tamanoEl.value]*tomos : TAPA_DURA[colorTapaRaw]*tomos;

  const lomoVal = document.getElementById('lomo').value==='si'?200*tomos:0;
  const cdsVal = llevaCd.value==='si'?(parseInt(document.getElementById('cantidadCd').value)||0)*200:0;

  const total = impresion*tomos + emp + lomoVal + cdsVal;

  ultimaCotizacion = `
    <div class="cotizacion">
      <div class="cotizacion-header">
        <img src="logo.png" alt="Logo Empresa">
        <div class="empresa-info">
          <h1>Cotización de Tesis</h1>
          <p>Nombre de la Empresa<br>Dirección: Av. Ejemplo #123, Ciudad<br>Tel: 809-000-0000</p>
        </div>
      </div>
      <div class="cotizacion-body">
        <table class="tabla-cotizacion">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Detalle</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Impresión</td>
              <td>${detalleImpresion}</td>
              <td>${tomos}</td>
              <td>RD$${impresion}</td>
              <td>RD$${impresion*tomos}</td>
            </tr>
            <tr>
              <td>Empastado</td>
              <td>${tipoEmp==='tapa_dura'?'Tapa dura':'Vinil'} (${colorTapa})</td>
              <td>${tomos}</td>
              <td>RD$${tipoEmp==='vinil'?VINIL[tamanoEl.value]:TAPA_DURA[colorTapaRaw]}</td>
              <td>RD$${emp}</td>
            </tr>
            <tr>
              <td>Lomo</td>
              <td>${document.getElementById('lomo').value==='si'?'Sí':'No'}</td>
              <td>${tomos}</td>
              <td>RD$${document.getElementById('lomo').value==='si'?200:0}</td>
              <td>RD$${lomoVal}</td>
            </tr>
            <tr>
              <td>CD</td>
              <td>${llevaCd.value==='si'?document.getElementById('cantidadCd').value+' unidad(es)':'No'}</td>
              <td>1</td>
              <td>RD$200</td>
              <td>RD$${cdsVal}</td>
            </tr>
            <tr>
              <td colspan="4"><strong>Total</strong></td>
              <td><strong>RD$${total}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  resultadoEl.innerHTML = ultimaCotizacion;
}

function imprimir(){
  if(!ultimaCotizacion){ alert('Primero calcule la cotización'); return; }
  const ventana = window.open('', 'Imprimir Cotización', 'width=1000,height=700');
  ventana.document.write(`
    <html>
      <head>
        <title>Cotización de Tesis</title>
        <style>
          body { font-family: Arial, sans-serif; padding:20px; }
          .cotizacion { max-width:900px; margin:auto; padding:20px; border:2px solid #2563eb; border-radius:12px; }
          .cotizacion-header { display:flex; align-items:center; gap:20px; border-bottom:2px solid #2563eb; padding-bottom:10px; margin-bottom:20px; }
          .cotizacion-header img { max-height:80px; object-fit:contain; }
          .empresa-info h1 { margin:0; font-size:22px; color:#2563eb; }
          .empresa-info p { margin:4px 0 0 0; font-size:14px; }
          .cotizacion-body { font-size:16px; line-height:1.6; }
          .tabla-cotizacion { width:100%; border-collapse: collapse; margin-top:10px; }
          .tabla-cotizacion th, .tabla-cotizacion td { border:1px solid #2563eb; padding:8px; text-align:center; }
          .tabla-cotizacion th { background:#2563eb; color:#fff; }
          .tabla-cotizacion tr:nth-child(even) { background:#f3f4f6; }
          .tabla-cotizacion strong { color:#111827; }
        </style>
      </head>
      <body>
        ${ultimaCotizacion}
      </body>
    </html>
  `);
  ventana.document.close();
  ventana.print();
}

function reiniciar(){
  document.querySelectorAll('input').forEach(i=>i.value='');
  document.querySelectorAll('select').forEach(s=>s.selectedIndex=0);
  resultadoEl.innerHTML='';
  actualizarVista();
}

actualizarVista();
