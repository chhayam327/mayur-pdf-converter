// Yahan apni Secret Key daalein (ConvertAPI Dashboard se)
const API_SECRET = '6QLr111warEynbAjNC4Ruwm9hW9Mqrqb'; 

async function handleFile(input) {
    const file = input.files[0];
    if(!file) return;

    // 1. Size Check (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB! Please upgrade to Premium.");
        input.value = '';
        return;
    }

    // 2. Start UI Timer & Ads
    startProcess();

    // 3. Actual Backend Conversion
    try {
        const convertedFileUrl = await convertPDFtoWord(file);
        
        // Timer khatam hone ke baad download button ko asli link dena
        const downloadBtn = document.querySelector('#downloadBtn button');
        downloadBtn.onclick = () => {
            window.location.href = convertedFileUrl;
        };
    } catch (error) {
        alert("Conversion failed. Please check your daily limit.");
        location.reload();
    }
}

async function convertPDFtoWord(file) {
    const formData = new FormData();
    formData.append('File', file);

    // ConvertAPI Endpoint (PDF to Docx)
    const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/docx?Secret=${API_SECRET}`, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if (result.Files && result.Files.length > 0) {
        return result.Files[0].Url; // Ye download link hai
    } else {
        throw new Error("Conversion Error");
    }
      }
          
