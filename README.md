# Shakespeare Next Word Predictor

A simple AI app that predicts the next word in a sentence using Shakespeare's writing style.
You type a phrase, and the model shows you the top 5 words that are most likely to come next.

---

## What's Inside

| File | What it does |
|---|---|
| `server.py` | Python backend — trains the AI model and handles predictions |
| `shakespeare_predictor.jsx` | React frontend — the web interface you interact with |

---

## How It Works

1. The Python server downloads Shakespeare's text from the internet
2. It trains an LSTM (a type of AI that understands word patterns) on that text
3. Once trained, it waits for you to send a phrase
4. You type a phrase in the web app and click **Predict Next Word**
5. The server returns the top 5 predicted next words with confidence percentages

---

## Requirements

Make sure you have these installed on your laptop:

- Python 3.8 or higher
- Node.js (for the React frontend)
- pip (comes with Python)

---

## Setup and Run

### Step 1 — Install Python packages

Open your terminal and run:

```bash
pip install flask flask-cors tensorflow requests
```

### Step 2 — Start the backend server

```bash
python server.py
```

You will see messages like this in the terminal:

```
[2024-01-15 10:23:01] Loading dataset...
[2024-01-15 10:23:03] Tokenizing...
[2024-01-15 10:23:04] Building sequences...
[2024-01-15 10:23:05] Starting training...
...
[2024-01-15 10:26:44] Training complete in 219.3s
[2024-01-15 10:26:44] Server ready at http://localhost:5000
```

> Training takes about 3 to 5 minutes. Please wait until you see "Server ready".

### Step 3 — Open the React frontend

Add `shakespeare_predictor.jsx` to your React project (Vite or Create React App), then start it:

```bash
npm install
npm run dev
```

Open your browser and go to `http://localhost:5173`

---

## How to Use the App

1. Wait for the status dot to turn **green** and say "Model ready"
2. Type any phrase in the text box — for example: `to be or not`
3. Press **Enter** or click the **Predict Next Word** button
4. The app will show you the top 5 predicted next words with a confidence bar

---

## API Endpoints

The Python server has two endpoints:

| Endpoint | Method | What it does |
|---|---|---|
| `/status` | GET | Check if the model is ready |
| `/predict` | POST | Get next word predictions |

Example request to `/predict`:
```json
{ "text": "to be or not" }
```

Example response:
```json
{
  "predictions": [
    { "word": "to",    "prob": 38.2 },
    { "word": "the",   "prob": 22.1 },
    { "word": "be",    "prob": 14.7 },
    { "word": "my",    "prob": 13.6 },
    { "word": "and",   "prob": 11.4 }
  ],
  "timestamp": "2024-01-15 10:27:03"
}
```

---

## AI Model Details

```
Embedding(150 words)
      ↓
  LSTM(256)
      ↓
  LSTM(128)
      ↓
  Dense(150)  ← outputs probability for each word
```

- Trained on 300 sentences from Shakespeare's text
- Uses a vocabulary of the 150 most common words
- Runs fully on your laptop — no GPU needed

---

## Common Problems

**"Could not reach the server"**
→ Make sure `server.py` is running first before opening the web app.

**Status dot stuck on "Model training…"**
→ Training is still in progress. Wait a few more minutes.

**Very low accuracy in early epochs**
→ That's normal. Accuracy improves significantly after epoch 50.

**Port 5000 already in use**
→ Change `port=5000` to `port=5001` at the bottom of `server.py`, and update `BACKEND_URL` in the `.jsx` file to match.

---

## Built With

- **TensorFlow / Keras** — AI model training
- **Flask** — Python web server
- **React** — Frontend interface
- **Shakespeare's Tiny Dataset** — Training data ([source](https://github.com/karpathy/char-rnn))