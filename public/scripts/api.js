export async function fetchGameData() {
    const response = await fetch("https://assignment-2-remygist-1.onrender.com/fetchData");
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
}