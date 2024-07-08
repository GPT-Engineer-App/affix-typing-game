import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Word Affix Challenge</h1>
      <p className="text-xl mb-8">
        Test your vocabulary skills in this exciting multiplayer word game!
      </p>
      <Button asChild>
        <Link to="/game">Start Playing</Link>
      </Button>
    </div>
  );
};

export default Index;