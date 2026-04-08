// ConvertAPI Production Token yahan daalein
const API_SECRET = '6QLr111warEynbAjNC4Ruwm9hW9Mqrqb'; 

let dailyLimit = 5;
let selectedTool = '';

function toggleNav() {
    let s = document.getElementById("sideNav");
    s.style.width = s.style.width === "280px" ? "0" : "280px";
}

function openConverter(tool) {
    if(dailyLimit <= 0) {
        alert("Daily Limit Exceeded! Upgrade to Premium.");
        return;
    }
    selectedTool = tool;
    document.getElementById('fileInput').click();
}

async function handleFile(input) {
    const file = input.files[0];
    if(!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB! Please upgrade to Premium.");
        input.value = '';
        return;
    }

    startProcessUI();

    let endpoint = 'pdf/to/docx'; 
    if(selectedTool === 'PDF to JPG') endpoint = 'pdf/to/jpg';
    if(selectedTool === 'Merge PDF') endpoint = 'pdf/to/merge';
    if(selectedTool === 'Compress PDF') endpoint = 'pdf/to/compress';

    try {
        const formData = new FormData();
        formData.append('File', file);

        const response = await fetch(`https://v2.convertapi.com/convert/${endpoint}?Secret=${API_SECRET}`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.Files && result.Files.length > 0) {
            const finalUrl = result.Files[0].Url;
            
            // Wait for UI timer to reach zero
            const checkTimer = setInterval(() => {
                const currentTimer = document.getElementById('timer').innerText;
                if(currentTimer == "0") {
                    clearInterval(checkTimer);
                    const dBtn = document.getElementById('finalDownloadLink');
                    dBtn.onclick = () => { 
                        window.location.href = finalUrl;
                        setTimeout(() => { location.reload(); }, 2000); 
                    };
                }
            }, 500);
        } else {
            throw new Error("Conversion failed");
        }
    } catch (error) {
        console.error(error);
        alert("Error: Daily API limit reached or file error.");
        location.reload();
    }
}

function startProcessUI() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('toolNameDisplay').innerText = selectedTool;
    document.getElementById('downloadBtn').style.display = 'none';
    document.getElementById('timer').style.display = 'block';
    
    let time = 10;
    let countdown = setInterval(() => {
        time--;
        document.getElementById('timer').innerText = time;
        if(time <= 0) {
            clearInterval(countdown);
            document.getElementById('timer').style.display = 'none';
            document.getElementById('downloadBtn').style.display = 'block';
            dailyLimit--;
            document.getElementById('count').innerText = dailyLimit;
        }
    }, 1000);
            }
        
