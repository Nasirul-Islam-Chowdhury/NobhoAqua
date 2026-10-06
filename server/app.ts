import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import { getUsersCollection } from "@/lib/server/mongodb";
import { cookieOptions, SESSION_COOKIE, signSession, verifySession } from "@/lib/server/jwt";
import { comparePassword, hashPassword } from "@/lib/server/password";
import { isValidEmail, isValidPassword, normalizeEmail } from "@/lib/server/validation";

const app = express();
app.use(express.json());
app.use(cookieParser());

let indexedOnce = false;
app.use(async (_req, _res, next) => {
  if (!indexedOnce) {
    indexedOnce = true;
    const users = await getUsersCollection();
    await users.createIndex({ email: 1 }, { unique: true });
  }
  next();
});

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};
  if (typeof name !== "string" || name.trim().length < 2)
    return res.status(400).json({ error: "Please enter your name." });
  if (typeof email !== "string" || !isValidEmail(email))
    return res.status(400).json({ error: "Enter a valid email address." });
  if (typeof password !== "string" || !isValidPassword(password))
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  const users = await getUsersCollection();
  const normalizedEmail = normalizeEmail(email);
  const existing = await users.findOne({ email: normalizedEmail });
  if (existing) return res.status(409).json({ error: "An account with this email already exists." });

  const passwordHash = await hashPassword(password);
  const trimmedName = name.trim();
  const result = await users.insertOne({
    name: trimmedName,
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date(),
  });

  const token = signSession({ sub: result.insertedId.toString(), name: trimmedName, email: normalizedEmail });
  res.cookie(SESSION_COOKIE, token, cookieOptions());
  res.status(201).json({ user: { name: trimmedName, email: normalizedEmail } });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string")
    return res.status(401).json({ error: "Incorrect email or password." });

  const users = await getUsersCollection();
  const normalizedEmail = normalizeEmail(email);
  const user = await users.findOne({ email: normalizedEmail });
  if (!user || !(await comparePassword(password, user.passwordHash)))
    return res.status(401).json({ error: "Incorrect email or password." });

  const token = signSession({ sub: user._id.toString(), name: user.name, email: user.email });
  res.cookie(SESSION_COOKIE, token, cookieOptions());
  res.json({ user: { name: user.name, email: user.email } });
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.status(204).end();
});

router.get("/me", (req: Request, res: Response) => {
  const token = req.cookies?.[SESSION_COOKIE];
  const payload = token ? verifySession(token) : null;
  if (!payload) return res.json({ user: null });
  res.json({ user: { name: payload.name, email: payload.email } });
});

app.use("/api/auth", router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express identifies error middleware by arity (4 params)
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
});

export default app;
