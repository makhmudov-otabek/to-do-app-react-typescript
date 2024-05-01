import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme, Modal } from "antd";
import Lists from "../lists/list";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { boardIndexHandler } from "../../store/slices/data-actions";
import Input from "antd/es/input/Input";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FaCheck } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { Typography } from "antd";
import {
  AiFillFolderOpen,
  AiFillFolderAdd,
  AiFillFolder,
} from "react-icons/ai";
import dataCreate from "../../axios/dataCreate";
import { v4 as uuid4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";

const { Header, Sider, Content } = Layout;

const { Title } = Typography;

const App: React.FC = () => {
  const queryClient = useQueryClient();
  const [newBoardName, setNewBoardName] = useState({
    boardName: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const indexBoard = useSelector((state: RootState) => state.data.indexBoard);
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [selectedBoardIndex, setSelectedBoardIndex] = useState(0);
  const boardIndex = useSelector((state: RootState) => state.data.indexBoard);

  const addNewBoardMutation = useMutation(
    () => {
      return dataCreate.post("/boards", newBoardName);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getBoards");
      },
    }
  );

  const boardHandler = (index: number): void => {
    dispatch(boardIndexHandler(index));
  };

  const newListNameHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewListName(e.target.value);
  };

  const newTaskTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBoardName((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(newBoardName);
  };

  const addNewListMutation = useMutation(
    (newListObj: {
      id: number | string;
      title: string;
      boardId: number;
      tasks: {
        id: number;
        title: string;
        isActive: boolean;
      }[];
    }) => {
      return dataCreate.post(`/lists`, newListObj);
    },
    {
      onSuccess: () => {
        // toast.success(`List added successfully!`, {
        //   position: "bottom-right",
        // });
        return queryClient.invalidateQueries("getLists");
      },
    }
  );

  const addNewList = (): void => {
    if (newListName.trim().length == 0) {
      toast.error("Please select fill the input!");
      return;
    }
    interface newLisType {
      id: number | string;
      title: string;
      boardId: number;
      tasks: {
        id: number;
        title: string;
        isActive: boolean;
      }[];
    }

    const newList: newLisType = {
      id: uuid4(),
      title: newListName,
      boardId: indexBoard + 1,
      tasks: [],
    };
    addNewListMutation.mutate(newList);
    setNewListName("");
  };

  let { data, isError, isLoading } = useQuery("getBoards", () => {
    return dataCreate.get("/boards");
  });

  interface BoardType {
    id: number;
    boardName: string;
    lists: [];
  }

  const showModal = (): void => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addNewBoard = () => {
    if (newBoardName.boardName.trim().length == 0) {
      toast.error("Please fill the input!", {
        position: "bottom-right",
      });
      return;
    }
    handleOk();
    addNewBoardMutation.mutate();
    setNewBoardName({
      boardName: "",
    });
  };

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error with server !</h1>;

  return (
    <Layout className="h-screen">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[]}
        />

        <ul
          className="ant-menu mt-4 ant-menu-root ant-menu-inline ant-menu-dark css-dev-only-do-not-override-pr0fja"
          role="menu"
          tabIndex={0}
          data-menu-list="true"
        >
          {data?.data.map((board: BoardType, idx: number) => {
            return (
              <li
                key={board.id}
                className={`ant-menu-item  ${
                  idx === selectedBoardIndex ? "ant-menu-item-selected" : null
                }`}
                style={{ paddingLeft: "24px" }}
                role="menuitem"
                tabIndex={-1}
                data-menu-id="rc-menu-uuid-03297-8-1"
                onClick={() => {
                  setSelectedBoardIndex(idx);
                  boardHandler(idx);
                }}
              >
                {boardIndex === idx ? (
                  <AiFillFolderOpen className="me-2" />
                ) : (
                  <AiFillFolder className="me-2" />
                )}
                <span
                  style={{ marginLeft: "1px" }}
                  className="ant-menu-title-content"
                >
                  {board.boardName}
                </span>
              </li>
            );
          })}
          <Button
            onClick={showModal}
            style={{ paddingLeft: "51px" }}
            className="bg-transparent text-left text-slate-400 border-0 border-b-2 w-full rounded-none mt-5"
          >
            <AiFillFolderAdd className="me-2" />
            Add board
          </Button>
        </ul>
        <Modal
          title="New Board"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[]}
        >
          <Input
            className="mt-5"
            onChange={(e) => {
              newTaskTitleHandler(e);
            }}
            name="boardName"
            value={newBoardName.boardName}
          />

          <div className="flex justify-between items-center gap-2 mt-6">
            <Button
              onClick={() => {
                handleCancel();
                setNewBoardName({
                  boardName: "",
                });
              }}
              type="primary"
              danger
              className="flex-1"
            >
              <TiCancel />
            </Button>
            <Button
              onClick={() => {
                addNewBoard();
              }}
              type="primary"
              className="flex-1 bg-green-500"
            >
              <FaCheck />
            </Button>
          </div>
        </Modal>
        <ToastContainer />
      </Sider>
      <Layout>
        {data?.data.length == 0 ? (
          <div className="h-screen flex items-center justify-center">
            <Title level={1}>Please create board !</Title>
          </div>
        ) : (
          <div>
            <Header
              className="flex items-center"
              style={{ padding: 10, background: colorBgContainer }}
            >
              {/* <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          /> */}
              <Input
                value={newListName}
                onChange={newListNameHandler}
                className="rounded-none w-11/12 focus:outline-0 focus:shadow-none"
                placeholder="New list name ! "
                style={{
                  border: "none",
                  borderBottom: "1px solid black",
                  paddingBottom: "5px",
                }}
              />
              <Button
                className="rounded-none  focus:outline-0 focus:shadow-none"
                style={{
                  border: "none",
                  borderBottom: "1px solid black",
                }}
                onClick={addNewList}
              >
                Submit
              </Button>
            </Header>
            <Content
              className=" overflow-y-auto"
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
              }}
            >
              <Lists />
            </Content>
          </div>
        )}
      </Layout>
    </Layout>
  );
};

export default App;
