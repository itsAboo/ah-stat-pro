import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import PostList from "../components/posts/PostList";

export default function Home() {
  return (
    <div>
      <div className="flex justify-end items-center">
        <Button component={Link} to="/create" variant="contained">
          Create
        </Button>
      </div>
      <div className="mt-2 sm:mt-5">
        <PostList />
      </div>
    </div>
  );
}
