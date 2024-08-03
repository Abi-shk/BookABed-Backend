const axios = require('axios'); // Import the axios library for making HTTP requests

const clientId = 'xfP5absRlbBi1oQRWWQd48uvdeXoaiwE'; // Your Amadeus API client ID
const clientSecret = 'bOAO6f3xru5o4HW6'; // Your Amadeus API client secret

const getAccessToken = async () => {
    // Function to get an access token from the Amadeus API
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token'; // Amadeus API endpoint for obtaining an access token

    const params = new URLSearchParams(); // Create a URLSearchParams object to hold the request parameters
    params.append('grant_type', 'client_credentials'); // Add the grant_type parameter with the value 'client_credentials'
    params.append('client_id', clientId); // Add the client_id parameter with the value of your client ID
    params.append('client_secret', clientSecret); // Add the client_secret parameter with the value of your client secret

    try {
        // Try to make a POST request to the Amadeus API to get the access token
        const response = await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Set the Content-Type header to 'application/x-www-form-urlencoded'
            },
        });
        return response.data.access_token; // If successful, return the access token from the response data
    } catch (error) {
        // If there's an error, log it and return null
        console.error('Error fetching access token:', error);
        return null;
    }
};

module.exports = { getAccessToken }; // Export the getAccessToken function for use in other parts of the application
