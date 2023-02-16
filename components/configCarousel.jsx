const API_URL = "https://www.zippia.com/api/jobs/";
const API_DATA = {
    companySkills: true,
    dismissedListingHashes: [],
    fetchJobDesc: true,
    locations: [],
    numJobs: 10,
};
const CAROUSEL_RESPONSIVE = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
};

export { API_URL, API_DATA, CAROUSEL_RESPONSIVE };
