// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD0szKaFT1THw5HaR3--uE4o3Il8TlxTlo",
  authDomain: "chatforall-86963.firebaseapp.com",
  projectId: "chatforall-86963",
  storageBucket: "chatforall-86963.appspot.com",
  messagingSenderId: "968673332926",
  appId: "1:968673332926:web:6789623a796a769924d8ef",
  measurementId: "G-WX4SKF94PX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Form submission
document.getElementById('movieRequestForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button');
    const movie = document.getElementById('movieName').value.trim();
    const lang = document.getElementById('language').value;

    if(!movie) return;

    submitBtn.innerText = "SENDING... ⏳";
    submitBtn.style.opacity = "0.7";
    submitBtn.disabled = true;

    // Firebase push
    db.ref('movieRequests').push({
        movieName: movie,
        language: lang,
        timestamp: Date.now()
    }).then(() => {
        submitBtn.innerText = "SENT SUCCESSFULLY! ✅";
        submitBtn.style.background = "#25D366";

        setTimeout(() => {
            submitBtn.innerText = "SEND REQUEST 🎬";
            submitBtn.style.background = "#e50914";
            submitBtn.style.opacity = "1";
            submitBtn.disabled = false;
            document.getElementById('movieRequestForm').reset();
        }, 2000);
    }).catch((err) => {
        alert("Error! කරුණාකර නැවත උත්සාහ කරන්න.");
        submitBtn.innerText = "SEND REQUEST 🎬";
        submitBtn.disabled = false;
    });
});

// Real-time wall update
const liveRequests = document.getElementById('liveRequests');

db.ref('movieRequests').on('value', snapshot => {
    liveRequests.innerHTML = '';
    const data = snapshot.val();
    if(data){
        const entries = Object.values(data).sort((a,b) => b.timestamp - a.timestamp);
        entries.forEach(req => {
            const li = document.createElement('li');
            li.textContent = `🎬 ${req.movieName} - ${req.language}`;
            li.style.padding = "8px";
            li.style.borderBottom = "1px solid #333";
            liveRequests.appendChild(li);
        });
    } else {
        liveRequests.innerHTML = '<li style="padding:8px; color:#888;">No requests yet.</li>';
    }
});
