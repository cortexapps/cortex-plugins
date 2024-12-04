import { useEffect, useState } from "react";

export default function useExample() {
  const [counter, setcounter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setcounter((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return { counter };
}
