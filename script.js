const form = document.getElementById('movieRequestForm');
const submitBtn = form.querySelector('button');
const liveRequests = document.getElementById('liveRequests');

// GitHub Config
const repoOwner = "pathummalsara93-ux";
const repoName = "cinemax-hd-requests";
const filePath = "requests.json";
const branch = "main";
const token = "YOUR_PERSONAL_ACCESS_TOKEN"; // ⚠️ keep safe

// Fetch latest requests from GitHub
async function fetchRequests(){
  try{
    const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`,{
      headers:{ Authorization: `token ${token}` }
    });
    const data = await res.json();
    const content = atob(data.content);
    const requests = JSON.parse(content);

    // Clear list
    liveRequests.innerHTML = "";

    // Display latest requests (most recent first)
    requests.slice().reverse().forEach(r=>{
      const li = document.createElement('li');
      li.textContent = `${r.movieName} | ${r.quality} | ${r.subtitle}`;
      liveRequests.appendChild(li);
    });
  }catch(err){
    console.error("Error fetching requests", err);
  }
}

// Save new request to GitHub
async function saveRequest(movie, quality, subtitle){
  const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`,{
    headers:{ Authorization: `token ${token}` }
  });
  const data = await res.json();
  const sha = data.sha;
  const content = atob(data.content);
  const requests = JSON.parse(content);

  requests.push({ movieName: movie, quality, subtitle, timestamp: Date.now() });

  await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,{
    method: "PUT",
    headers:{
      Authorization:`token ${token}`,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      message: "New movie request",
      content: btoa(JSON.stringify(requests,null,2)),
      sha: sha,
      branch: branch
    })
  });
}

// Form submit
form.addEventListener('submit', async function(e){
  e.preventDefault();

  const movie = document.getElementById('movieName').value.trim();
  const quality = document.getElementById('quality').value;
  const subtitle = document.getElementById('subtitle').value;

  if(!movie) return;

  submitBtn.innerText = "SENDING... ⏳";
  submitBtn.disabled = true;

  try{
    await saveRequest(movie, quality, subtitle);
    submitBtn.innerText = "SENT SUCCESSFULLY! ✅";
    form.reset();
    fetchRequests(); // Update live wall
    setTimeout(()=>{
      submitBtn.innerText = "SEND REQUEST 🎬";
      submitBtn.disabled = false;
    },2000);
  }catch(err){
    console.error(err);
    alert("Error! කරුණාකර නැවත උත්සාහ කරන්න.");
    submitBtn.disabled = false;
  }
});

// Initial fetch
fetchRequests();

// Auto refresh every 15 seconds
setInterval(fetchRequests,15000);
