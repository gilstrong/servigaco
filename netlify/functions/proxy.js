export async function handler(event, context) {
  const targetUrl = "https://script.google.com/macros/s/AKfycbx.../exec?action=listar";

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",   // Permite que cualquier frontend lo consuma
        "Content-Type": "application/json"
      },
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error en el proxy", details: err.message })
    };
  }
}
