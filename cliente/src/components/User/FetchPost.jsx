import { useEffect } from "react";
import axios from "axios";
function FetchPost(url, setPost) {
  const fetchData = async () => {
    const res = await axios.get(url);
    setPost(res.data.length);
  };
  useEffect(() => {
    fetchData();
  }, []);
}

export default FetchPost;
