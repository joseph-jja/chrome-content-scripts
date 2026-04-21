export default async function getStarView(apiEndpoint, authToken, latitude, longitude, ra, dec) {

    if (!authToken) {
        return Promise.reject('No configuration found for astronomy api');
    }

    if (!ra || !dec || !latitude || !longitude) {
        return Promise.reject('No right ascension or declination or missing latitude or longitude!');
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    const yyyymmdd = `${year}-${month}-${day}`;
    const payload = {
        "style": "navy",
        "observer": {
            "latitude": parseFloat(latitude),
            "longitude": parseFloat(longitude),
            "date": yyyymmdd
        },
        "view": {
            "type": "area",
            "parameters": {
                "position": {
                    "equatorial": {
                        "rightAscension": parseFloat(ra),
                        "declination": parseFloat(dec)
                    }
                },
                "zoom": 1
            }
        }
    };

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${authToken}`
        },
        body: safeStringify(payload)
    };

    return fetch(`${apiEndpoint}/api/v2/studio/star-chart`, options);
}
