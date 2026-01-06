import cv2
import mediapipe as mp
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    image_data = data['image'].split(',')[1]
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)
    
    hand_landmarks = []
    if results.multi_hand_landmarks:
        for landmarks in results.multi_hand_landmarks:
            points = []
            for lm in landmarks.landmark:
                points.append({'x': lm.x, 'y': lm.y, 'z': lm.z})
            hand_landmarks.append(points)
            
    return jsonify({'hands': hand_landmarks})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
