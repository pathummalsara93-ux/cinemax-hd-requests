const form = document.getElementById('movieRequestForm');
const submitBtn = form.querySelector('button');
const liveRequests = document.getElementById('liveRequests');

// Fetch and display requests
async function fetchRequests() {
  try {
    const res = await fetch('/api/requests');
    const data = await res.json();
    liveRequests.innerHTML = "";
    data.forEach(r => {
      const li = document.createElement('li');
      li.textContent = `${r.movieName} | ${r.quality} | ${r.subtitle}`;
      liveRequests.appendChild(li);
    });
  } catch(err) {
    console.error("Fetch requests error", err);
  }
}

// Submit form
form.addEventListener('submit', async e => {
  e.preventDefault();
  const movieName = document.getElementById('movieName').value.trim();
  const quality = document.getElementById('quality').value;
  const subtitle = document.getElementById('subtitle').value;

  if(!movieName) return;

  submitBtn.innerText = "SENDING... ⏳";
  submitBtn.disabled = true;

  try {
    await fetch('/api/addRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieName, quality, subtitle })
    });
    submitBtn.innerText = "SENT SUCCESSFULLY! ✅";
    form.reset();
    fetchRequests();
    setTimeout(() => {
      submitBtn.innerText = "SEND REQUEST 🎬";
      submitBtn.disabled = false;
    }, 2000);
  } catch(err) {
    console.error(err);
    alert("Error! කරුණාකර නැවත උත්සාහ කරන්න.");
    submitBtn.disabled = false;
  }
});

// Initial fetch
fetchRequests();
setInterval(fetchRequests, 15000); // auto refresh
