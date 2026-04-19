// SERVER ONLY
import {
    readFile
} from 'node:fs/promises';

import {
    safeParse
} from 'js/utils/jsonUtils.js';

const basedir = process.cwd();

function isStarVisible(star, observer) {
    const {
        ra,
        dec
    } = star; // ra in decimal hours, dec in decimal degrees
    const {
        lat,
        lon,
        date
    } = observer;

    // 1. Get Julian Days since J2000 (approximate)
    const d = (date.getTime() / 86400000) - 10957.5;

    // 2. Calculate Local Sidereal Time (Degrees)
    const UT = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    let lst = 100.46 + 0.985647 * d + lon + 15 * UT;
    lst = lst % 360;
    if (lst < 0) lst += 360;

    // 3. Calculate Hour Angle (Degrees)
    let ha = lst - (ra * 15);
    if (ha < 0) ha += 360;

    // 4. Calculate Altitude
    const latRad = lat * Math.PI / 180;
    const decRad = dec * Math.PI / 180;
    const haRad = ha * Math.PI / 180;

    const sinAlt = Math.sin(latRad) * Math.sin(decRad) +
        Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);

    const alt = Math.asin(sinAlt) * 180 / Math.PI;

    return alt > 0; // Filter: returns true if above horizon
}

function filterCatalog(starCatalog, latitude, longitude) {

    const now = new Date();

    const visibleStars = starCatalog.filter(star => isStarVisible(star, {
        lat: latitude,
        lon: longitude,
        date:
    }));

}

export default async function getListOfVisibleStars(latitude, longitude) {

    const results = await readFile(`${basedir}/data/starlist.json`);
    const starList = safeParse(results);
    if (startList) {
        return filterCatalog(starList, latitude, longitude);
    }
    return throw new Error('Error parsing catalog data');
}
