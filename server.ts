import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for demonstration (in a real app, use a database)
  let lineGroups = [
    { id: "1", city: "上海", operator: "中国移动", areaCode: "021", totalConcurrency: 100, availableConcurrency: 80, maxCPS: 30, currentCPS: 10, onlineCount: 50, currentOnlineCount: 20, status: "enabled", remark: "上海移动主线路" },
    { id: "2", city: "北京", operator: "中国联通", areaCode: "010", totalConcurrency: 200, availableConcurrency: 150, maxCPS: 30, currentCPS: 5, onlineCount: 100, currentOnlineCount: 30, status: "enabled", remark: "北京联通主线路" },
  ];

  let numbers = [
    { id: "1", number: "13800138000", lineGroupId: "1", operator: "中国移动", city: "上海", dailyCalls: 50, createdAt: new Date().toISOString(), status: "normal", displayStatus: "active", agentId: "1", remark: "" },
    { id: "2", number: "13900139000", lineGroupId: "1", operator: "中国移动", city: "上海", dailyCalls: 20, createdAt: new Date().toISOString(), status: "cooling", displayStatus: "active", agentId: "1", remark: "冷却中" },
  ];

  let agents = [
    { id: "1", name: "坐席001", city: "上海", operator: "中国移动", numberCount: 2, boundNumbers: ["13800138000", "13900139000"], concurrency: 10, accountId: "acc_001", status: "enabled", remark: "" },
  ];

  let globalConfig = {
    coolingRule: { shortCalls: 10, rejections: 10, coolingHours: 2 },
    concurrencyRule: { defaultCPS: 30 },
    forbiddenHours: { start: "22:00", end: "08:00" },
    autoReplenishCooling: true,
    autoReplenishDisabled: true,
  };

  // API Routes
  app.get("/api/line-groups", (req, res) => res.json(lineGroups));
  app.post("/api/line-groups", (req, res) => {
    const newGroup = { ...req.body, id: Date.now().toString() };
    lineGroups.push(newGroup);
    res.json(newGroup);
  });

  app.get("/api/numbers", (req, res) => res.json(numbers));
  app.get("/api/agents", (req, res) => res.json(agents));
  app.get("/api/config", (req, res) => res.json(globalConfig));
  app.post("/api/config", (req, res) => {
    globalConfig = { ...globalConfig, ...req.body };
    res.json(globalConfig);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
