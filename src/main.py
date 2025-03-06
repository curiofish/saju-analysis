from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///saju.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 모델 정의
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    birth_date = db.Column(db.DateTime, nullable=False)
    is_lunar = db.Column(db.Boolean, default=False)
    gender = db.Column(db.String(10), nullable=False)
    location = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/calculate', methods=['POST'])
def calculate_saju():
    data = request.get_json()
    # TODO: 사주 계산 로직 구현
    return jsonify({"message": "사주 계산 기능 준비 중"})

@app.route('/api/analysis', methods=['POST'])
def analyze_saju():
    data = request.get_json()
    # TODO: 사주 분석 로직 구현
    return jsonify({"message": "사주 분석 기능 준비 중"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 