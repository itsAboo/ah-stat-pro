import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, navigation.state]);

  return null;
}
