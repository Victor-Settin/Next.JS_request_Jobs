import { useState, useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { API_URL, API_DATA, CAROUSEL_RESPONSIVE } from "./configCarousel";

export default function CarouselComponent() {
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filterByCompany, setFilterByCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(API_DATA),
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
            setIsLoading(false); // Define isLoading como false quando o carregamento estiver completo
        }

        fetchData();
    }, []);

    const filterByCompanyHandler = (company) => {
        setFilterByCompany(company);
    };

    const filteredJobs = jobs.filter((job) => {
        if (filterByCompany) {
            return job.companyName === filterByCompany;
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
        <div>
            {isLoading ? ( // Verifica se isLoading é verdadeiro ou falso antes de renderizar o componente
                <p className="loading">Loading...</p>
            ) : (
                <div className="container">
                    <div className="filters">
                        <select
                            onChange={(event) =>
                                filterByCompanyHandler(event.target.value)
                            }
                        >
                            <option value="">Filter companies</option>
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
                        responsive={CAROUSEL_RESPONSIVE}
                        controlsStrategy="alternate"
                    />
                </div>
            )}
        </div>
    );
}
