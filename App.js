import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import HomePage from "./ComPages/HomePage";
import Login from "./ComPages/Login";
import MainPage from "./ComPages/MainPage";

function App() {
  const [currentScreen, setCurrentScreen] = useState("home"); // "home", "login", "main"

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <Login onCreateAccount={() => setCurrentScreen("main")} />;
      case "main":
        return <MainPage onLogout={() => setCurrentScreen("login")} />;
      default:
        return <HomePage onGetStarted={() => setCurrentScreen("login")} />;
    }
  };

  return (
    <>
      {renderScreen()}
      <StatusBar style="auto" />
    </>
  );
}

export default App;
registerRootComponent(App);
