# Full Stack Developer Portfolio

Modern, high-performance portfolio with Express.js, MongoDB, Nodemailer, and Tailwind CSS.
Fully configured for both **Localhost** and **Vercel** deployment.

---

## 🚀 Running Locally (Localhost)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure `.env` File:**
   Open `.env` and fill your Gmail credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/prakhar_portfolio

   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_digit_app_password
   RECEIVER_EMAIL=your_email@gmail.com
   ```

3. **Start the Server:**
   ```bash
   npm start
   ```
   Open your browser at: `http://localhost:5000`

---

## ☁️ Deploying to Vercel

This repository includes `vercel.json` and `api/index.js` pre-configured for Vercel Serverless Functions.

1. Push your code to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. In **Project Settings** -> **Environment Variables**, add:
   - `EMAIL_USER` : Your Gmail address
   - `EMAIL_PASS` : Your 16-character Google App Password
   - `RECEIVER_EMAIL` : Your Gmail address
   - `MONGO_URI` : (Optional/Recommended) Your MongoDB Atlas connection URI
4. Click **Deploy**!
