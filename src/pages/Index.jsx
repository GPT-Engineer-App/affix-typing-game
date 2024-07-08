import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="max-w-2xl px-6 py-12 bg-white rounded-lg shadow-xl">
        <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Word Affix Challenge
        </h1>
        <p className="text-xl mb-8 text-gray-600">
          Test your vocabulary skills in this exciting multiplayer word game!
        </p>
        <Button asChild className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700">
          <Link to="/game">Start Playing</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;