document.getElementById('submitBtn').addEventListener('click', async function () {
    const jsonInput = document.getElementById('jsonInput').value;
    const errorElement = document.getElementById('error');
    const dropdownContainer = document.getElementById('dropdownContainer');
    const responseContainer = document.getElementById('responseContainer');
    
    // Clear previous results
    errorElement.textContent = '';
    dropdownContainer.style.display = 'none';
    responseContainer.style.display = 'none';
    
    const baseURL = window.location.origin;

    // Function to replace curly quotes with straight quotes
    function fixQuotes(input) {
        return input
            .replace(/‘|’/g, "'") // Replace curly single quotes
            .replace(/“|”/g, '"'); // Replace curly double quotes
    }

    let jsonData;
    try {
        const fixedInput = fixQuotes(jsonInput);
        jsonData = JSON.parse(fixedInput);
    } catch (e) {
        errorElement.textContent = 'Invalid JSON format!';
        return;
    }

    if (!jsonData.data || !Array.isArray(jsonData.data)) {
        errorElement.textContent = 'JSON must have a "data" array!';
        return;
    }
    try {
        const response = await fetch(`${baseURL}/bfhl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });
        

        const result = await response.json();
        window.apiResponse = result;

        if (result.is_success) {
            dropdownContainer.style.display = 'block';
            responseContainer.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
            responseContainer.style.display = 'block';
        } else {
            errorElement.textContent = result.message || 'An error occurred!';
        }
    } catch (e) {
        errorElement.textContent = 'Error connecting to the server!';
    }
});

document.getElementById('filterBtn').addEventListener('click', function () {
    const selectedOptions = Array.from(document.getElementById('options').selectedOptions).map(option => option.value);
    const filteredResponse = {};

    selectedOptions.forEach(option => {
        if (window.apiResponse[option] !== undefined) {
            filteredResponse[option] = window.apiResponse[option];
        }
    });

    document.getElementById('responseContainer').innerHTML = `<pre>${JSON.stringify(filteredResponse, null, 2)}</pre>`;
});
