import { useNavigate } from "react-router";

const Test = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Test: id</h2>

      <button onClick={() => navigate("/")} type="button">
        Go back
      </button>
    </div>
  );
};

export default Test;
