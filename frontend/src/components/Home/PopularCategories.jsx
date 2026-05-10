import { useEffect, useState } from "react";
import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";
import axios from "axios";

const PopularCategories = () => {
  const [categoryStats, setCategoryStats] = useState({
    "Graphics & Design": 0,
    "Mobile App Development": 0,
    "Frontend Web Development": 0,
    "MERN STACK Development": 0,
    "Account & Finance": 0,
    "Artificial Intelligence": 0,
    "Video Animation": 0,
    "Game Development": 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/job/categorystats", {
        withCredentials: true,
      })
      .then((res) => {
        setCategoryStats((prev) => ({ ...prev, ...res.data.categoryCounts }));
      })
      .catch(() => {});
  }, []);

  const categories = [
    {
      id: 1,
      title: "Graphics & Design",
      subTitle: categoryStats["Graphics & Design"],
      icon: <MdOutlineDesignServices />,
    },
    {
      id: 2,
      title: "Mobile App Development",
      subTitle: categoryStats["Mobile App Development"],
      icon: <TbAppsFilled />,
    },
    {
      id: 3,
      title: "Frontend Web Development",
      subTitle: categoryStats["Frontend Web Development"],
      icon: <MdOutlineWebhook />,
    },
    {
      id: 4,
      title: "MERN STACK Development",
      subTitle: categoryStats["MERN STACK Development"],
      icon: <FaReact />,
    },
    {
      id: 5,
      title: "Account & Finance",
      subTitle: categoryStats["Account & Finance"],
      icon: <MdAccountBalance />,
    },
    {
      id: 6,
      title: "Artificial Intelligence",
      subTitle: categoryStats["Artificial Intelligence"],
      icon: <GiArtificialIntelligence />,
    },
    {
      id: 7,
      title: "Video Animation",
      subTitle: categoryStats["Video Animation"],
      icon: <MdOutlineAnimation />,
    },
    {
      id: 8,
      title: "Game Development",
      subTitle: categoryStats["Game Development"],
      icon: <IoGameController />,
    },
  ];
  return (
    <div className="categories">
      <h3>POPULAR CATEGORIES</h3>
      <div className="banner">
        {categories.map((element) => {
          return (
            <div className="card" key={element.id}>
              <div className="icon">{element.icon}</div>
              <div className="text">
                <p>{element.title}</p>
                <p>{element.subTitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;
