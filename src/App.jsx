import { useEffect, useState, useRef } from "react";
import InitialData from "./initialData";
import "./App.scss";
import initialData from "./initialData";
import Excalidraw, {
  exportToCanvas,
  exportToSvg,
  exportToBlob,
} from "@excalidraw/excalidraw";
import { renderTopRightUI } from "./renderTopRightUI";
import { renderFooter } from "./renderFooter";

function App() {
  const excalidrawRef = useRef(null);

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [canvasUrl, setCanvasUrl] = useState(null);
  const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
  const [shouldAddWatermark, setShouldAddWatermark] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const onHashChange = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const libraryUrl = hash.get("addLibrary");
      if (libraryUrl) {
        excalidrawRef.current.importLibrary(libraryUrl, hash.get("token"));
      }
    };
    window.addEventListener("hashchange", onHashChange, false);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const updateScene = () => {
    const sceneData = {
      elements: [
        {
          type: "rectangle",
          version: 141,
          versionNonce: 361174001,
          isDeleted: false,
          id: "oDVXy8D6rom3H1-LLH2-f",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          angle: 0,
          x: 100.50390625,
          y: 93.67578125,
          strokeColor: "#c92a2a",
          backgroundColor: "transparent",
          width: 186.47265625,
          height: 141.9765625,
          seed: 1968410350,
          groupIds: [],
        },
      ],
      appState: {
        viewBackgroundColor: "#edf2ff",
      },
    };
    excalidrawRef.current.updateScene(sceneData);
  };

  const handleReset = () => {
    excalidrawRef.current.resetScene();
  };

  const handleUpdateLibrary = () => {
    excalidrawRef.current.updateScene({
      libraryItems: [
        {
          status: "published",
          elements: initialData.libraryItems[0],
        },
        {
          status: "unpublished",
          elements: initialData.libraryItems[1],
        },
      ],
    });
  };

  const handleSetViewMode = () => setViewModeEnabled(!viewModeEnabled);

  const handleSetZenMode = () => setZenModeEnabled(!zenModeEnabled);

  const handleSetGridMode = () => setGridModeEnabled(!gridModeEnabled);

  const handleSetTheme = () => {
    let newTheme = "light";
    if (theme === "light") {
      newTheme = "dark";
    }
    setTheme(newTheme);
  };

  const handleOnChange = (elements, state) =>
    console.info("Elements :", elements, "State : ", state);

  const handlePointerUpdate = (payload) => console.info(payload);

  const handleCollab = () => window.alert("You clicked on collab button");

  const handleExportWithDarkMode = () =>
    setExportWithDarkMode(!exportWithDarkMode);

  const handleAddWatermark = () => setShouldAddWatermark(!shouldAddWatermark);

  const handleExportToSVG = async () => {
    const svg = await exportToSvg({
      elements: excalidrawRef.current.getSceneElements(),
      appState: {
        ...initialData.appState,
        exportWithDarkMode,
        shouldAddWatermark,
        width: 300,
        height: 100,
      },
      embedScene: true,
    });
    document.querySelector(".export-svg").innerHTML = svg.outerHTML;
  };

  const handleExportToBlob = async () => {
    const blob = await exportToBlob({
      elements: excalidrawRef.current.getSceneElements(),
      mimeType: "image/png",
      appState: {
        ...initialData.appState,
        exportWithDarkMode,
        shouldAddWatermark,
      },
    });
    setBlobUrl(window.URL.createObjectURL(blob));
  };

  const handleExportToCanvas = () => {
    const canvas = exportToCanvas({
      elements: excalidrawRef.current.getSceneElements(),
      appState: {
        ...initialData.appState,
        exportWithDarkMode,
        shouldAddWatermark,
      },
    });
    const ctx = canvas.getContext("2d");
    ctx.font = "30px Virgil";
    ctx.strokeText("My custom text", 50, 60);
    setCanvasUrl(canvas.toDataURL());
  };

  return (
    <div className="App">
      <div className="button-wrapper">
        <button className="update-scene" onClick={updateScene}>
          Update Scene
        </button>
        <button className="reset-scene" onClick={handleReset}>
          Reset Scene
        </button>
        <button onClick={handleUpdateLibrary}>Update Library</button>
        <label>
          <input
            type="checkbox"
            checked={viewModeEnabled}
            onChange={handleSetViewMode}
          />
          View mode
        </label>
        <label>
          <input
            type="checkbox"
            checked={zenModeEnabled}
            onChange={handleSetZenMode}
          />
          Zen mode
        </label>
        <label>
          <input
            type="checkbox"
            checked={gridModeEnabled}
            onChange={handleSetGridMode}
          />
          Grid mode
        </label>
        <label>
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={handleSetTheme}
          />
          Switch to Dark Theme
        </label>
      </div>
      <div className="excalidraw-wrapper">
        <Excalidraw
          ref={excalidrawRef}
          initialData={InitialData}
          onChange={handleOnChange}
          onPointerUpdate={handlePointerUpdate}
          onCollabButtonClick={handleCollab}
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
          theme={theme}
          name="Custom name of drawing"
          UIOptions={{ canvasActions: { loadScene: false } }}
          renderTopRightUI={renderTopRightUI}
          renderFooter={renderFooter}
        />
      </div>

      <div className="export-wrapper button-wrapper">
        <label className="export-wrapper__checkbox">
          <input
            type="checkbox"
            checked={exportWithDarkMode}
            onChange={handleExportWithDarkMode}
          />
          Export with dark mode
        </label>
        <label className="export-wrapper__checkbox">
          <input
            type="checkbox"
            checked={shouldAddWatermark}
            onChange={handleAddWatermark}
          />
          Add Watermark
        </label>
        <button onClick={handleExportToSVG}>Export to SVG</button>
        <div className="export export-svg"></div>

        <button onClick={handleExportToBlob}>Export to Blob</button>
        <div className="export export-blob">
          <img src={blobUrl} alt="" />
        </div>

        <button onClick={handleExportToCanvas}>Export to Canvas</button>
        <div className="export export-canvas">
          <img src={canvasUrl} alt="" />
        </div>
      </div>
    </div>
  );
}

export default App;
