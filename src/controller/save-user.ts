const saveUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db(
    `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`,
    [username, hashedPassword]
  );
  res.json(result[0]);
};

export default saveUser;
