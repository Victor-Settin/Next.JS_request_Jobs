"use client";
import { useState, useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
};

export default function CarouselComponent() {
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filterByCompany, setFilterByCompany] = useState(null);
    const [filterByDate, setFilterByDate] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const url = "https://www.zippia.com/api/jobs/";
            const data = {
                companySkills: true,
                dismissedListingHashes: [],
                fetchJobDesc: true,
                locations: [],
                numJobs: 10,
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const json = await response.json();
            const jobs = json.jobs.slice(0, 10).map((job) => ({
                jobTitle: job.jobTitle,
                companyName: job.companyName,
                jobdesc: job.jobDescription,
            }));

            setJobs(jobs);

            const uniqueCompanies = Array.from(
                new Set(jobs.map((job) => job.companyName))
            );
            setCompanies(uniqueCompanies);
        }

        fetchData();
    }, []);

    const filterByCompanyHandler = (company) => {
        setFilterByCompany(company);
        setFilterByDate(null);
    };

    const filteredJobs = jobs.filter((job) => {
        if (filterByCompany) {
            return job.companyName === filterByCompany;
        }
        if (filterByDate) {
            const jobDate = new Date(job.postedDate);
            return jobDate >= filterByDate;
        }
        return true;
    });

    const filteredItems = filteredJobs.map((job, index) => (
        <div key={index} className="job_card">
            <p className="job_title">{job.jobTitle}</p>
            <p className="job_name">
                <span>Company: </span>
                {job.companyName}
            </p>
            <div
                className="job_desc"
                dangerouslySetInnerHTML={{ __html: job.jobdesc }}
            />
        </div>
    ));

    return (
        <div className="container">
            <div className="filters">
                <select
                    onChange={(event) =>
                        filterByCompanyHandler(event.target.value)
                    }
                >
                    <option value="">Filter companys</option>
                    {companies.map((company) => (
                        <option key={company} value={company}>
                            {company}
                        </option>
                    ))}
                </select>
            </div>
            <AliceCarousel
                infinite={false}
                disableButtonsControls
                mouseTracking
                items={filteredItems}
                keyboardNavigation
                responsive={responsive}
                controlsStrategy="alternate"
            />
        </div>
    );
}
