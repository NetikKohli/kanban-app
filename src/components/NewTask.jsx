import { useState, useRef } from "react";
import AddIcon from "../assets/add.svg";
import closeImg from "../assets/close.svg";

export const NewTask = ({ addTask }) => {
  const [TakeInput, setTakeInput] = useState(false);
  const modalRef = useRef(null);

  const closeOnOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setTakeInput(false);
    }
  };

  return (
    <>
      <img
        className="cursor-pointer w-10 h-10 bg-purple-500 p-2 rounded-full shadow-lg hover:bg-purple-700 hover:scale-110 transition-transform"
        src={AddIcon}
        onClick={() => setTakeInput(true)}
        alt="Add"
      />
      {TakeInput ? (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 backdrop-blur-sm z-10"
          onClick={closeOnOutsideClick}
        >
          <div
            ref={modalRef}
            className="relative flex flex-col gap-6 text-gray-700 p-6 bg-white rounded-2xl shadow-2xl w-full max-w-lg  overflow-y-auto"
          >
            <button
              className="absolute top-2 right-2 w-6 h-8 flex items-center justify-center"
              onClick={() => setTakeInput(false)}
            >
              <img src={closeImg} alt="Close" />
            </button>
            <h2 className="text-2xl font-semibold text-center border-b-2 pb-2">
              Add New Task
            </h2>
            <FormInput
              className="flex flex-col gap-4"
              inputClassName="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your task"
              handleSubmit={(value) => {
                addTask(value);
                setTakeInput(false);
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

const FormInput = ({
  className,
  inputClassName,
  placeholder,
  handleSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [collabs, setCollabs] = useState("");

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const item = {
          title: title.trim(),
          content: content.trim(),
          tags: tags.split(",").map((tag) => tag.trim()),
          collabs: collabs.split(",").map((collab) => collab.trim()),
        };
        handleSubmit(item);
        setTitle("");
        setContent("");
        setTags("");
        setCollabs("");
      }}
    >
      <Input
        type="text"
        value={title}
        label={"Task Title"}
        placeholder={"Enter Title"}
        className={inputClassName}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        type="text"
        value={content}
        label={"Task Content"}
        placeholder={"Enter Content"}
        className={inputClassName}
        onChange={(e) => setContent(e.target.value)}
      />
      <Input
        type="textarea"
        value={tags}
        label="Tags"
        placeholder={"Enter Tags\n (comma separated)"}
        className={inputClassName}
        onChange={(e) => setTags(e.target.value)}
      />
      <Input
        type="textarea"
        value={collabs}
        label="Collaborators"
        placeholder={"Enter Collaborators' Email (comma separated)"}
        className={inputClassName}
        onChange={(e) => setCollabs(e.target.value)}
      />
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-all">
        Add Task
      </button>
    </form>
  );
};

const Input = ({
  type = "text",
  value = "",
  label = "",
  placeholder = "",
  className = "",
  onChange = () => {},
  required = false,
  optional = false,
}) => {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {label}{" "}
        {required && <span className="text-red-500">*</span>}
        {optional && !required && (
          <span className="text-gray-400 text-xs italic"> (Optional)</span>
        )}
      </span>
      {type === "textarea" ? (
        <textarea
          required={required}
          value={value}
          placeholder={placeholder}
          className={className}
          onChange={onChange}
        />
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          placeholder={placeholder}
          className={className}
          onChange={onChange}
        />
      )}
    </label>
  );
};
