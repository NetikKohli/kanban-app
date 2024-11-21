import { useEffect, useState } from "react";
import { NewTask } from "./components/NewTask";
import closeImg from "./assets/close.svg";
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function App() {
  const [stage1, setStage1] = useState([]);
  const [stage2, setStage2] = useState([]);
  const [stage3, setStage3] = useState([]);
  const board = [
    { id: "stage1", label: "Task List 1", stage: stage1, setStage: setStage1 },
    { id: "stage2", label: "Task List 2", stage: stage2, setStage: setStage2 },
    { id: "stage3", label: "Task List 3", stage: stage3, setStage: setStage3 },
  ];

  return (
    <div className="bg-[#140b1a] w-full h-auto flex-1 flex self-stretch gap-4 text-[#ffffff]">
      {board.map(({ id, stage, label, setStage }, index) => (
        <Stage
          id={id}
          key={"stage-" + index}
          label={label}
          addTask={(newItem) => {
            if (!newItem) return;
            let value = {
              ...newItem,
              id: generateId(),
              parentId: id,
              history: [],
            };
            setStage([...stage, value]);
          }}
          moveTask={(item, fromParentId, toParentId) => {
            console.log("moving", item, fromParentId, toParentId);
            const fromStage = board.find(({ id }) => id === fromParentId);
            const toStage = board.find(({ id }) => id === toParentId);
            fromStage.setStage(
              fromStage.stage.filter(({ id }) => id !== item.id)
            );
            toStage.setStage([
              ...toStage.stage,
              { ...item, parentId: toParentId },
            ]);
          }}
        >
          {stage.map(
            (
              { id, parentId, history, title, content, tags, collabs },
              index
            ) => (
              <Item
                key={"1" + index}
                title={title}
                content={content}
                tags={tags}
                collabs={collabs}
                id={id}
                parentId={parentId}
                history={history}
                deleteItem={() => {
                  setStage(stage.filter((item) => item.id !== id));
                }}
              />
            )
          )}
        </Stage>
      ))}
    </div>
  );
}

export default App;

const Stage = ({ id, label, addTask, moveTask, children }) => {
  const onDrop = (e) => {
    const item = JSON.parse(e.dataTransfer.getData("draggedItem"));
    const { id: itemId, value, parentId, history } = item;
    if (parentId === id) return;
    moveTask(item, parentId, id);
  };
  return (
    <div
      id={id}
      onDrop={(e) => {
        onDrop(e);
        e.currentTarget.classList.remove("drag-wrapper");
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={(e) => e.currentTarget.classList.add("drag-wrapper")}
      onDragLeave={(e) =>
        console.log(
          e,
          e.target,
          e.currentTarget.classList.remove("drag-wrapper")
        )
      }
      className="p-1 w-full flex-1 flex flex-col border-l-2 border-r-2 text-lg items-center font-semibold overflow-auto border-white m-9 rounded-2xl justify-items-center"
    >
      <div className="flex p-4 w-full items-center">
        <h4 className="text-xl w-full flex-1 flex">{label}</h4>
        <NewTask addTask={addTask} />
      </div>
      {children}
    </div>
  );
};

const Item = ({ id, parentId, history, deleteItem, ...rest }) => {
  const { title, content, tags, collabs } = rest;
  const [currHistory, setCurrHistory] = useState(history);
  useEffect(() => {
    if (history.length > 0 && history[history.length] === parentId) return;
    setCurrHistory([...currHistory, parentId]);
  }, []);
  const onDragStartFn = (e) => {
    console.log("dragging", e.target.innerHTML);
    e.dataTransfer.setData(
      "draggedItem",
      JSON.stringify({
        id,
        parentId,
        history: currHistory,
        ...rest,
      })
    );
  };
  const onDragEndFn = (e) => {
    console.log("drag ended");
  };
  return (
    <div
      draggable
      onDragStart={onDragStartFn}
      onDragEnd={onDragEndFn}
      className="text-black Item border shadow rounded-lg flex flex-col justify-start items-start bg-[#ffffff] min-w-48"
    >
      <div className="flex justify-end w-full">
        <button onClick={deleteItem} className="w-6 ">
          <img src={closeImg} alt="close" />{" "}
        </button>
      </div>
      <div className="p-1 flex flex-col justify-start items-start gap-4">
        <div className="flex justify-start ">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-[#365EFF99] text-[#fff7d1] px-4 py-1.5 pb-2 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <h4 className="text-lg leading-none font-semibold">{title}</h4>
        {content ? (
          <p className="text-xs opacity-90 text-wrap leading-3 truncate--x">
            {content}
          </p>
        ) : null}
      </div>
      <div className="h-1 border w-full" />
      <div className="p-4 flex justify-start items-start">
        {collabs.slice(0, 4).map((collab, index) => {
          return (
            <span
              key={index}
              className={
                "p-2 shadow-lg shadow-black w-full h-10 aspect-square  text-[#000000] text-base rounded-full translate-x-[-${index*50}%] "
              }
            >
              {collab}
              
            </span>
          );
        })}
      </div>
    </div>
  );
};
