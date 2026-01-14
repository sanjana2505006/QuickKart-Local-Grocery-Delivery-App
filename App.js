import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomePage from "./ComPages/HomePage";
import Login from "./ComPages/Login";
import MainPage from "./ComPages/MainPage";

function App() {
  const [currentScreen, setCurrentScreen] = useState("home");

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
    <SafeAreaProvider>
      {renderScreen()}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default App;
registerRootComponent(App);