import { useState } from "react";
import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-green-200">
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
    </div>
  );
}

export default App;
