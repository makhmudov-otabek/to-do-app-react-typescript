import dataCreate from "./dataCreate";

export const getBoards = async () => {
  const { data } = await dataCreate.get("data");
  console.log(data);

  return data;
};
