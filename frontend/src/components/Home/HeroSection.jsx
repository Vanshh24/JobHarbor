import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import logo from "../../../public/jobharbor-logo.png";
import { useEffect, useState } from "react";
import axios from "axios";

const HeroSection = () => {
  const [stats, setStats] = useState({
    jobSeekers: 0,
    employers: 0,
    liveJobs: 0,
  });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/api/v1/user/stats", {
        withCredentials: true,
      }),
      axios.get("http://localhost:3000/api/v1/job/jobstats", {
        withCredentials: true,
      }),
    ])
      .then(([userRes, jobRes]) => {
        setStats({
          jobSeekers: userRes.data.jobSeekers,
          employers: userRes.data.employers,
          liveJobs: jobRes.data.jobCount,
        });
      })
      .catch(() => {});
  }, []);

  const details = [
    {
      id: 1,
      title: stats.liveJobs.toLocaleString(),
      subTitle: "Live Job",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: "2",
      subTitle: "Companies",
      icon: <FaBuilding />,
    },
    {
      id: 3,
      title: stats.jobSeekers.toLocaleString(),
      subTitle: "Job Seekers",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: stats.employers.toLocaleString(),
      subTitle: "Employers",
      icon: <FaUserPlus />,
    },
  ];
  return (
    <>
      <div className="heroSection">
        <div className="container">
          <div className="title">
            <h1>Find a job that suits your interests and skills</h1>
            <p>
              Job search platform matching candidates with ideal roles and
              companies perfectly, sparking passion and aligning with interests,
              skills, and values!
            </p>
          </div>
          <div className="image">
            <img src={logo} alt="hero" />
          </div>
        </div>
        <div className="details">
          {details.map((element) => {
            return (
              <div className="card" key={element.id}>
                <div className="icon">{element.icon}</div>
                <div className="content">
                  <p>{element.title}</p>
                  <p>{element.subTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
