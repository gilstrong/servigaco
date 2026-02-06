export async function handler(event) {
  try {
    // URL de tu Google Apps Script (WEB APP)
    const GOOGLE_SCRIPT_URL =
      'https://script.google.com/macros/s/AKfycbxRUMlkInT_O_C6G_q15jb8mVqVcX9SOLwu9Tl9_ucgwsu1C-ZfoIJIqrCcROo5WwSJbQ/exec';

    // Detectar acción desde query (?action=listar)
    const action = event.queryStringParameters?.action || 'listar';

    // Construir URL final
    const url = `${GOOGLE_SCRIPT_URL}?action=${action}`;

    // Llamar a Google Apps Script
    const response = await fetch(url, {
      method: 'GET'
    });

    // Google devuelve JSON
    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Error en Netlify Function',
        message: error.message
      })
    };
  }
}
