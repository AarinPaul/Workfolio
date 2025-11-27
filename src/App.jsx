import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";


import { Dock, Home, Navbar, Welcome } from "#components";
import { Finder, Resume, Safari, Terminal, Text, Image, Contact } from "#windows";

gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />
      <Home />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <Image />
      <Contact />
    </main>
  );
};

export default App
