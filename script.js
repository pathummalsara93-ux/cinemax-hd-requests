// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-AxFPA8bgzCirOBWow7yED5fJHajvSCs",
  authDomain: "cinemax-82ee1.firebaseapp.com",
  databaseURL: "https://cinemax-82ee1-default-rtdb.firebaseio.com",
  projectId: "cinemax-82ee1",
  storageBucket: "cinemax-82ee1.appspot.com",
  messagingSenderId: "256670616410",
  appId: "1:256670616410:web:a2682c387c33f32dae8163",
  measurementId: "G-RV14TYHZ23"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Form submit
const form = document.getElementById('movieRequestForm');
const submitBtn = form.querySelector('button');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const movie = document.getElementById('movieName').value.trim();
    const lang = document.getElementById('language').value;

    if (!movie) return;

    submitBtn.innerText = "SENDING... ⏳";
    submitBtn.style.opacity = "0.7";
    submitBtn.disabled = true;

    db.ref('movieRequests').push({
        movieName: movie,
        language: lang,
        timestamp: Date.now()
    }, function(error) {
        if (error) {
            alert("Error! කරුණාකර නැවත උත්සාහ කරන්න.");
            submitBtn.innerText = "SEND REQUEST 🎬";
            submitBtn.disabled = false;
        } else {
            submitBtn.innerText = "SENT SUCCESSFULLY! ✅";
            submitBtn.style.background = "#25D366";

            setTimeout(() => {
                submitBtn.innerText = "SEND REQUEST 🎬";
                submitBtn.style.background = "#e50914";
                submitBtn.style.opacity = "1";
                submitBtn.disabled = false;
                form.reset();
            }, 3000);
        }
    });
});

// Live Wall
const liveRequests = document.getElementById('liveRequests');
db.ref('movieRequests').on('value', function(snapshot) {
    liveRequests.innerHTML = '';
    const data = snapshot.val();
    if (data) {
        const entries = Object.values(data).sort((a,b) => b.timestamp - a.timestamp);
        entries.forEach(req => {
            const li = document.createElement('li');
            li.textContent = `🎬 ${req.movieName} - ${req.language}`;
            li.style.color = 'white';
            li.style.padding = '8px';
            liveRequests.appendChild(li);
        });
    } else {
        liveRequests.innerHTML = '<li style="color:#888;">No requests yet</li>';
    }
});
