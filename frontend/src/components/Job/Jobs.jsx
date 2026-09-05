import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { apiBaseUrl } from "../../config.js";

const tagLabels = [
  { label: "All types", value: "all" },
  { label: "Full-time", value: "Full Time" },
  { label: "Part-time", value: "Part Time" },
  { label: "Remote", value: "Remote" },
  { label: "Internship", value: "Internship" },
  { label: "Entry level", value: "Entry Level" },
  { label: "Senior", value: "Senior" },
];

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [activeChip, setActiveChip] = useState("all");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  useEffect(() => {
    try {
      axios
        .get(`${apiBaseUrl}/job/getall`, {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data?.jobs);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  if (!isAuthorized) {
    navigateTo("/");
  }

  const filteredJobs = jobs.filter((job) => {
    const kw = keyword.toLowerCase();
    const loc = location.toLowerCase();

    const matchesKeyword =
      !kw ||
      job.title?.toLowerCase().includes(kw) ||
      job.category?.toLowerCase().includes(kw);

    const matchesLocation = !loc || job.location?.toLowerCase().includes(loc);

    const matchesLabel = (() => {
      if (activeChip === "all") return true;
      if (activeChip === "Remote")
        return (
          job.jobType?.toLowerCase() === "remote" ||
          job.location?.toLowerCase() === "remote"
        );
      return job.jobType?.toLowerCase() === activeChip.toLowerCase();
    })();

    return matchesKeyword && matchesLocation && matchesLabel;
  });

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>

        {/* Search bar */}
        <div className="search-bar">
          <input
            className="search-field"
            type="text"
            placeholder="Job title, keywords..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <div className="search-divider" />
          <input
            className="search-field location"
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button
            className="search-btn"
            onClick={() => {
              setKeyword("");
              setLocation("");
            }}
          >
            Clear
          </button>
        </div>

        <div className="job-filters">
          {tagLabels.map((chip) => (
            <button
              key={chip.value}
              className={`chip${activeChip === chip.value ? " active" : ""}`}
              onClick={() => setActiveChip(chip.value)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="banner">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((element) => (
              <div className="card" key={element._id}>
                <p className="card-title">{element.title}</p>
                <p className="card-category">{element.category}</p>
                <p className="card-location">{element.location}</p>
                <div className="card-tags">
                  <span className="jtag">{element.jobType}</span>
                </div>
                <Link to={`/job/${element._id}`} className="card-btn">
                  Job Details
                </Link>
              </div>
            ))
          ) : (
            <p className="no-results">No jobs match your search.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
