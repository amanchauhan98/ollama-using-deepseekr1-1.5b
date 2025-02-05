
async function getDataFromOllama(e) {
    e.preventDefault();
    const searchBtn = document.getElementById("search-btn");

    try {
        const searchInput = getValuefromInputSearch()
        searchBtn.value = "loading..."
        const payload = {
            model: "deepseek-r1:1.5b",
            stream: false,
            messages: [
                {
                    role: "user",
                    content: searchInput
                }
            ]
        };
        if(!searchInput){
            return alert("Please enter a search query");
        }
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            searchBtn.value = "Error Found"
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
        }

        // console.log("Full Response:", JSON.parse(result)?.message?.content);
        searchBtn.value = "Result Found"
        searchBtn.setAttribute("disabled", true);
        postOllamaResult(JSON.parse(result)?.message?.content);
        searchBtn.value = "Search"
        searchBtn.setAttribute("disabled", false);

    } catch (error) {
        console.error("something went wrong while fetching data from ollama", error);
    }
}

function postOllamaResult(content){
    document.getElementById("result").innerText = content;
}

function getValuefromInputSearch(){
   const value = document.getElementById("searchInput").value;
   return value
}


document.getElementById("getData").addEventListener("submit", getDataFromOllama);
