
const roomCallback = (req: any, res: any) => {
  console.log("req.body", req.body);
  console.log("req.query", req.query);
  console.log("req.headers", req.headers);
  return res.send();
};

export default roomCallback;
