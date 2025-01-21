import DesignArea from "./components/DesignArea";
import Header from "./components/Header";
import LineToolBar from "./components/LineToolBar";
import TextToolBar from "./components/TextToolBar";
import ToolBar from "./components/ToolBar";

function App() {
  return (
    <div className="p-5 pl-10 ">
      <Header />
      <div className="flex gap-6 mt-5">
        <div className="w-[220px] bg-gray-100 p-5 rounded-md">
          <ToolBar />
          <TextToolBar />
          <LineToolBar />
        </div>
        <div className="">
          <DesignArea />
        </div>
      </div>
    </div>
  );
}

export default App;
