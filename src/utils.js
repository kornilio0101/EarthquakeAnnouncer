export const CONTINENTS = {
    WORLDWIDE: { name: 'Worldwide', bounds: null },
    NORTH_AMERICA: { name: 'North America', bounds: [10, 85, -170, -50] }, // [minlat, maxlat, minlon, maxlon]
    SOUTH_AMERICA: { name: 'South America', bounds: [-60, 15, -90, -30] },
    EUROPE: { name: 'Europe', bounds: [35, 75, -25, 45] },
    ASIA: { name: 'Asia', bounds: [0, 80, 25, 180] },
    AFRICA: { name: 'Africa', bounds: [-40, 40, -20, 55] },
    OCEANIA: { name: 'Australia/Oceania', bounds: [-50, 0, 110, 180] }
};

export const US_STATES = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", AS: "American Samoa",
    CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
    FL: "Florida", GA: "Georgia", GU: "Guam", HI: "Hawaii", ID: "Idaho",
    IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky",
    LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan",
    MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska",
    NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
    NC: "North Carolina", ND: "North Dakota", MP: "Northern Mariana Islands", OH: "Ohio", OK: "Oklahoma",
    OR: "Oregon", PA: "Pennsylvania", PR: "Puerto Rico", RI: "Rhode Island", SC: "South Carolina",
    SD: "South Dakota", TN: "Tennessee", TX: "Texas", TT: "Trust Territories", UT: "Utah",
    VT: "Vermont", VA: "Virginia", VI: "Virgin Islands", WA: "Washington", WV: "West Virginia",
    WI: "Wisconsin", WY: "Wyoming"
};

export const SOURCES = {
    USGS: { name: 'USGS', url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', type: 'geojson' },
    EMSC: { name: 'EMSC', url: 'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=100', type: 'geojson' },
    IRIS: { name: 'IRIS', url: 'https://service.iris.edu/fdsnws/event/1/query?format=geojson&limit=100', type: 'geojson' },
    GFZ: { name: 'GFZ', url: 'https://geofon.gfz-potsdam.de/fdsnws/event/1/query?format=geojson&limit=50', type: 'geojson' },
    INGV: { name: 'INGV', url: 'https://webservices.ingv.it/fdsnws/event/1/query?format=geojson&limit=50', type: 'geojson' },
    GeoNet: { name: 'GeoNet', url: 'https://service.geonet.org.nz/fdsnws/event/1/query?format=geojson&limit=50', type: 'geojson' },
    GA: { name: 'GA', url: 'https://earthquakes.ga.gov.au/fdsnws/event/1/query?format=geojson&limit=50', type: 'geojson' },
    NRCan: { name: 'NRCan', url: 'https://earthquakescanada.nrcan.gc.ca/fdsnws/event/1/query?format=geojson&limit=50', type: 'geojson' },
    JMA: { name: 'JMA', url: 'https://www.jma.go.jp/bosai/quake/data/list.json', type: 'jma' }
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const isWithinBounds = (lat, lon, bounds) => {
    if (!bounds) return true;
    const [minLat, maxLat, minLon, maxLon] = bounds;
    return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
};

export const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(new Date(timestamp));
};

export const getMagnitudeColorClass = (mag) => {
    if (mag >= 6) return 'mag-high';
    if (mag >= 4) return 'mag-mid';
    return '';
};
