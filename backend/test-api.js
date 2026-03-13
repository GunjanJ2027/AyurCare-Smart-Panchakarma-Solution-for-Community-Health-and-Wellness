// backend/test-api.js

const testAPI = async () => {
  try {
    console.log("⏳ Testing Registration for NGO Admin...");
    
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@earthsaviours.org',
        password: 'securepassword123',
        role: 'NGO_Admin',
        fullName: 'Earth Saviours Admin'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log("✅ Registration Response:", registerData);

    console.log("\n⏳ Testing Login...");
    
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@earthsaviours.org',
        password: 'securepassword123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log("✅ Login Response:", loginData);

    if (loginData.token) {
        console.log("\n🎉 SUCCESS! We got the secure JWT Token. The API is working perfectly.");
    }

  } catch (error) {
    console.error("❌ Error testing API:", error.message);
    console.log("Make sure you are running Node v18+ and your server is running on port 5000.");
  }
};

testAPI();