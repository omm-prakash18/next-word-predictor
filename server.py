import requests as req
import numpy as np
import re
import time
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.optimizers import Adam

app = Flask(__name__)
CORS(app)  # allow React frontend to call this server

# ── Globals ───────────────────────────────────────────────────────────────────
model = None
tokenizer = None
max_len = None
vocab_size = None

def ts():
    return datetime.now().strftime("[%Y-%m-%d %H:%M:%S]")

# ── Train on startup ──────────────────────────────────────────────────────────
def train():
    global model, tokenizer, max_len, vocab_size

    print(f"{ts()} Loading dataset...")
    url = "https://raw.githubusercontent.com/karpathy/char-rnn/master/data/tinyshakespeare/input.txt"
    text = req.get(url).text.lower()
    sentences = [s.strip() for s in re.split(r'[.!?]', text) if len(s.strip().split()) >= 4]
    sentences = sentences[:300]
    print(f"{ts()} Loaded {len(sentences)} sentences.")

    print(f"{ts()} Tokenizing...")
    tokenizer = Tokenizer(num_words=150, oov_token=None)
    tokenizer.fit_on_texts(sentences)
    vocab_size = 150
    print(f"{ts()} Vocabulary size: {vocab_size}")

    print(f"{ts()} Building sequences...")
    input_sequences = []
    for sentence in sentences:
        tokens = tokenizer.texts_to_sequences([sentence])[0]
        tokens = [t for t in tokens if t < 150]
        for i in range(1, len(tokens)):
            input_sequences.append(tokens[:i+1])

    print(f"{ts()} Total sequences: {len(input_sequences)}")

    max_len = min(max([len(x) for x in input_sequences]), 10)
    padded = pad_sequences(input_sequences, maxlen=max_len, padding='pre', truncating='pre')
    X = padded[:, :-1]
    y = padded[:, -1]

    print(f"{ts()} Building model...")
    model = Sequential([
        Embedding(input_dim=vocab_size, output_dim=32, input_shape=(X.shape[1],)),
        LSTM(256, return_sequences=True),
        LSTM(128),
        Dense(vocab_size, activation='softmax')
    ])
    model.compile(
        loss='sparse_categorical_crossentropy',
        optimizer=Adam(learning_rate=0.005),
        metrics=['accuracy']
    )

    print(f"{ts()} Starting training...")
    t0 = time.time()
    model.fit(X, y, epochs=200, batch_size=32, verbose=1)
    elapsed = round(time.time() - t0, 1)
    print(f"{ts()} Training complete in {elapsed}s")

# ── /predict endpoint ─────────────────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get('text', '').strip()

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    query_ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{query_ts}] Predicting for: '{text}'")

    seq = tokenizer.texts_to_sequences([text.lower()])[0]
    seq = [t for t in seq if t < 150]

    if not seq:
        return jsonify({'error': 'No valid tokens found in input'}), 400

    seq = pad_sequences([seq], maxlen=max_len - 1, padding='pre')
    probs = model.predict(seq, verbose=0)[0]
    top_indices = np.argsort(probs)[-5:][::-1]
    idx_word = {v: k for k, v in tokenizer.word_index.items() if v < 150}

    predictions = [
        {"word": idx_word.get(int(i), '?'), "prob": round(float(probs[i]) * 100, 1)}
        for i in top_indices
    ]

    return jsonify({
        "predictions": predictions,
        "timestamp": query_ts
    })

# ── /status endpoint ──────────────────────────────────────────────────────────
@app.route('/status', methods=['GET'])
def status():
    return jsonify({"ready": model is not None})

# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    train()
    print(f"\n{ts()} Server ready at http://localhost:5000\n")
    app.run(host='0.0.0.0', port=5000, debug=False)
