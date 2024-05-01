import { DataInterface } from "./../interfaces/data-type";

export let data: DataInterface[] = [
  {
    id: 1,
    boardName: "Board 1 List 1",
    lists: [
      {
        id: 1,
        title: "List 1",
        tasks: [
          {
            id: 1,
            title: "Object 1",
            isActive: true,
          },
          {
            id: 2,
            title: "Object 2",
            isActive: true,
          },

          {
            id: 3,
            title: "Object 3",
            isActive: false,
          },

          {
            id: 4,
            title: "Object 4",
            isActive: false,
          },
        ],
      },
      {
        id: 2,
        title: "List 2",
        tasks: [
          {
            id: 1,
            title: "Object 5",
            isActive: true,
          },
          {
            id: 2,
            title: "Object 6",
            isActive: true,
          },

          {
            id: 3,
            title: "Object 7",
            isActive: false,
          },

          {
            id: 4,
            title: "Object 8",
            isActive: false,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    boardName: "Board 2",
    lists: [
      {
        id: 1,
        title: "Board 2 List 1",
        tasks: [
          {
            id: 1,
            title: "Object 1",
            isActive: true,
          },
          {
            id: 2,
            title: "Object 2",
            isActive: true,
          },
        ],
      },
    ],
  },
];
