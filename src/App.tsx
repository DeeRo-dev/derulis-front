import { MotionConfig } from "framer-motion";
import { AppRouter } from "./app/router";

function App() {
  return (
    /* reducedMotion="user": si el sistema pide menos movimiento, framer
       apaga desplazamientos y escalas y deja solo la opacidad. No hay que
       acordarse de contemplarlo en cada animación. */
    <MotionConfig reducedMotion="user">
      <AppRouter />
    </MotionConfig>
  );
}

export default App;
