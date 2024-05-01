import { BiSolidPencil } from "react-icons/bi";
import { useQuery } from "react-query";
import dataCreate from "../../axios/data";

interface PropType {
  showModal: (index: number) => void;
  setTaskEdit: React.Dispatch<
    React.SetStateAction<{
      id: number;
      listId: number;
      title: string;
      isActive: boolean;
      completed: boolean;
    }>
  >;
  listIndex: number;
  id: number;
}

const Task = ({ showModal, setTaskEdit, listIndex, id }: PropType) => {
  interface TaskType {
    id: number;
    listId: number | string;
    title: string;
    isActive: boolean;
    completed: boolean;
  }

  let { data } = useQuery("getTasks", () => {
    return dataCreate.get("/tasks");
  });

  return (
    <>
      {data?.data
        .filter((task: TaskType) => task.listId === id)
        .map((task: TaskType) => {
          return (
            <li
              onClick={() => {
                setTaskEdit({
                  id: task.id,
                  listId: task.listId as number,
                  title: task.title,
                  isActive: task.isActive,
                  completed: task.completed,
                });
                showModal(listIndex);
              }}
              key={task.id}
              className="cursor-pointer"
            >
              {task.completed != false ? (
                <i className={`text-green-500 line-through`}>{task.title}</i>
              ) : (
                <span>{task.title}</span>
              )}
              <button className="delete cursor-pointer">
                <BiSolidPencil />
              </button>
            </li>
          );
        })}
    </>
  );
};

export default Task;
