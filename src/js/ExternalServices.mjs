// src/js/ExternalServices.mjs

// ... (other code)

async function convertToJson(res) {
  // Parse the response body as JSON. This will work even for error responses.
  const jsonResponse = await res.json();

  // Check if the response was successful.
  if (res.ok) {
    // If successful, return the parsed JSON data.
    return jsonResponse;
  } else {
    // If not successful, throw a custom error object with the server's message.
    // The server might send the main message in `jsonResponse.message` or have a specific structure.
    throw { name: "servicesError", message: jsonResponse };
  }
}

// ... (rest of the file)