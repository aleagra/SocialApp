import { useEffect } from "react";
import axios from "axios";

function FetchPost(url, setPost) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(url);
        setPost(res.data.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [url, setPost]); // Agregar url y setPost como dependencias

  return null;
}

export default FetchPost;
