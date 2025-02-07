import { useState } from "react";

import "./App.css";
import { AlertDialogDemo } from "./components/AlertDialogDemo";
import { Button } from "@/components/ui/button"

function App() {
  return (
    <>
      <Button>CLick me</Button>
      <AlertDialogDemo />
    </>
  );
}

export default App;
