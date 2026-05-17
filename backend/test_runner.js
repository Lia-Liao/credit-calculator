const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const BACKEND_DIR = __dirname;
const PORT = 3000;
let serverProcess = null;

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[${new Date().toLocaleTimeString()}] ${message}${colors.reset}`);
}

async function checkDependencies() {
  log('检查依赖...');
  log('假设依赖已手动安装，跳过自动安装', 'info');
  log('如果遇到模块缺失错误，请运行: pnpm install', 'warn');
}

async function installDependencies() {
  return new Promise((resolve, reject) => {
    const install = spawn('pnpm', ['install'], {
      cwd: BACKEND_DIR,
      shell: true
    });

    install.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    install.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    install.on('close', (code) => {
      if (code === 0) {
        log('依赖安装成功', 'success');
        resolve();
      } else {
        reject(new Error(`依赖安装失败，退出码: ${code}`));
      }
    });
  });
}

function startServer() {
  log('启动后端服务器...');
  
  serverProcess = spawn('node', ['server.js'], {
    cwd: BACKEND_DIR,
    shell: true
  });

  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    if (output.includes('服务器运行在')) {
      log('后端服务器启动成功', 'success');
      setTimeout(testAPI, 1000);
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  serverProcess.on('close', (code) => {
    log(`服务器进程结束，退出码: ${code}`, code === 0 ? 'info' : 'error');
  });
}

async function testAPI() {
  log('开始测试 API 接口...');

  try {
    await testEndpoint('/api/credit-cards', '获取信用卡列表');
    await testCalculateEndpoint();
    log('所有 API 测试通过', 'success');
    
    setTimeout(openBrowser, 1000);
  } catch (error) {
    log(`API 测试失败: ${error.message}`, 'error');
  }
}

function testEndpoint(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            log(`✓ ${description} - 状态码: ${res.statusCode}`, 'success');
            resolve(jsonData);
          } catch (e) {
            log(`✓ ${description} - 状态码: ${res.statusCode}`, 'success');
            resolve(data);
          }
        } else {
          reject(new Error(`${description} 失败 - 状态码: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

function testCalculateEndpoint() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      amount: 10000,
      minTerm: 3,
      maxTerm: 12
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/calculate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            log(`✓ 计算最优方案 - 状态码: ${res.statusCode}`, 'success');
            if (jsonData.data && jsonData.data.bestOption) {
              log(`  最优方案: ${jsonData.data.bestOption.bankName} - ${jsonData.data.bestOption.productTypeName} - ${jsonData.data.bestOption.term}期`, 'info');
            }
            resolve(jsonData);
          } catch (e) {
            log(`✓ 计算最优方案 - 状态码: ${res.statusCode}`, 'success');
            resolve(data);
          }
        } else {
          reject(new Error(`计算最优方案失败 - 状态码: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.write(postData);
    req.end();
  });
}

function openBrowser() {
  log('正在打开浏览器...');
  const url = `http://localhost:${PORT}`;
  
  let command;
  switch (process.platform) {
    case 'darwin':
      command = `open ${url}`;
      break;
    case 'win32':
      command = `start ${url}`;
      break;
    default:
      command = `xdg-open ${url}`;
  }

  exec(command, (error) => {
    if (error) {
      log(`无法自动打开浏览器，请手动访问: ${url}`, 'warn');
    } else {
      log(`浏览器已打开，请访问: ${url}`, 'success');
    }
  });
}

function cleanup() {
  if (serverProcess) {
    log('正在关闭服务器...');
    serverProcess.kill();
  }
}

process.on('SIGINT', () => {
  log('\n收到终止信号，正在清理...', 'warn');
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

async function main() {
  log('========================================');
  log('  信用卡计算器 - 自动化测试启动');
  log('========================================\n');

  try {
    await checkDependencies();
    startServer();
  } catch (error) {
    log(`启动失败: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();
