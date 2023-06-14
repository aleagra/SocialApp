import { useEffect, useState } from "react";
import axios from "axios";

const FetchData = (url) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(url);
      setData(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return data;
};

export default FetchData;
