"use client";

import { FireworkProvider } from "./FireworkContext";
import Controls from "./Controls";
import Menu from "./Menu";
import HelpModal from "./HelpModal";
import FireworkCanvas from "./FireworkCanvas";

export default function FireworkApp() {
  return (
    <FireworkProvider>
      <div className="stage-container">
        <FireworkCanvas />
        <Controls />
        <Menu />
      </div>
      <HelpModal />
    </FireworkProvider>
  );
}
