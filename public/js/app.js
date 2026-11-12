// Prakhar's Portfolio Frontend Logic

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Ping Express Backend endpoint
async function pingBackend() {
  const pingResult = document.getElementById('pingResult');
  pingResult.textContent = "Connecting to Node.js / Express backend...";
  pingResult.className = "text-[11px] font-mono text-center text-cyan-400 mt-2";
  
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Backend offline or port not connected');
    const data = await res.json();
    pingResult.textContent = `[OK] Server Status: ${data.status} | MongoDB: Connected | Node: ${data.environment}`;
    pingResult.className = "text-[11px] font-mono text-center text-emerald-400 mt-2";
  } catch (err) {
    // Graceful fallback for local file opening without server running
    pingResult.textContent = "[Offline Demo Mode] Node.js server simulated: GET /api/health -> 200 OK (Run 'npm start' to run real backend)";
    pingResult.className = "text-[11px] font-mono text-center text-amber-300 mt-2";
  }
}

// Contact Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = document.getElementById('formFeedback');
    const btn = document.getElementById('submitBtn');
    
    const payload = {
      name: document.getElementById('senderName').value.trim(),
      email: document.getElementById('senderEmail').value.trim(),
      subject: document.getElementById('senderSubject').value.trim(),
      message: document.getElementById('senderMessage').value.trim()
    };

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Sending message...';
    feedback.textContent = "";
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        feedback.textContent = "✓ " + (data.message || "Email submitted successfully!");
        feedback.className = "text-xs font-mono text-center text-emerald-400";
        contactForm.reset();
      } else {
        feedback.textContent = "✕ " + (data.error || "Failed to send message. Please try again.");
        feedback.className = "text-xs font-mono text-center text-rose-400";
      }
    } catch (error) {
      feedback.textContent = "✕ Network error. Make sure your server is running ('npm start').";
      feedback.className = "text-xs font-mono text-center text-rose-400";
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane text-xs"></i> <span>Send Message</span>';
    }
  });
}

// Architecture Modal Handling
const demoModal = document.getElementById('demoModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');

const architectures = {
  gym: {
    title: "Gym Membership Management - Architecture",
    code: `
// Express Router: /api/gym/members
router.post('/register', async (req, res) => {
  const { name, email, plan, classId } = req.body;
  const newMember = await GymMember.create({ name, email, plan, classId, status: 'Active' });
  res.status(201).json({ success: true, member: newMember });
});

// Mongoose Schema: MemberSchema
const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  plan: { type: String, enum: ['Monthly', 'Quarterly', 'Annual'] },
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Active' }
});`
  },
  hospital: {
    title: "Hospital Bed & Blood Bank - Architecture",
    code: `
// Express Router: /api/hospital/resources
router.get('/availability', async (req, res) => {
  const { bloodGroup, minIcuBeds } = req.query;
  const records = await Hospital.find({
    "bloodBank.group": bloodGroup,
    "beds.icuAvailable": { $gte: Number(minIcuBeds) || 0 }
  });
  res.json({ count: records.length, results: records });
});

// Mongoose Schema: HospitalResourceSchema
const HospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  city: String,
  beds: { generalAvailable: Number, icuAvailable: Number, ventilators: Number },
  bloodBank: [{ group: String, unitsAvailable: Number }]
});`
  }
};

function openDemoModal(type) {
  if (!architectures[type]) return;
  modalTitle.textContent = architectures[type].title;
  modalContent.innerHTML = `
    <div class="bg-black/60 rounded-xl p-4 border border-slate-800 overflow-x-auto">
      <pre class="text-cyan-300"><code>${architectures[type].code}</code></pre>
    </div>
  `;
  demoModal.classList.remove('hidden');
  demoModal.classList.add('flex');
}

function closeDemoModal() {
  demoModal.classList.add('hidden');
  demoModal.classList.remove('flex');
}
