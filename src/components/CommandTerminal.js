import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';

export default function CommandTerminal({ onTriggerBreach }) {
  const [vfsTree] = useState(() => ({
    "/root": {
      "README.txt": "Welcome to Utkrasht Kumar's Kali Linux Portfolio Terminal.",
      ".bashrc": '# Kali Linux bash config\nexport PATH=$PATH:/usr/local/sbin\nalias ll="ls -la"\nalias nmap="nmap --privileged"',
      ".bash_history": "nmap -sV 192.168.1.1\nhydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10\nmsfconsole\nwhoami"
    },
    "/root/projects": {
      "ghost_protocol.md": "# Operation Ghost Protocol\nRed team compromise assessment on a Fortune 500 enterprise network.\nTarget: 192.168.100.0/24\nResult: Full domain compromise in 4 hours.",
      "shadownet.md": "# ShadowNet SIEM\nCustom Splunk SIEM deployment with MITRE ATT&CK framework integration.",
      "cve-2024-38291.md": "# CVE-2024-38291\nVPN Appliance Remote Code Execution vulnerability discovered and reported."
    },
    "/root/tools": {
      "recon.sh": "#!/bin/bash\n# Reconnaissance script\nnmap -sV -sC -O $1\nwhois $1\nnslookup $1",
      "exploit.py": '#!/usr/bin/env python3\n# Exploit framework\nimport socket\nimport struct\nprint("[*] Initiating exploit sequence...")',
      "wordlist.txt": "password\n123456\nadmin\nroot\nkali\ntoor\nletmein\nqwerty\npassword123"
    },
    "/usr/share/wordlists": {
      "rockyou.txt": "[Binary file - 14M passwords]",
      "common.txt": "[Binary file - Top 10000 passwords]"
    },
    "/etc": {
      "passwd": "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nkali:x:1000:1000:Kali,,,:/home/kali:/bin/bash",
      "hostname": "kali",
      "os-release": 'PRETTY_NAME="Kali GNU/Linux Rolling"\nNAME="Kali GNU/Linux"\nID=kali\nID_LIKE=debian\nHOME_URL="https://www.kali.org/"\nSUPPORT_URL="https://forums.kali.org/"',
      "hosts": "127.0.0.1	localhost\n127.0.1.1	kali\n::1		localhost ip6-localhost ip6-loopback"
    }
  }));

  const [vfsCwd, setVfsCwd] = useState("/root");
  const [cmdHistoryLog, setCmdHistoryLog] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [terminalHistory, setTerminalHistory] = useState([
    { text: "┌──(root💀kali)-[~]", type: "output" },
    { text: "└─# Welcome to the Kali Linux Portfolio Terminal  v2.4.0", type: "success" },
    { text: "", type: "output" },
    { text: 'Type "help" to list all available commands.', type: "output" }
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [isTerminalBusy, setIsTerminalBusy] = useState(false);
  const terminalScreenRef = useRef(null);
  const interactionPackets = useRef([]);

  const [analytics, setAnalytics] = useState(() => {
    return {
      visits: parseInt(localStorage.getItem("utk_visits") || "1"),
      commandsRun: parseInt(localStorage.getItem("utk_total_commands") || "0"),
      mostUsedCommand: "help",
      sessionStart: Date.now()
    };
  });

  useEffect(() => {
    if (terminalScreenRef.current) {
      terminalScreenRef.current.scrollTop = terminalScreenRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const getPromptStr = (cwd) => {
    const displayCwd = cwd === "/root" ? "~" : cwd.replace("/root", "~");
    return `┌──(root💀kali)-[${displayCwd}]\n└─#`;
  };

  const ALL_COMMANDS = [
    "help", "clear", "about", "skills", "projects", "certs", "contact", "social",
    "tools", "whoami", "date", "uname", "uptime", "id", "env", "history", "ip",
    "sysinfo", "geo", "bluetooth", "wifi", "nmap", "sqlmap", "hydra", "nikto",
    "gobuster", "aircrack-ng", "john", "hashcat", "metasploit", "burpsuite",
    "wireshark", "netstat", "exploit", "hackme", "decrypt", "matrix", "ls", "cd",
    "pwd", "cat", "echo", "mkdir", "touch", "rm", "grep", "chmod", "ps", "top",
    "ifconfig", "ping", "whois", "nslookup", "curl", "wget", "man"
  ];

  const runTerminalCommand = async (rawInput) => {
    const cleanInput = rawInput.trim();
    if (!cleanInput) {
      setTerminalHistory((prev) => [...prev, { text: getPromptStr(vfsCwd), type: "output" }]);
      return;
    }
    setCmdHistoryLog((prev) => [cleanInput, ...prev]);
    setHistoryIdx(-1);
    interactionPackets.current.push({
      time: new Date().toLocaleTimeString(),
      event: "CMD_RUN",
      detail: `Terminal directive dispatched: "${cleanInput}"`
    });

    const args = cleanInput.split(/\s+/);
    const command = args[0].toLowerCase();
    const restArgs = args.slice(1);
    const updatedTotal = analytics.commandsRun + 1;
    localStorage.setItem("utk_total_commands", updatedTotal.toString());
    
    const commandLog = JSON.parse(localStorage.getItem("utk_commands_history") || "{}");
    commandLog[command] = (commandLog[command] || 0) + 1;
    localStorage.setItem("utk_commands_history", JSON.stringify(commandLog));

    let maxCount = 0;
    let popularCmd = "help";
    Object.entries(commandLog).forEach(([cmd, count]) => {
      if (count > maxCount) {
        maxCount = count;
        popularCmd = cmd;
      }
    });

    setAnalytics((prev) => ({
      ...prev,
      commandsRun: updatedTotal,
      mostUsedCommand: popularCmd
    }));

    // Trigger update-analytics event to update the sidebar telemetry dynamically
    window.dispatchEvent(new CustomEvent('update-analytics', { 
      detail: { commandsRun: updatedTotal, mostUsedCommand: popularCmd } 
    }));

    setTerminalHistory((prev) => [...prev, { text: `${getPromptStr(vfsCwd)} ${cleanInput}`, type: "input" }]);
    setIsTerminalBusy(true);
    await new Promise((r) => setTimeout(r, 80));

    if (cleanInput.toLowerCase().includes("rm -rf")) {
      setTerminalHistory((prev) => [...prev, { text: "[!] WARNING: CRITICAL MALICIOUS DIRECTIVE DETECTED", type: "error" }]);
      setTerminalHistory((prev) => [...prev, { text: "[!] INITIALIZING SELF-DESTRUCT INTRUSION SIMULATOR...", type: "error" }]);
      await new Promise((r) => setTimeout(r, 800));
      if (onTriggerBreach) {
        onTriggerBreach(true);
        await new Promise((r) => setTimeout(r, 5000));
        onTriggerBreach(false);
      }
      setTerminalHistory((prev) => [...prev, { text: "[+] Core partition auto-repaired and restored cleanly.", type: "success" }]);
      setIsTerminalBusy(false);
      return;
    }

    switch (command) {
      case "ls": {
        const targetDir = restArgs[0] ? (restArgs[0].startsWith("/") ? restArgs[0] : `${vfsCwd}/${restArgs[0]}`).replace(/\/+/g, "/") : vfsCwd;
        const dirContents = vfsTree[targetDir];
        if (!dirContents) {
          const subdirs2 = Object.keys(vfsTree).filter((k) => k.startsWith(targetDir + "/") && k.split("/").length === targetDir.split("/").length + 1);
          if (subdirs2.length === 0) {
            setTerminalHistory((prev) => [...prev, { text: `ls: cannot access '${restArgs[0] || targetDir}': No such file or directory`, type: "error" }]);
          } else {
            setTerminalHistory((prev) => [...prev, { text: subdirs2.map((d) => d.split("/").pop() + "/").join("  "), type: "output" }]);
          }
          break;
        }
        const files = Object.keys(dirContents);
        const subdirs = Object.keys(vfsTree).filter((k) => k.startsWith(targetDir + "/") && k.split("/").length === targetDir.split("/").length + 1);
        const allEntries = [
          ...subdirs.map((d) => `\x1B[34m${d.split("/").pop()}/\x1B[0m`),
          ...files
        ];
        if (allEntries.length === 0) {
          setTerminalHistory((prev) => [...prev, { text: "(empty directory)", type: "output" }]);
        } else {
          setTerminalHistory((prev) => [...prev, { text: allEntries.join("   "), type: "output" }]);
        }
        break;
      }
      case "pwd":
        setTerminalHistory((prev) => [...prev, { text: vfsCwd, type: "output" }]);
        break;
      case "cd": {
        const target = restArgs[0];
        if (!target || target === "~") {
          setVfsCwd("/root");
          break;
        }
        if (target === "..") {
          const parts = vfsCwd.split("/");
          if (parts.length > 2) {
            parts.pop();
            setVfsCwd(parts.join("/"));
          } else {
            setVfsCwd("/");
          }
          break;
        }
        const resolved = target.startsWith("/") ? target : `${vfsCwd}/${target}`.replace(/\/+/g, "/");
        const hasDir = vfsTree[resolved] !== undefined || Object.keys(vfsTree).some((k) => k.startsWith(resolved + "/"));
        if (hasDir) {
          setVfsCwd(resolved);
        } else {
          setTerminalHistory((prev) => [...prev, { text: `cd: ${target}: No such file or directory`, type: "error" }]);
        }
        break;
      }
      case "cat": {
        const fileName = restArgs[0];
        if (!fileName) {
          setTerminalHistory((prev) => [...prev, { text: "cat: missing operand", type: "error" }]);
          break;
        }
        const resolved = fileName.startsWith("/") ? fileName : `${vfsCwd}/${fileName}`.replace(/\/+/g, "/");
        const parentDir = resolved.substring(0, resolved.lastIndexOf("/"));
        const file = resolved.split("/").pop() || "";
        const dirMap = vfsTree[parentDir];
        if (dirMap && dirMap[file] !== undefined) {
          const lines = dirMap[file].split("\n");
          setTerminalHistory((prev) => [
            ...prev,
            ...lines.map((l) => ({ text: l, type: "output" }))
          ]);
        } else {
          setTerminalHistory((prev) => [...prev, { text: `cat: ${fileName}: No such file or directory`, type: "error" }]);
        }
        break;
      }
      case "echo": {
        const msg = restArgs.join(" ").replace(/^"|"$/g, "").replace(/^'|'$/g, "");
        setTerminalHistory((prev) => [...prev, { text: msg, type: "output" }]);
        break;
      }
      case "mkdir": {
        if (!restArgs[0]) {
          setTerminalHistory((prev) => [...prev, { text: "mkdir: missing operand", type: "error" }]);
          break;
        }
        const newDir = restArgs[0].startsWith("/") ? restArgs[0] : `${vfsCwd}/${restArgs[0]}`.replace(/\/+/g, "/");
        vfsTree[newDir] = {};
        setTerminalHistory((prev) => [...prev, { text: `Directory created: ${newDir}`, type: "success" }]);
        break;
      }
      case "touch": {
        if (!restArgs[0]) {
          setTerminalHistory((prev) => [...prev, { text: "touch: missing file operand", type: "error" }]);
          break;
        }
        const resolved = restArgs[0].startsWith("/") ? restArgs[0] : `${vfsCwd}/${restArgs[0]}`.replace(/\/+/g, "/");
        const parentDir = resolved.substring(0, resolved.lastIndexOf("/"));
        const fname = resolved.split("/").pop() || "";
        if (!vfsTree[parentDir]) vfsTree[parentDir] = {};
        vfsTree[parentDir][fname] = "";
        setTerminalHistory((prev) => [...prev, { text: `Created: ${resolved}`, type: "success" }]);
        break;
      }
      case "rm": {
        const target = restArgs.filter((a) => !a.startsWith("-")).join(" ");
        const isRf = restArgs.includes("-rf") || restArgs.includes("-r");
        if (!target) {
          setTerminalHistory((prev) => [...prev, { text: "rm: missing operand", type: "error" }]);
          break;
        }
        const resolved = target.startsWith("/") ? target : `${vfsCwd}/${target}`.replace(/\/+/g, "/");
        const parentDir = resolved.substring(0, resolved.lastIndexOf("/"));
        const fname = resolved.split("/").pop() || "";
        if (isRf && vfsTree[resolved]) {
          delete vfsTree[resolved];
          setTerminalHistory((prev) => [...prev, { text: `Removed directory: ${resolved}`, type: "success" }]);
        } else if (vfsTree[parentDir]?.[fname] !== undefined) {
          delete vfsTree[parentDir][fname];
          setTerminalHistory((prev) => [...prev, { text: `Removed: ${resolved}`, type: "success" }]);
        } else {
          setTerminalHistory((prev) => [...prev, { text: `rm: cannot remove '${target}': No such file or directory`, type: "error" }]);
        }
        break;
      }
      case "grep": {
        if (restArgs.length < 2) {
          setTerminalHistory((prev) => [...prev, { text: "Usage: grep <pattern> <file>", type: "error" }]);
          break;
        }
        const pattern = restArgs[0];
        const fileName = restArgs[restArgs.length - 1];
        const resolved = fileName.startsWith("/") ? fileName : `${vfsCwd}/${fileName}`.replace(/\/+/g, "/");
        const parentDir = resolved.substring(0, resolved.lastIndexOf("/"));
        const file = resolved.split("/").pop() || "";
        const dirMap = vfsTree[parentDir];
        if (dirMap && dirMap[file] !== undefined) {
          const matches = dirMap[file].split("\n").filter((l) => l.includes(pattern));
          if (matches.length === 0) {
            setTerminalHistory((prev) => [...prev, { text: `grep: no matches for '${pattern}'`, type: "error" }]);
          } else {
            setTerminalHistory((prev) => [...prev, ...matches.map((m) => ({ text: m, type: "success" }))]);
          }
        } else {
          setTerminalHistory((prev) => [...prev, { text: `grep: ${fileName}: No such file or directory`, type: "error" }]);
        }
        break;
      }
      case "chmod": {
        if (restArgs.length < 2) {
          setTerminalHistory((prev) => [...prev, { text: "Usage: chmod <permissions> <file>", type: "error" }]);
          break;
        }
        setTerminalHistory((prev) => [...prev, { text: `mode of '${restArgs[1]}' changed to ${restArgs[0]}`, type: "success" }]);
        break;
      }
      case "whoami":
      case "id":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "root", type: "success" },
          { text: "uid=0(root) gid=0(root) groups=0(root)", type: "output" }
        ]);
        break;
      case "uname": {
        let osName = "Linux";
        const ua = navigator.userAgent;
        if (ua.indexOf("Windows") !== -1) osName = "Linux (WSL/Windows NT)";
        else if (ua.indexOf("Macintosh") !== -1) osName = "Darwin (macOS)";
        else if (ua.indexOf("Android") !== -1) osName = "Linux (Android)";
        else if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) osName = "Darwin (iOS)";
        if (restArgs.includes("-a") || restArgs.includes("-all")) {
          setTerminalHistory((prev) => [...prev, { text: `${osName} kali 6.9.1-kali-amd64 #1 SMP PREEMPT Debian (Arch: ${navigator.platform})`, type: "output" }]);
        } else {
          setTerminalHistory((prev) => [...prev, { text: osName, type: "output" }]);
        }
        break;
      }
      case "uptime": {
        const totalSecs = Math.floor(performance.now() / 1e3);
        const hours = Math.floor(totalSecs / 3600);
        const mins = Math.floor(totalSecs % 3600 / 60);
        const secs = totalSecs % 60;
        const upStr = `${hours > 0 ? hours + "h " : ""}${mins > 0 ? mins + "m " : ""}${secs}s`;
        setTerminalHistory((prev) => [...prev, {
          text: ` ${new Date().toLocaleTimeString()}  up ${upStr},  1 user,  active request latency: ${performance.now().toFixed(0)} ms`,
          type: "output"
        }]);
        break;
      }
      case "date":
        setTerminalHistory((prev) => [...prev, { text: new Date().toString(), type: "output" }]);
        break;
      case "history": {
        if (cmdHistoryLog.length === 0) {
          setTerminalHistory((prev) => [...prev, { text: "No commands in history.", type: "output" }]);
        } else {
          setTerminalHistory((prev) => [
            ...prev,
            ...cmdHistoryLog.slice().reverse().map((cmd, i) => ({ text: `  ${String(i + 1).padStart(3, " ")}  ${cmd}`, type: "output" }))
          ]);
        }
        break;
      }
      case "env": {
        const netConn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        setTerminalHistory((prev) => [
          ...prev,
          { text: "USER=root", type: "output" },
          { text: "HOME=/root", type: "output" },
          { text: `PWD=${vfsCwd}`, type: "output" },
          { text: `SHELL=/bin/bash`, type: "output" },
          { text: `TERM=xterm-256color`, type: "output" },
          { text: `LANG=${navigator.language || "en_US.UTF-8"}`, type: "output" },
          { text: `SCREEN_RESOLUTION=${window.screen.width}x${window.screen.height}`, type: "output" },
          { text: `ONLINE_STATUS=${navigator.onLine ? "ONLINE" : "OFFLINE"}`, type: "success" },
          { text: `PROTOCOL=${window.location.protocol.replace(":", "").toUpperCase()}`, type: "output" },
          { text: `DOWNLINK_BANDWIDTH=${netConn?.downlink || "N/A"} Mbps`, type: "output" },
          { text: "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin", type: "output" }
        ]);
        break;
      }
      case "ps": {
        const activeElementsCount = document.getElementsByTagName("*").length;
        setTerminalHistory((prev) => [
          ...prev,
          { text: "  PID TTY          TIME CMD", type: "output" },
          { text: "    1 ?        00:00:01 systemd", type: "output" },
          { text: "  312 ?        00:00:00 secure-server", type: "output" },
          { text: `  498 pts/0    00:00:00 bash (DOM Elements: ${activeElementsCount})`, type: "output" },
          { text: ` 1047 pts/0    00:00:00 ps (Render Engine: React)`, type: "output" }
        ]);
        break;
      }
      case "top": {
        const activeElements = document.getElementsByTagName("*").length;
        const totalSecs = Math.floor(performance.now() / 1000);
        const upStr = `${Math.floor(totalSecs / 60)}m ${totalSecs % 60}s`;
        const memInfo = performance.memory;
        const totalMem = memInfo ? `${Math.round(memInfo.jsHeapSizeLimit / 1048576)} MB` : "16384 MB (Allocated)";
        const usedMem = memInfo ? `${Math.round(memInfo.usedJSHeapSize / 1048576)} MB` : "8204 MB";
        const freeMem = memInfo ? `${Math.round((memInfo.jsHeapSizeLimit - memInfo.usedJSHeapSize) / 1048576)} MB` : "8180 MB";
        setTerminalHistory((prev) => [
          ...prev,
          { text: `top - ${new Date().toLocaleTimeString()} up ${upStr},  1 user,  performance diagnostics`, type: "output" },
          { text: `Tasks: 187 total, 1 running, 186 sleeping`, type: "output" },
          { text: `%Cpu(s):  3.8 us,  1.2 sy,  95.0 id (Cores: ${navigator.hardwareConcurrency || "Unknown"})`, type: "output" },
          { text: `MiB Mem:  ${totalMem} total,   ${freeMem} free,   ${usedMem} used`, type: "output" },
          { text: "", type: "output" },
          { text: "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM  COMMAND", type: "output" },
          { text: `  498 root      20   0   18276   5432   3876 R   1.2   0.1  bash (DOM Nodes: ${activeElements})`, type: "output" },
          { text: "  312 root      20   0   56432  11234   8123 S   0.1   0.1  secure-server", type: "output" }
        ]);
        break;
      }
      case "ifconfig": {
        const netConn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const online = navigator.onLine;
        setTerminalHistory((prev) => [
          ...prev,
          { text: "wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500", type: "output" },
          { text: `        inet ${online ? "192.168.1.102" : "127.0.0.1"}  netmask 255.255.255.0  broadcast 192.168.1.255`, type: "output" },
          { text: `        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet/WiFi)`, type: "output" },
          { text: `        RX packets ${Math.round(performance.now() / 10)}  bytes ${Math.round(performance.now() * 1.5)}`, type: "success" },
          { text: `        TX packets ${Math.round(performance.now() / 25)}  bytes ${Math.round(performance.now() * 0.4)}`, type: "success" },
          { text: `        Effective Connection Speed Profile: ${netConn?.effectiveType || "WiFi/Cellular"}`, type: "output" }
        ]);
        break;
      }
      case "netstat":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "Active Internet connections (servers and established)", type: "output" },
          { text: "Proto Recv-Q Send-Q Local Address        Foreign Address      State", type: "output" },
          { text: "tcp        0      0 0.0.0.0:22           0.0.0.0:*            LISTEN", type: "output" },
          { text: "tcp        0      0 0.0.0.0:80           0.0.0.0:*            LISTEN", type: "output" },
          { text: "tcp        0      0 0.0.0.0:443          0.0.0.0:*            LISTEN", type: "output" },
          { text: "tcp        0     52 192.168.1.100:22     192.168.1.50:58241   ESTABLISHED", type: "output" }
        ]);
        break;
      case "ping": {
        const host = restArgs[0] || window.location.hostname || "localhost";
        const pingUrl = host.startsWith("http") ? host : `https://${host}`;
        setTerminalHistory((prev) => [...prev, { text: `PING ${host} 56(84) bytes of data via HTTP fetch...`, type: "output" }]);
        for (let i = 1; i <= 4; i++) {
          const tStart = performance.now();
          let success = true;
          try {
            await fetch(pingUrl, { mode: "no-cors", cache: "no-cache" });
          } catch (e) {
            success = false;
          }
          const tEnd = performance.now();
          const latency = (tEnd - tStart).toFixed(2);
          if (success) {
            setTerminalHistory((prev) => [...prev, { text: `64 bytes from ${host}: HTTP_seq=${i} time=${latency} ms`, type: "success" }]);
          } else {
            setTerminalHistory((prev) => [...prev, { text: `Request timeout/CORS filter from ${host}: HTTP_seq=${i} time=${latency} ms`, type: "error" }]);
          }
          await new Promise((r) => setTimeout(r, 200));
        }
        break;
      }
      case "whois": {
        const domain = restArgs[0] || "google.com";
        setTerminalHistory((prev) => [...prev, { text: `[~] Querying public WHOIS database for: ${domain}...`, type: "output" }]);
        await new Promise((r) => setTimeout(r, 500));
        try {
          const whoisRes = await fetch(`https://rdap.org/domain/${domain}`);
          if (whoisRes.ok) {
            const whoisData = await whoisRes.json();
            const events = whoisData.events || [];
            const created = events.find((e) => e.eventAction === "registration")?.eventDate || "Unknown";
            const expired = events.find((e) => e.eventAction === "expiration")?.eventDate || "Unknown";
            const updated = events.find((e) => e.eventAction === "last changed")?.eventDate || "Unknown";
            setTerminalHistory((prev) => [
              ...prev,
              { text: `Domain Name: ${domain.toUpperCase()}`, type: "success" },
              { text: `Registry Domain ID: ${whoisData.handle || "N/A"}`, type: "output" },
              { text: `Creation Date: ${created}`, type: "output" },
              { text: `Expiration Date: ${expired}`, type: "output" },
              { text: `Updated Date: ${updated}`, type: "output" },
              { text: `Registrar WHOIS Server: ${whoisData.port43 || "rdap.org"}`, type: "output" }
            ]);
          } else {
            throw new Error();
          }
        } catch (e) {
          setTerminalHistory((prev) => [
            ...prev,
            { text: `Domain Name: ${domain.toUpperCase()}`, type: "success" },
            { text: `Status: query failed or domain unregistered.`, type: "error" }
          ]);
        }
        break;
      }
      case "nslookup": {
        const domain = restArgs[0] || "google.com";
        setTerminalHistory((prev) => [
          ...prev,
          { text: `Server:		8.8.8.8 (Google DoH Resolves)`, type: "output" },
          { text: `Address:	8.8.8.8#53`, type: "output" },
          { text: "", type: "output" }
        ]);
        try {
          const dnsRes = await fetch(`https://dns.google/resolve?name=${domain}`);
          const dnsData = await dnsRes.json();
          if (dnsData.Answer) {
            setTerminalHistory((prev) => [...prev, { text: `Non-authoritative answer:`, type: "output" }]);
            dnsData.Answer.forEach((ans) => {
              setTerminalHistory((prev) => [...prev, { text: `Name:	${ans.name}\nAddress:	${ans.data} (TTL: ${ans.TTL})`, type: "success" }]);
            });
          } else {
            setTerminalHistory((prev) => [...prev, { text: `*** Can't find ${domain}: No DNS records returned.`, type: "error" }]);
          }
        } catch (err) {
          setTerminalHistory((prev) => [...prev, { text: `*** nslookup lookup failed for ${domain}: CORS/Network blocker`, type: "error" }]);
        }
        break;
      }
      case "curl": {
        const target = restArgs.filter((a) => !a.startsWith("-")).join(" ");
        setTerminalHistory((prev) => [...prev, { text: `[~] curl ${target || ""}...`, type: "output" }]);
        await new Promise((r) => setTimeout(r, 400));
        setTerminalHistory((prev) => [...prev, { text: "HTTP/2 200 OK\ncontent-type: text/html\n\n<!DOCTYPE html><html>...</html>", type: "output" }]);
        break;
      }
      case "wget": {
        const url = restArgs[0] || "https://example.com";
        setTerminalHistory((prev) => [...prev, { text: `--${new Date().toLocaleTimeString()}--  ${url}`, type: "output" }]);
        await new Promise((r) => setTimeout(r, 500));
        setTerminalHistory((prev) => [
          ...prev,
          { text: `Resolving ${url.replace("https://", "").split("/")[0]}... 93.184.216.34`, type: "output" },
          { text: "Connecting... connected.", type: "output" },
          { text: "HTTP request sent, awaiting response... 200 OK", type: "success" },
          { text: `Saving to: '${url.split("/").pop() || "index.html"}'`, type: "output" }
        ]);
        break;
      }
      case "man": {
        const manCmd = restArgs[0];
        if (!manCmd) {
          setTerminalHistory((prev) => [...prev, { text: "What manual page do you want?", type: "error" }]);
          break;
        }
        const manPages = {
          nmap: ["NMAP(1)  Network Exploration Tool and Security Scanner", "SYNOPSIS: nmap [Scan Type] [Options] {target specification}", "OPTIONS: -sV (version detection), -sC (default scripts), -O (OS detection), -p (ports), -A (aggressive)"],
          hydra: ["HYDRA(1)  A very fast network login cracker", "SYNOPSIS: hydra [-l|-L user] [-p|-P pass] [-t tasks] service://server", "OPTIONS: -l login, -L list, -p password, -P wordlist, -t threads"],
          sqlmap: ["SQLMAP(1)  Automatic SQL injection and DB takeover tool", "SYNOPSIS: sqlmap -u <URL> [options]", "OPTIONS: --dbs (databases), --tables, --dump, --os-shell, --batch"],
          ls: ["LS(1) - list directory contents", "SYNOPSIS: ls [OPTION]... [FILE]...", "OPTIONS: -l long format, -a show hidden, -h human-readable"]
        };
        const page = manPages[manCmd];
        if (page) {
          setTerminalHistory((prev) => [...prev, ...page.map((l) => ({ text: l, type: "output" }))]);
        } else {
          setTerminalHistory((prev) => [...prev, { text: `No manual entry for ${manCmd}`, type: "error" }]);
        }
        break;
      }
      case "nmap": {
        const target = restArgs.filter((a) => !a.startsWith("-")).join(" ") || "127.0.0.1";
        const opts = restArgs.filter((a) => a.startsWith("-"));
        setTerminalHistory((prev) => [...prev, { text: `Starting Nmap 7.94 ( https://nmap.org )`, type: "output" }]);
        setTerminalHistory((prev) => [...prev, { text: `Nmap scan report for ${target}`, type: "output" }]);
        await new Promise((r) => setTimeout(r, 600));
        setTerminalHistory((prev) => [...prev, { text: `Host is up (0.0042s latency).`, type: "success" }]);
        if (opts.includes("-sV") || opts.includes("-A")) {
          setTerminalHistory((prev) => [
            ...prev,
            { text: "PORT     STATE SERVICE  VERSION", type: "output" },
            { text: "22/tcp   open  ssh      OpenSSH 8.4p1 Debian (protocol 2.0)", type: "output" },
            { text: "80/tcp   open  http     nginx 1.25.3", type: "output" },
            { text: "443/tcp  open  ssl/http  nginx 1.25.3", type: "output" },
            { text: "3306/tcp open  mysql    MySQL 8.0.35", type: "output" }
          ]);
        } else {
          setTerminalHistory((prev) => [
            ...prev,
            { text: "PORT     STATE SERVICE", type: "output" },
            { text: "22/tcp   open  ssh", type: "output" },
            { text: "80/tcp   open  http", type: "output" },
            { text: "443/tcp  open  https", type: "output" }
          ]);
        }
        setTerminalHistory((prev) => [...prev, { text: `Nmap done: 1 IP address (1 host up) scanned in 3.47 seconds`, type: "success" }]);
        break;
      }
      case "sqlmap": {
        const target = restArgs.filter((a) => !a.startsWith("-")).join(" ") || "http://target.com/page?id=1";
        setTerminalHistory((prev) => [...prev, { text: "        ___\n       __H__\n ___ ___[(]_____ ___ ___  {1.8.4#stable}", type: "output" }]);
        await new Promise((r) => setTimeout(r, 400));
        setTerminalHistory((prev) => [...prev, { text: `[*] Testing URL: ${target}`, type: "output" }]);
        await new Promise((r) => setTimeout(r, 700));
        setTerminalHistory((prev) => [...prev, { text: "[!] Parameter 'id' is vulnerable to UNION-based injection", type: "success" }]);
        setTerminalHistory((prev) => [...prev, { text: "[*] Database: targetdb\n    Tables: users, admin, sessions, products", type: "success" }]);
        break;
      }
      case "hydra": {
        const target = restArgs.filter((a) => !a.startsWith("-")).join(" ") || "ssh://192.168.1.10";
        setTerminalHistory((prev) => [...prev, { text: "Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak", type: "output" }]);
        await new Promise((r) => setTimeout(r, 400));
        setTerminalHistory((prev) => [...prev, { text: `[DATA] attacking ${target}`, type: "output" }]);
        await new Promise((r) => setTimeout(r, 800));
        setTerminalHistory((prev) => [
          ...prev,
          { text: '[ATTEMPT] target - login "admin" - pass "password" - 1 of 14344398', type: "output" },
          { text: '[ATTEMPT] target - login "admin" - pass "123456" - 2 of 14344398', type: "output" },
          { text: "[22][ssh] host: 192.168.1.10   login: admin   password: kali2024", type: "success" },
          { text: "1 of 1 target successfully completed, 1 valid password found", type: "success" }
        ]);
        break;
      }
      case "nikto": {
        setTerminalHistory((prev) => [...prev, { text: `- Nikto v2.1.6\n- Target: ${window.location.origin}`, type: "output" }]);
        await new Promise((r) => setTimeout(r, 600));
        const headers = {
          referrerPolicy: document.referrer || "no-referrer",
          secureContext: window.isSecureContext ? "Secure Context (HTTPS/localhost)" : "Insecure Context",
          cookieEnabled: navigator.cookieEnabled ? "Enabled" : "Disabled",
          userAgent: navigator.userAgent
        };
        setTerminalHistory((prev) => [
          ...prev,
          { text: `+ Target Origin: ${window.location.origin}`, type: "output" },
          { text: `+ Cookie Storage State: ${headers.cookieEnabled}`, type: "output" },
          { text: `+ TLS Security Layer: ${headers.secureContext}`, type: "success" },
          { text: `+ Referrer Policy Log: ${headers.referrerPolicy}`, type: "output" },
          { text: `+ Server/Client Platform: UserAgent matches ${navigator.platform}`, type: "output" },
          { text: "+ Security Headers analysis completed.", type: "success" }
        ]);
        break;
      }
      case "gobuster": {
        const targetHost = window.location.origin;
        setTerminalHistory((prev) => [...prev, { text: `Gobuster v3.6 - Scanning routing index on ${targetHost}`, type: "output" }]);
        const testPaths = ["/", "/tools", "/skills", "/projects", "/timeline", "/contact", "/admin", "/wp-admin", "/config.php", "/.git"];
        for (const path of testPaths) {
          await new Promise((r) => setTimeout(r, 100));
          try {
            const res = await fetch(`${targetHost}${path}`, { method: "HEAD" });
            if (res.status === 200) {
              setTerminalHistory((prev) => [...prev, { text: `  ${path.padEnd(20)} (Status: 200) [OK]`, type: "success" }]);
            } else {
              setTerminalHistory((prev) => [...prev, { text: `  ${path.padEnd(20)} (Status: ${res.status})`, type: "output" }]);
            }
          } catch (e) {
            setTerminalHistory((prev) => [...prev, { text: `  ${path.padEnd(20)} (Status: Blocked/CORS)`, type: "error" }]);
          }
        }
        break;
      }
      case "aircrack-ng": {
        setTerminalHistory((prev) => [
          ...prev,
          { text: "Aircrack-ng 1.7", type: "output" },
          { text: "[00:00:12] 14520 keys tested (1178.52 k/s)", type: "output" }
        ]);
        await new Promise((r) => setTimeout(r, 800));
        setTerminalHistory((prev) => [
          ...prev,
          { text: "                         KEY FOUND! [ P@ssw0rd2024 ]", type: "success" },
          { text: "Master Key     : A3 8C 72 F4 1B 3D 9E 2A ...", type: "success" }
        ]);
        break;
      }
      case "john":
      case "hashcat": {
        const targetHash = restArgs[0];
        const hashName = command.toUpperCase();
        setTerminalHistory((prev) => [...prev, { text: `${hashName} v6.2.6 starting -- Cracking SHA-256`, type: "output" }]);
        const dictionary = ["admin", "password", "toor", "kali", "security", "123456", "qwerty", "letmein", "utkrasht"];
        const hashSHA256 = async (message) => {
          const msgBuffer = new TextEncoder().encode(message);
          const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
          return hashHex;
        };
        if (!targetHash) {
          const demoHash = "2042456488d5e89d146059d0a64d1f2e1a3ef94464c24d15d654c600ae3de60b";
          setTerminalHistory((prev) => [
            ...prev,
            { text: `[!] No hash provided. Running demonstration scan.`, type: "error" },
            { text: `[~] Loading SHA-256 hash database...`, type: "output" },
            { text: `[~] Target Hash: ${demoHash}`, type: "output" }
          ]);
          await new Promise((r) => setTimeout(r, 600));
          let found = false;
          for (const word of dictionary) {
            const h = await hashSHA256(word);
            if (h === demoHash) {
              setTerminalHistory((prev) => [...prev, { text: `[SUCCESS] CRACKED! key: ${demoHash} → password: ${word}`, type: "success" }]);
              found = true;
              break;
            }
          }
          if (!found) {
            setTerminalHistory((prev) => [...prev, { text: `[!] Demo cracked failed.`, type: "error" }]);
          }
        } else {
          setTerminalHistory((prev) => [...prev, { text: `[~] Running real-time cryptanalysis against user hash: ${targetHash}...`, type: "output" }]);
          await new Promise((r) => setTimeout(r, 800));
          let found = false;
          for (const word of dictionary) {
            const h = await hashSHA256(word);
            if (h === targetHash.toLowerCase()) {
              setTerminalHistory((prev) => [...prev, { text: `[SUCCESS] CRACKED! target: ${targetHash} → password: ${word}`, type: "success" }]);
              found = true;
              break;
            }
          }
          if (!found) {
            setTerminalHistory((prev) => [...prev, { text: `[!] Cryptanalysis complete: Hash not found in common dictionary.`, type: "error" }]);
          }
        }
        break;
      }
      case "metasploit":
      case "msfconsole":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "                                                  \n     .~`-~~~. ~~~.                                   ", type: "output" },
          { text: "    /             |                                 ", type: "output" },
          { text: "   |  .~~. .~~.  |    Metasploit Framework 6.4.1   ", type: "output" },
          { text: "   |  |    |  |  |    =[ 2385 exploits             ", type: "output" },
          { text: "   |   ~~   ~~   |    + [ 1222 auxiliary          ", type: "output" },
          { text: "    \\             /    * [ 596 payloads            ", type: "output" },
          { text: "     `-~.......~-'     # [ 47 evasion              ", type: "output" },
          { text: "", type: "output" },
          { text: "   msf6 > (type a command — this is a simulation)", type: "success" }
        ]);
        break;
      case "burpsuite":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "Burp Suite Professional 2024.1", type: "output" },
          { text: "Proxy Listener: 127.0.0.1:8080 → ACTIVE", type: "success" },
          { text: "Intercept: ON | Spider: Running | Scanner: Active", type: "output" },
          { text: "[*] 3 issues found: SQL Injection (High), XSS (Medium), CSRF (Low)", type: "success" }
        ]);
        break;
      case "wireshark": {
        setTerminalHistory((prev) => [...prev, { text: "tshark -i eth0 — Printing captured session packets:", type: "output" }]);
        if (interactionPackets.current.length === 0) {
          setTerminalHistory((prev) => [...prev, { text: "No packets captured yet. Click around or switch tabs and try again!", type: "error" }]);
        } else {
          interactionPackets.current.forEach((pkt, i) => {
            setTerminalHistory((prev) => [...prev, { text: `  [${pkt.time}] PACKET #${i + 1} [${pkt.event}] → ${pkt.detail}`, type: "success" }]);
          });
        }
        break;
      }
      case "help":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "╔══════════════════════════════════════════════════╗", type: "output" },
          { text: "║   KALI LINUX PORTFOLIO TERMINAL — HELP INDEX  ║", type: "output" },
          { text: "╚══════════════════════════════════════════════════╝", type: "output" },
          { text: "", type: "output" },
          { text: "── FILESYSTEM ─────────────────────────────────────", type: "success" },
          { text: "  ls [dir]     cd <dir>     pwd      cat <file>", type: "output" },
          { text: "  echo <text>  mkdir <dir>  touch <file>  rm <file>", type: "output" },
          { text: "  grep <pat> <file>  chmod <perm> <file>", type: "output" },
          { text: "", type: "output" },
          { text: "── SYSTEM ─────────────────────────────────────────", type: "success" },
          { text: "  whoami  id  uname [-a]  uptime  date  history", type: "output" },
          { text: "  ps      top  env  ifconfig  netstat", type: "output" },
          { text: "", type: "output" },
          { text: "── NETWORK ────────────────────────────────────────", type: "success" },
          { text: "  ping <host>   whois <domain>   nslookup <domain>", type: "output" },
          { text: "  curl <url>    wget <url>       man <cmd>", type: "output" },
          { text: "", type: "output" },
          { text: "── KALI SECURITY TOOLS ────────────────────────────", type: "success" },
          { text: "  nmap        sqlmap    hydra      nikto", type: "output" },
          { text: "  gobuster    john      hashcat    aircrack-ng", type: "output" },
          { text: "  metasploit  burpsuite  wireshark  netstat", type: "output" },
          { text: "", type: "output" },
          { text: "── PORTFOLIO INFO ─────────────────────────────────", type: "success" },
          { text: "  about   skills   projects   certs   contact   social", type: "output" },
          { text: "", type: "output" },
          { text: "── REAL DEVICE SENSORS ────────────────────────────", type: "success" },
          { text: "  sysinfo    wifi    bluetooth    geo    ip", type: "output" },
          { text: "", type: "output" },
          { text: "── EXTRAS ─────────────────────────────────────────", type: "success" },
          { text: "  matrix   decrypt   exploit   neofetch   tools", type: "output" },
          { text: "", type: "output" },
          { text: "TIP: Use ↑/↓ arrows to navigate history. Tab for autocomplete.", type: "success" }
        ]);
        break;
      case "clear":
        setTerminalHistory([
          { text: "┌──(root💀kali)-[~]", type: "output" },
          { text: "└─# Kali Linux Portfolio Terminal cleared.", type: "success" },
          { text: "", type: "output" },
          { text: "╔══════════════════════════════════════════════════╗", type: "output" },
          { text: "║   KALI LINUX PORTFOLIO TERMINAL — HELP INDEX  ║", type: "output" },
          { text: "╚══════════════════════════════════════════════════╝", type: "output" },
          { text: "", type: "output" },
          { text: "── FILESYSTEM ─────────────────────────────────────", type: "success" },
          { text: "  ls [dir]     cd <dir>     pwd      cat <file>", type: "output" },
          { text: "  echo <text>  mkdir <dir>  touch <file>  rm <file>", type: "output" },
          { text: "  grep <pat> <file>  chmod <perm> <file>", type: "output" },
          { text: "", type: "output" },
          { text: "TIP: Type 'help' to show commands list.", type: "success" }
        ]);
        break;
      case "about":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "Utkrasht Kumar | Ethical Hacker & Security Researcher", type: "success" },
          { text: "Specializes in adversary simulation, malware triage, vulnerability discovery, and database security.", type: "output" },
          { text: "Currently pursuing M.Tech in CS at IET Lucknow.", type: "output" }
        ]);
        break;
      case "skills":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "── CAPABILITY ASSESSMENT REGISTER ────────────────", type: "success" },
          { text: "  Penetration Testing  ██████████ 97%  :: Certified", type: "output" },
          { text: "  Kali Linux           █████████░ 95%  :: Advanced", type: "output" },
          { text: "  Network Forensics    █████████░ 94%  :: Advanced", type: "output" },
          { text: "  Threat Intelligence  █████████░ 91%  :: Advanced", type: "output" },
          { text: "  Red Teaming/OPSEC   █████████░ 90%  :: Advanced", type: "output" },
          { text: "  Incident Response   ████████░░ 88%  :: Active", type: "output" },
          { text: "  Reverse Engineering ████████░░ 76%  :: Competent", type: "output" }
        ]);
        break;
      case "projects":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "── SECURE PROJECT FILES ──────────────────────────", type: "success" },
          { text: "  1. Operation Ghost Protocol    [Red Team Compromise]", type: "output" },
          { text: "  2. ShadowNet SIEM Build        [Splunk MITRE ATT&CK]", type: "output" },
          { text: "  3. CVE-2024-38291 Discovery    [VPN Appliance RCE]", type: "output" },
          { text: "  4. CloudBreaker Assessment     [AWS Takeover Project]", type: "output" }
        ]);
        break;
      case "certs":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "── COMPLIANCE & ACCREDITATIONS ──────────────────", type: "success" },
          { text: "  ✓  IBM Cybersecurity Analyst Professional", type: "output" },
          { text: "  ✓  CompTIA Security+ / CYSA+", type: "output" },
          { text: "  ✓  Incident Response & Forensics Specialist", type: "output" }
        ]);
        break;
      case "contact":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "── SECURE CHANNEL CONFIGURATION ─────────────────", type: "success" },
          { text: "  Email:    utkrashtkumar@gmail.com", type: "output" },
          { text: "  Location: Lucknow, India", type: "output" },
          { text: "  Status:   Accepting connections (Contact Us)", type: "output" }
        ]);
        break;
      case "social":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "── SOCIAL INTELLIGENCE CHANNELS ─────────────────", type: "success" },
          { text: "  LinkedIn:  linkedin.com/in/utkrashtkumar/", type: "output" },
          { text: "  GitHub:    github.com/utkrashtkumar", type: "output" },
          { text: "  Twitter:   twitter.com/utkrashtkumar", type: "output" }
        ]);
        break;
      case "tools":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "── CYBER SECURITY TOOLKIT ───────────────────────", type: "success" },
          { text: "  Metasploit, Nmap, Burp Suite, Wireshark, Splunk, Hashcat,", type: "output" },
          { text: "  SQLMap, Hydra, Nikto, Gobuster, Aircrack-ng, John the Ripper", type: "output" }
        ]);
        break;
      case "neofetch":
        setTerminalHistory((prev) => [
          ...prev,
          { text: "          .;ldkO0000Okdl:.              root@kali", type: "output" },
          { text: "       .;d00xl:^'':'^:x00d;.           ---------", type: "output" },
          { text: "    .d00l.                .od00l.        OS: Kali GNU/Linux Rolling x86_64", type: "output" },
          { text: "  .d0Kd.  Okxol:;.          :kKd.       Kernel: 6.9.1-kali-amd64", type: "output" },
          { text: " .OK:  .  :KKKK.              :KK.      Shell: zsh 5.9", type: "output" },
          { text: " OK     .  .x0k.               OK.      CPU: Intel Core i7 vPro (8)", type: "output" },
          { text: " KK   .  ;kK000.              ;0KK.     Memory: 16384 MiB", type: "output" },
          { text: " OK;  .  OKKKKd.             .dKKKKd.   GPU: NVIDIA RTX 4090 24G", type: "output" },
          { text: "  0Ko.  .0KKKK.              .KKKKO.    WM: i3wm", type: "output" },
          { text: "   Okd. .0KKKK.             .KKKKO.", type: "output" },
          { text: "    ':kd;OKKKKK0kxddddxkO00000OKd:", type: "output" }
        ]);
        break;
      case "matrix":
        setTerminalHistory((prev) => [...prev, { text: "[*] Establishing Matrix visual stream...", type: "output" }]);
        await new Promise((r) => setTimeout(r, 400));
        for (let row = 0; row < 5; row++) {
          const chars = Array.from({ length: 32 }, () => String.fromCharCode(Math.random() > 0.5 ? 48 + Math.floor(Math.random() * 10) : 12354 + Math.floor(Math.random() * 96))).join(" ");
          setTerminalHistory((prev) => [...prev, { text: chars, type: "success" }]);
          await new Promise((r) => setTimeout(r, 100));
        }
        setTerminalHistory((prev) => [...prev, { text: "[SYSTEM WARNING] Buffer overflow simulation ended.", type: "error" }]);
        break;
      case "decrypt":
        setTerminalHistory((prev) => [...prev, { text: "[~] Initializing hash cracking engine (MD5 / SHA-256 / AES)...", type: "output" }]);
        await new Promise((r) => setTimeout(r, 800));
        setTerminalHistory((prev) => [...prev, { text: "[*] Cracking local password hash database...", type: "output" }]);
        const entropyChars = "X01O9I#$&*@%?";
        for (let i = 0; i < 4; i++) {
          await new Promise((r) => setTimeout(r, 300));
          let tempKey = "";
          for (let j = 0; j < 24; j++) tempKey += entropyChars[Math.floor(Math.random() * entropyChars.length)];
          setTerminalHistory((prev) => [...prev, { text: `[COMPARING] Test Key: ${tempKey}`, type: "error" }]);
        }
        await new Promise((r) => setTimeout(r, 500));
        setTerminalHistory((prev) => [
          ...prev,
          { text: "[SUCCESS] Decrypted block. AES Key verified.", type: "success" },
          { text: '>> DECRYPTED PAYLOAD: "AUTHENTICITY ASSURED. UTKRASHT SECURE SYSTEMS PREPARED."', type: "success" }
        ]);
        break;
      case "hackme":
      case "exploit":
        setTerminalHistory((prev) => [...prev, { text: "[!] INITIATING SYSTEM BREACH SIMULATION SEQUENCE...", type: "error" }]);
        await new Promise((r) => setTimeout(r, 600));
        if (onTriggerBreach) {
          onTriggerBreach(true);
          await new Promise((r) => setTimeout(r, 5000));
          onTriggerBreach(false);
        }
        setTerminalHistory((prev) => [
          ...prev,
          { text: "[+] Intrusion simulation complete.", type: "success" },
          { text: "[SUCCESS] Autoremediation sequence executed cleanly. Firewall active.", type: "success" }
        ]);
        break;
      case "sysinfo":
        setTerminalHistory((prev) => [...prev, { text: "[~] Initializing real-time client diagnostics...", type: "output" }]);
        await new Promise((r) => setTimeout(r, 600));
        let batteryInfo = "Battery API not supported";
        try {
          if ("getBattery" in navigator) {
            const batt = await navigator.getBattery();
            batteryInfo = `${Math.round(batt.level * 100)}% (${batt.charging ? "Charging" : "Discharging"})`;
          }
        } catch (e) {}
        let connInfo = "Unavailable";
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) connInfo = `${conn.effectiveType?.toUpperCase()} (~${conn.downlink} Mbps, RTT: ${conn.rtt}ms)`;
        const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} logical cores` : "Unknown";
        const mem = navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : "Indeterminate";
        setTerminalHistory((prev) => [
          ...prev,
          { text: "── REAL-TIME DIAGNOSTIC REPORT ──────────────────", type: "success" },
          { text: `  Browser UA:     ${navigator.userAgent.substring(0, 60)}...`, type: "output" },
          { text: `  Screen:         ${window.screen.width} x ${window.screen.height} px`, type: "output" },
          { text: `  CPU Cores:      ${cores}`, type: "output" },
          { text: `  Device Memory:  ${mem}`, type: "output" },
          { text: `  Battery:        ${batteryInfo}`, type: "output" },
          { text: `  Connection:     ${connInfo}`, type: "output" },
          { text: `  Local Time:     ${new Date().toLocaleString()}`, type: "output" },
          { text: `  Online:         ${navigator.onLine ? "Yes" : "No"}`, type: "success" }
        ]);
        break;
      case "wifi": {
        setTerminalHistory((prev) => [...prev, { text: "[~] Probing wireless interface wlan0...", type: "output" }]);
        await new Promise((r) => setTimeout(r, 300));
        setTerminalHistory((prev) => [...prev, { text: "[~] Querying 802.11 adapter state...", type: "output" }]);
        await new Promise((r) => setTimeout(r, 450));
        const netConn2 = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const protocol = netConn2?.effectiveType?.toUpperCase() || "4G";
        const downlink = netConn2?.downlink ?? 10;
        const rtt = netConn2?.rtt ?? 50;
        const saveData = netConn2?.saveData ?? false;
        const online = navigator.onLine;
        setTerminalHistory((prev) => [
          ...prev,
          { text: "── iwconfig / iw dev — LIVE ADAPTER REPORT ──────", type: "success" },
          { text: "wlan0     IEEE 802.11  Mode: Managed  Frequency: 5.180 GHz", type: "output" },
          { text: `          Link Quality=${online ? "70/70" : "0/70"}  Signal level=${online ? "-40 dBm" : "-99 dBm"}`, type: online ? "success" : "error" },
          { text: `          Bit Rate: ${(downlink * 8).toFixed(1)} Mb/s   Tx-Power=20 dBm`, type: "output" },
          { text: `          RX Rate: ${downlink} Mbps   RTT: ${rtt} ms`, type: "output" },
          { text: `          Encryption key: WPA3-SAE   Auth: PSK`, type: "output" },
          { text: `          Protocol Type: ${protocol}   Power Management: off`, type: "output" },
          { text: `          Data Saver Mode: ${saveData ? "on (low bandwidth)" : "off"}`, type: "output" },
          { text: `          State: ${online ? "connected" : "disconnected"}`, type: online ? "success" : "error" }
        ]);
        break;
      }
      case "bluetooth":
        if (!navigator.bluetooth) {
          setTerminalHistory((prev) => [...prev, { text: "[ERROR] Web Bluetooth not supported or needs HTTPS.", type: "error" }]);
          break;
        }
        setTerminalHistory((prev) => [
          ...prev,
          { text: "[~] Initializing Web Bluetooth API discovery...", type: "output" },
          { text: "[!] Browser will prompt you to select a device...", type: "output" }
        ]);
        try {
          const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
          setTerminalHistory((prev) => [
            ...prev,
            { text: "── REAL BLUETOOTH DEVICE ────────────────────────", type: "success" },
            { text: `  Name:    ${device.name || "Unnamed Device"}`, type: "success" },
            { text: `  ID:      ${device.id}`, type: "output" },
            { text: `  Status:  ${device.gatt?.connected ? "Connected" : "Paired"}`, type: "output" }
          ]);
        } catch (err) {
          setTerminalHistory((prev) => [...prev, { text: `[!] Scan aborted: ${err.message}`, type: "error" }]);
        }
        break;
      case "ip":
        setTerminalHistory((prev) => [...prev, { text: "[~] Performing reverse IP lookup...", type: "output" }]);
        await new Promise((r) => setTimeout(r, 400));
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          setTerminalHistory((prev) => [
            ...prev,
            { text: "── INTERNET ROUTING NODE GEOLOCATION ────────────", type: "success" },
            { text: `  Public IP:  ${data.ip}`, type: "success" },
            { text: `  ISP/Org:    ${data.org}`, type: "output" },
            { text: `  City:       ${data.city}, ${data.region}`, type: "output" },
            { text: `  Country:    ${data.country_name} (${data.country_code})`, type: "output" },
            { text: `  ASN:        ${data.asn}`, type: "output" },
            { text: `  Timezone:   ${data.timezone}`, type: "output" }
          ]);
        } catch (e) {
          setTerminalHistory((prev) => [...prev, { text: "[ERROR] IP lookup failed (CORS or network issue).", type: "error" }]);
        }
        break;
      case "geo":
        if (!navigator.geolocation) {
          setTerminalHistory((prev) => [...prev, { text: "[ERROR] Geolocation API not supported by your browser.", type: "error" }]);
          break;
        }
        setTerminalHistory((prev) => [
          ...prev,
          { text: "[~] Requesting GPS satellite coordinates...", type: "output" },
          { text: "[!] Browser will prompt for Location access permission...", type: "output" }
        ]);
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
          });
          setTerminalHistory((prev) => [
            ...prev,
            { text: "── ACTIVE GPS NAVIGATION TELEMETRY ──────────────", type: "success" },
            { text: `  Latitude:   ${position.coords.latitude}°`, type: "success" },
            { text: `  Longitude:  ${position.coords.longitude}°`, type: "success" },
            { text: `  Accuracy:   Within ${Math.round(position.coords.accuracy)} meters`, type: "output" },
            { text: `  Altitude:   ${position.coords.altitude !== null ? position.coords.altitude + " m" : "N/A (Indoor)"}`, type: "output" },
            { text: `  Speed:      ${position.coords.speed !== null ? position.coords.speed + " m/s" : "Stationary"}`, type: "output" }
          ]);
        } catch (err) {
          setTerminalHistory((prev) => [...prev, { text: `[!] Geolocation denied: ${err.message}`, type: "error" }]);
        }
        break;
      default: {
        const lowerInput = cleanInput.toLowerCase();
        let aiResponse = "";
        if (lowerInput.includes("who") || lowerInput.includes("about") || lowerInput.includes("name")) {
          aiResponse = "[AI Terminal Assistant] Utkrasht Kumar is an IBM Certified Cybersecurity Analyst, Red Team operator, and offensive developer pursuing his M.Tech at IET Lucknow.";
        } else if (lowerInput.includes("contact") || lowerInput.includes("email") || lowerInput.includes("hire")) {
          aiResponse = "[AI Terminal Assistant] Secure channel connection: utkrashtkumar@gmail.com. You can also establish a handshake on the portfolio form!";
        } else if (lowerInput.includes("skills") || lowerInput.includes("languages") || lowerInput.includes("tools")) {
          aiResponse = "[AI Terminal Assistant] Main skill matrix includes: Penetration Testing (97%), Kali Linux (95%), Network Forensics (94%), Splunk/SIEM, Burp Suite, Metasploit.";
        } else if (lowerInput.includes("cve") || lowerInput.includes("exploit") || lowerInput.includes("vuln")) {
          aiResponse = "[AI Terminal Assistant] Utkrasht discovered a critical unauthenticated RCE VPN appliance vulnerability tracked under CVE-2024-38291.";
        } else if (lowerInput.includes("cert") || lowerInput.includes("education")) {
          aiResponse = "[AI Terminal Assistant] Key credentials: IBM Cybersecurity Professional cert, CompTIA Security+ / CYSA+ training, and M.Tech CS candidate at IET Lucknow.";
        } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
          aiResponse = "[AI Terminal Assistant] Handshake validated. Secure prompt established. Query me on Utkrasht's professional registers!";
        } else {
          aiResponse = `[AI Terminal Assistant] Bypassing secure containment... Intercepted question: "${cleanInput}". \n  Utkrasht is a security specialist. Type target directives like "skills", "projects", "certs", "ctf", or "geo" to probe live sensors!`;
        }
        setTerminalHistory((prev) => [
          ...prev,
          { text: aiResponse, type: "success" }
        ]);
        break;
      }
    }
    setIsTerminalBusy(false);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (isTerminalBusy || !terminalInput.trim()) return;
    runTerminalCommand(terminalInput);
    setTerminalInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isTerminalBusy || !terminalInput.trim()) return;
      runTerminalCommand(terminalInput);
      setTerminalInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, cmdHistoryLog.length - 1);
      setHistoryIdx(newIdx);
      setTerminalInput(cmdHistoryLog[newIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(newIdx);
      setTerminalInput(newIdx === -1 ? "" : cmdHistoryLog[newIdx] || "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = terminalInput.trim().split(/\s+/).pop() || "";
      if (!partial) return;
      const matches = ALL_COMMANDS.filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        const parts = terminalInput.trim().split(/\s+/);
        parts[parts.length - 1] = matches[0];
        setTerminalInput(parts.join(" "));
      } else if (matches.length > 1) {
        setTerminalHistory((prev) => [
          ...prev,
          { text: matches.join("   "), type: "output" }
        ]);
      }
    }
  };

  return (
    <section id="terminal" className="py-12 animate-fadeIn">
      <SectionHeader num="01" title="Secure Command Terminal" />
      <div className="glass-panel w-full max-w-4xl mx-auto overflow-hidden border border-brand-cyan/20 shadow-2xl flex flex-col rounded-xl">
        <div className="bg-[var(--bg-base)]/90 px-4 py-3 border-b border-brand-cyan/10 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
            <span>root@kali: {vfsCwd === "/root" ? "~" : vfsCwd.replace("/root", "~")}</span>
          </div>
          <div className="w-12" />
        </div>

        <div ref={terminalScreenRef} className="p-6 bg-black/95 min-h-[300px] max-h-[400px] overflow-y-auto font-mono text-xs md:text-sm text-slate-300 flex flex-col gap-2 terminal-scroll select-text">
          {terminalHistory.map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed whitespace-pre-wrap ${line.type === "input" ? "text-white font-semibold" : line.type === "error" ? "text-red-400" : line.type === "success" ? "text-brand-green drop-shadow-[0_0_4px_var(--color-brand-green)]" : "text-brand-cyan/90"}`}
            >
              {line.text}
            </div>
          ))}
          {isTerminalBusy && (
            <div className="text-slate-500 italic animate-pulse">
              System processing directive...
            </div>
          )}
        </div>

        <form onSubmit={handleTerminalSubmit} className="bg-[var(--bg-base)]/90 border-t border-brand-cyan/10 px-4 py-3.5 flex items-center gap-2">
          <span className="font-mono text-brand-green text-sm select-none shrink-0 hidden sm:inline">root@kali:~#</span>
          <span className="font-mono text-brand-green text-sm select-none shrink-0 inline sm:hidden">#</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTerminalBusy}
            placeholder="type a command or 'help'..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 min-w-0 font-mono text-sm bg-transparent text-white outline-none border-none focus:outline-none focus:ring-0 focus:border-none p-0 m-0 appearance-none placeholder-slate-600 disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={isTerminalBusy}
            className="px-3.5 py-1.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-mono hover:bg-brand-cyan/25 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            Enter
          </button>
        </form>
      </div>
    </section>
  );
}
