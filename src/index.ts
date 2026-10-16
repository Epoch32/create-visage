import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal ANSI color helpers (zero external dependencies)
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m"
};

const TEMPLATES: Record<string, { name: string; description: string }> = {
  spa: {
    name: "Single-Page Application",
    description: "Client-side fine-grained reactivity with Vite & TypeScript"
  },
  "fullstack-rpc": {
    name: "Full-Stack RPC",
    description: "End-to-end type-safe client/server procedures & Vite middleware"
  },
  "desktop-native": {
    name: "Native Desktop (Zig)",
    description: "Fine-grained UI powered by a lightweight native Zig desktop host"
  }
};

function getTemplatesDir(): string {
  const candidates = [
    path.resolve(__dirname, "../templates"),
    path.resolve(__dirname, "templates"),
    path.resolve(process.cwd(), "templates")
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  throw new Error("Could not locate create-visage templates directory.");
}

function askQuestion(rl: readline.Interface, query: string, defaultVal: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

function detectPackageManager(): string {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("bun")) return "bun";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("yarn")) return "yarn";
  return "npm";
}

function copyDirectory(src: string, dest: string, projectName: string): void {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    // Convert _gitignore to .gitignore
    const destName = entry.name === "_gitignore" ? ".gitignore" : entry.name;
    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, projectName);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");
      if (entry.name === "package.json") {
        content = content.replaceAll("{{PROJECT_NAME}}", projectName);
      }
      fs.writeFileSync(destPath, content, "utf8");
    }
  }
}

async function run(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
${colors.bold}${colors.cyan}create-visage${colors.reset} - Scaffold a new Visage project

${colors.bold}Usage:${colors.reset}
  npm create visage [project-directory] [options]
  bun create visage [project-directory] [options]

${colors.bold}Options:${colors.reset}
  -t, --template <name>  Template to use (spa, fullstack-rpc, desktop-native)
  -h, --help             Show help
  -v, --version          Show version
`);
    process.exit(0);
  }

  if (args.includes("--version") || args.includes("-v")) {
    try {
      const pkgPath = path.resolve(__dirname, "../package.json");
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      console.log(`create-visage v${pkg.version}`);
    } catch {
      console.log("create-visage v1.0.0");
    }
    process.exit(0);
  }

  console.log(`\n${colors.bold}${colors.cyan}Visage${colors.reset} ${colors.dim}-  Visage scaffolding${colors.reset}\n`);

  let targetDir = "";
  let templateArg = "";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-t" || arg === "--template") {
      templateArg = args[i + 1] || "";
      i++;
    } else if (!arg.startsWith("-") && !targetDir) {
      targetDir = arg;
    }
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    if (!targetDir) {
      targetDir = await askQuestion(
        rl,
        `${colors.bold}Project name:${colors.reset} ${colors.dim}(visage-app)${colors.reset} `,
        "visage-app"
      );
    }

    const templateKeys = Object.keys(TEMPLATES);
    let selectedTemplate = templateArg;

    if (!selectedTemplate || !templateKeys.includes(selectedTemplate)) {
      console.log(`\n${colors.bold}Select a project template:${colors.reset}`);
      templateKeys.forEach((key, index) => {
        const t = TEMPLATES[key];
        console.log(`  ${colors.cyan}${index + 1})${colors.reset} ${colors.bold}${key}${colors.reset} ${colors.dim}: ${t.description}${colors.reset}`);
      });

      const choice = await askQuestion(
        rl,
        `\n${colors.bold}Enter choice [1-${templateKeys.length}]:${colors.reset} ${colors.dim}(1)${colors.reset} `,
        "1"
      );

      const parsedChoice = parseInt(choice, 10);
      if (!isNaN(parsedChoice) && parsedChoice >= 1 && parsedChoice <= templateKeys.length) {
        selectedTemplate = templateKeys[parsedChoice - 1];
      } else if (templateKeys.includes(choice)) {
        selectedTemplate = choice;
      } else {
        selectedTemplate = "spa";
      }
    }

    rl.close();

    const root = path.resolve(process.cwd(), targetDir);
    const projectName = path.basename(root);

    if (fs.existsSync(root) && fs.readdirSync(root).length > 0) {
      console.error(`\n${colors.red}Error:${colors.reset} Target directory "${targetDir}" already exists and is not empty.`);
      process.exit(1);
    }

    const templatesDir = getTemplatesDir();
    const templateSourceDir = path.join(templatesDir, selectedTemplate);

    if (!fs.existsSync(templateSourceDir)) {
      console.error(`\n${colors.red}Error:${colors.reset} Template "${selectedTemplate}" not found in templates directory.`);
      process.exit(1);
    }

    console.log(`\nScaffolding project in ${colors.green}${root}${colors.reset}...`);
    copyDirectory(templateSourceDir, root, projectName);

    const pkgManager = detectPackageManager();

    console.log(`\n${colors.bold}${colors.green}Done!${colors.reset} Project created successfully.`);
    console.log(`\n${colors.bold}Next steps:${colors.reset}`);
    if (root !== process.cwd()) {
      console.log(`  cd ${targetDir}`);
    }
    console.log(`  ${pkgManager} install`);
    console.log(`  ${pkgManager} run dev`);

    if (selectedTemplate === "desktop-native") {
      console.log(`\n${colors.dim}To run as a native Zig desktop app:${colors.reset}`);
      console.log(`  ${pkgManager} run native:run`);
    }
    console.log();
  } catch (err: any) {
    rl.close();
    console.error(`\n${colors.red}Error:${colors.reset} ${err?.message || err}`);
    process.exit(1);
  }
}

run();
