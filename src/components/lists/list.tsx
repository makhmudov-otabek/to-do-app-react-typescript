import "./todo.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useState } from "react";
import { Button, Modal } from "antd";
import { BiSolidPencil, BiSolidTrashAlt } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import Input from "antd/es/input/Input";
import Task from "../tasks/task";
import dataCreate from "../../axios/dataCreate";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { v4 as uuid4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditListModal = ({ list }: { list: any }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState(list);

  const showModal = (): void => {
    setIsModalOpen(true);
    console.log(list);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setItem(list);
  };

  const { mutate: editItemMutation } = useMutation(
    () => {
      return dataCreate.put(`/lists/${item.id}`, item);
    },
    {
      onSuccess: () => {
        // toast.success(`List edited successfully!`, {
        //   position: "bottom-right",
        // });
        queryClient.invalidateQueries("getLists");
      },
    }
  );

  const { mutate: deleteItemMutation } = useMutation(
    () => {
      return dataCreate.delete(`/lists/${item.id}`);
    },
    {
      onSuccess: () => {
        // toast.success(`Item deleted successfully!`, {
        //   position: "bottom-right",
        // });
        return queryClient.invalidateQueries("getLists");
      },
    }
  );

  const submitEditItem = () => {
    if (item.title.trim().length == 0) {
      toast.error(`Item title is empty!`, {
        position: "bottom-right",
      });
      return;
    }
    setIsModalOpen(false);
    editItemMutation();
  };

  return (
    <>
      <Button className="border-none" onClick={showModal}>
        <BiSolidPencil />
      </Button>
      <Modal
        title="Edit Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <Input
          className="mt-5"
          onChange={(e) => {
            setItem((prev: Record<string, any>) => ({
              ...prev,
              title: e.target.value,
            }));
          }}
          // value={taskEdit.title}
          value={item.title}
        />

        <div className="flex justify-between items-center gap-2 mt-6">
          <Button
            onClick={() => {
              deleteItemMutation();
              handleCancel();
              // deleteTask(taskEdit.id);
            }}
            type="primary"
            danger
            className="flex-1"
          >
            <BiSolidTrashAlt />
          </Button>
          <Button
            onClick={() => {
              submitEditItem();
              // editTaskFunction();
            }}
            type="primary"
            className="flex-1 bg-green-500"
          >
            <FaCheck />
          </Button>
        </div>
      </Modal>
    </>
  );
};

const Lists = () => {
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState<{
    [key: number]: { newTastTitle: string };
  }>({
    0: {
      newTastTitle: "",
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [editListIndex, setEditListIndex] = useState(0);
  const [taskEdit, setTaskEdit] = useState({
    id: 0,
    title: "",
    listId: 0,
    isActive: true,
    completed: false,
  });

  let boardIndex = useSelector((state: RootState) => state.data.indexBoard);

  interface TaskType {
    id: number | string;
    listId: number | string;
    title: string;
    isActive: boolean;
  }

  const showModal = (index: number): void => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addTaskMutation = useMutation(
    (newTask: TaskType) => {
      return dataCreate.post("/tasks", newTask);
    },
    {
      onSuccess: () => {
        // toast.success(`Task added successfully!`, {
        //   position: "bottom-right",
        // });
        return queryClient.invalidateQueries("getTasks");
      },
    }
  );

  const deleteTaskMutation = useMutation(
    (id: number | string) => {
      return dataCreate.delete(`/tasks/${id}`);
    },
    {
      onSuccess: () => {
        // toast.success(`Task removed successfully!`, {
        //   position: "bottom-right",
        // });
        return queryClient.invalidateQueries("getTasks");
      },
    }
  );

  const editTaskMutation = useMutation(
    () => {
      return dataCreate.put(`/tasks/${taskEdit.id}`, taskEdit);
    },
    {
      onSuccess: () => {
        // toast.success(`Task edited successfully!`, {
        //   position: "bottom-right",
        // });
        queryClient.invalidateQueries("getTasks");
      },
    }
  );

  const completeTaskMutation = useMutation(
    () => {
      return dataCreate.put(`/tasks/${taskEdit.id}`, {
        ...taskEdit,
        completed: !taskEdit.completed,
      });
    },
    {
      onSuccess: () => {
        // toast.success(`Task edited successfully!`, {
        //   position: "bottom-right",
        // });
        queryClient.invalidateQueries("getTasks");
      },
    }
  );

  const newTaskTitleHandler = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTaskTitle((prev) => ({
      ...prev,
      [index]: {
        newTastTitle: e.target.value,
      },
    }));
  };

  const taskTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskEdit((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const addTask = (listIdx: number, listId: number | string) => {
    if (
      !newTaskTitle[listIdx]?.newTastTitle ||
      newTaskTitle[listIdx]?.newTastTitle.trim().length == 0
    ) {
      toast.error("Please fill the input!", {
        position: "bottom-right",
      });
      setNewTaskTitle((prev) => ({
        ...prev,
        [listIdx]: {
          newTastTitle: "",
        },
      }));
      return;
    }

    const newTask = {
      id: uuid4(),
      listId: listId,
      // @ts-ignore
      title: newTaskTitle[listIdx].newTastTitle,
      isActive: false,
      completed: false,
    };

    addTaskMutation.mutate(newTask);

    setNewTaskTitle((prev) => ({
      ...prev,
      [listIdx]: {
        newTastTitle: "",
      },
    }));
  };

  const editTaskFunction = () => {
    if (taskEdit.title.trim().length == 0) {
      toast.error(`Fill the input please!`, {
        position: "bottom-right",
      });
      return;
    }
    handleOk();
    editTaskMutation.mutate();
    // dispatch(editTaskHandler({ ...taskEdit, editListIndex }));
  };

  const deleteTask = (id: number) => {
    deleteTaskMutation.mutate(id);
    // dispatch(deleteTaskHandler({ id, editListIndex }));
  };

  interface listType {
    id: number;
    boardId: number;
    title: string;
    tasks: {
      id: number;
      title: string;
      isActive: boolean;
    }[];
  }

  let { data } = useQuery("getLists", () => {
    return dataCreate.get(`/lists`);
  });

  const updatedLists = data?.data.filter(
    (list: listType) => list.boardId === boardIndex + 1
  );

  return (
    <div className="flex justify-start gap-4 items-start">
      {updatedLists?.length === 0 ? (
        <h1 className=" text-gray-400">You haven't got lists !</h1>
      ) : (
        updatedLists?.map(
          (
            list: {
              id: number;
              title: string;
              tasks: {
                id: number;
                title: string;
                isActive: boolean;
              }[];
            },
            listIdx: number
          ) => {
            return (
              <div key={list.id}>
                <div id="container" className=" shadow-md">
                  <div
                    id=""
                    className="bg-white rounded-t-md rounded-r-md pt-2 px-1"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <Input
                        className="text-xl border-none focus:shadow-none"
                        id="taskInput"
                        type="text"
                        placeholder="New task title here !"
                        value={list.title}
                        readOnly
                      />
                      {/* <Dropdown
                        menu={{ items, onClick: showModal1 }}
                        placement="bottomRight"
                        arrow={{ pointAtCenter: true }}
                      >
                        <Button className="border-none">
                          <HiOutlineDotsVertical />
                        </Button>
                      </Dropdown> */}

                      <EditListModal list={list} />
                    </div>
                  </div>

                  <div id="tasks">
                    {/* <div id="notification">Sorry, your task list is empty.</div> */}
                    <ul id="tasksList">
                      <Task
                        id={list.id}
                        listIndex={listIdx}
                        setTaskEdit={setTaskEdit}
                        showModal={showModal}
                      />
                    </ul>
                  </div>

                  <div id="footer">
                    <input
                      onChange={(e) => newTaskTitleHandler(listIdx, e)}
                      id="taskInput"
                      type="text"
                      placeholder="New task title here !"
                      value={newTaskTitle[listIdx]?.newTastTitle}
                    />
                    <button
                      onClick={() => addTask(listIdx, list.id)}
                      id="taskAdd"
                      className="cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        )
      )}
      <Modal
        title="Edit Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <Input
          className="mt-5"
          onChange={(e) => {
            taskTitleHandler(e);
          }}
          value={taskEdit.title}
        />

        <div className="flex justify-between items-center gap-2 mt-6">
          <Button
            onClick={() => {
              handleCancel();
              deleteTask(taskEdit.id);
            }}
            type="primary"
            danger
            className="flex-1"
          >
            <BiSolidTrashAlt />
          </Button>
          <Button
            onClick={() => {
              editTaskFunction();
            }}
            type="primary"
            className="flex-1 bg-green-500 hover:bg-green-400"
          >
            <FaCheck />
          </Button>
        </div>
        <Button
          onClick={() => {
            completeTaskMutation.mutate();
            handleOk();
          }}
          type="primary"
          className={`w-full mt-3 ${
            taskEdit.completed ? "bg-orange-500 hover:bg-orange-400" : ""
          }`}
        >
          {taskEdit.completed ? "Uncompleted" : "Complete"}
        </Button>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Lists;
