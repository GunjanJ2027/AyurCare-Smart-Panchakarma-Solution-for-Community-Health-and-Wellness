require('dotenv').config();

async function checkAvailableModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("🔍 Asking Google what models your key has access to...");

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.log("\n🚨 GOOGLE API ERROR:");
            console.error(data.error.message);
            return;
        }

        console.log("\n✅ SUCCESS! Google says you can use these models:");
        console.log("--------------------------------------------------");
        
        data.models.forEach(model => {
            // We only care about models that can generate text/chat
            if (model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`➡️  ${model.name.replace('models/', '')}`);
            }
        });
        
        console.log("--------------------------------------------------");
        console.log("Copy the most recent model name from this list!");

    } catch (error) {
        console.log("\n🚨 NETWORK ERROR FAILED!");
        console.error(error.message);
    }
}

checkAvailableModels();