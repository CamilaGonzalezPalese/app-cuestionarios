export async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    //console.log("Datos recibidos:", data); // <-- aquí
    return data;
}