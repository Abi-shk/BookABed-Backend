const axios = require('axios')

const clientId = 'xfP5absRlbBi1oQRWWQd48uvdeXoaiwE';
const clientSecret = 'bOAO6f3xru5o4HW6';

const getAccessToken = async () => {
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    try {
        const response = await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
};

module.exports = { getAccessToken };