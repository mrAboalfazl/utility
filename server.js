const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = 8522;

// ریستارت سرور
app.get("/reboot", (req, res) => {
    res.json({ message: "Server will reboot in 5 seconds..." });
    setTimeout(() => {
        exec("sudo reboot", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Stdout: ${stdout}`);
        });
    }, 5000);
});

// دریافت آپ‌تایم سرور
app.get("/uptime", (req, res) => {
    exec("cat /proc/uptime", (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }
        const uptimeSeconds = parseFloat(stdout.split(" ")[0]);
        res.json({ uptime: uptimeSeconds });
    });
});

// تنظیم مقدار net.ipv4.ip_forward
app.get("/set-ipforward", (req, res) => {
    const command = "sudo sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.d/99-sysctl.conf && sudo sysctl -p";
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ message: "IP forwarding enabled successfully", output: stdout });
    });
});

// ریستارت سرویس bvpn
app.get("/restart-bvpn", (req, res) => {
    exec("sudo systemctl restart bvpn", (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ message: "bvpn service restarted successfully", output: stdout });
    });
});

// ریستارت سرویس udp2raw
app.get("/restart-udp2raw", (req, res) => {
    exec("sudo systemctl restart udp2raw", (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ message: "udp2raw service restarted successfully", output: stdout });
    });
});

// دریافت میزان مصرف CPU
app.get("/cpu-usage", (req, res) => {
    exec("top -bn1 | grep 'Cpu(s)'", (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }
        const cpuUsage = stdout.match(/\d+\.\d+/)[0];
        res.json({ cpu_usage: `${cpuUsage}%` });
    });
});

// بررسی وضعیت سرویس udp2raw
app.get("/udp2raw-status", (req, res) => {
    exec("/bin/systemctl is-active udp2raw.service", (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ service_status: stdout.trim() });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
