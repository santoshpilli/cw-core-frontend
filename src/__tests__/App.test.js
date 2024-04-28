import { render, screen } from "@testing-library/react";
import App from "../components/App";

test("Rendered App Component", () => {
  render(<App />);
  screen.debug();
});
